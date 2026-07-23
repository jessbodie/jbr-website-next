import * as asn1js from 'asn1js';
import * as pkijs from 'pkijs';
import { webcrypto } from 'node:crypto';
import { appleRootCA } from '../certs/appleRootCA';

// ---------------------------------------------------------------------------
// EC_v1 Apple Pay payment-token signature verification (Step 1 of Apple's
// "Payment Token Format Reference").
//
// Scope note: this implements the substantive checks -- confirm Apple's marker
// OIDs, verify the ECDSA signature, and chain to the pinned Apple Root CA - G3.
// It deliberately omits Step 1's 5-minute CMS-signing-time replay check: this
// sandbox never charges and never persists a transaction, so there is nothing
// to replay against. A production processor would add it.
//
// Attribution: This signature verification module was written by Claude Code.
//
// Sources: Apple "Payment Token Format Reference", Step 1; PKI.js (CMS /
// SignedData) and asn1js. Node's built-in `crypto` cannot parse a detached
// CMS signature, which is why PKI.js is used here.
// ---------------------------------------------------------------------------

// Apple's custom marker OIDs. Only their PRESENCE matters, not their value.
const LEAF_OID = '1.2.840.113635.100.6.29';
const INTERMEDIATE_OID = '1.2.840.113635.100.6.2.14';

// PKI.js needs a WebCrypto engine; Node exposes one via `webcrypto`. Set once.
if (!pkijs.getEngine().crypto) {
    pkijs.setEngine(
        'nodeEngine',
        new pkijs.CryptoEngine({ name: 'nodeEngine', crypto: webcrypto as unknown as Crypto }),
    );
}

interface ApplePayHeader {
    ephemeralPublicKey: string;
    publicKeyHash: string;
    transactionId: string;
    applicationData?: string;
}

interface ApplePayPaymentData {
    data: string;
    signature: string;
    version: string;
    header: ApplePayHeader;
}

export interface SignatureVerification {
    valid: boolean;
    reason?: string;
}

/** Node Buffer -> a clean ArrayBuffer (Buffers are views into a shared pool). */
function toArrayBuffer(buf: Buffer): ArrayBuffer {
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

function certHasOID(cert: pkijs.Certificate, oid: string): boolean {
    return (cert.extensions ?? []).some((ext) => ext.extnID === oid);
}

export async function verifyTokenSignature(
    paymentData: ApplePayPaymentData,
): Promise<SignatureVerification> {
    const { header } = paymentData;

    // Parse the detached CMS (PKCS#7 SignedData) from the base64 signature.
    const sigBytes = toArrayBuffer(Buffer.from(paymentData.signature, 'base64'));
    const asn1 = asn1js.fromBER(sigBytes);
    if (asn1.offset === -1) {
        return { valid: false, reason: 'could not parse CMS signature (malformed ASN.1)' };
    }

    let signedData: pkijs.SignedData;
    try {
        const contentInfo = new pkijs.ContentInfo({ schema: asn1.result });
        signedData = new pkijs.SignedData({ schema: contentInfo.content });
    } catch (err) {
        return { valid: false, reason: `not a CMS SignedData structure: ${(err as Error).message}` };
    }

    // Step 1a: confirm both Apple marker OIDs are present (leaf + intermediate).
    const certs = (signedData.certificates ?? []).filter(
        (c): c is pkijs.Certificate => c instanceof pkijs.Certificate,
    );
    const leaf = certs.find((c) => certHasOID(c, LEAF_OID));
    const intermediate = certs.find((c) => certHasOID(c, INTERMEDIATE_OID));
    if (!leaf || !intermediate) {
        return { valid: false, reason: 'required Apple marker OIDs missing from certificate chain' };
    }

    // Step 1b/1c: verify the ECDSA-with-SHA256 signature over the concatenation
    // of ephemeralPublicKey || data || transactionId || applicationData, AND the
    // X.509 chain leaf -> intermediate -> pinned Apple Root CA - G3.
    const parts = [
        Buffer.from(header.ephemeralPublicKey, 'base64'),
        Buffer.from(paymentData.data, 'base64'),
        Buffer.from(header.transactionId, 'hex'),
    ];
    if (header.applicationData) parts.push(Buffer.from(header.applicationData, 'hex'));
    const signedContent = toArrayBuffer(Buffer.concat(parts));

    const rootAsn1 = asn1js.fromBER(toArrayBuffer(pemToDer(appleRootCA)));
    const rootCert = new pkijs.Certificate({ schema: rootAsn1.result });

    try {
        const result = await signedData.verify({
            signer: 0,
            data: signedContent,
            trustedCerts: [rootCert],
            checkChain: true,
            extendedMode: true,
        });
        if (!result.signatureVerified) {
            return { valid: false, reason: 'ECDSA signature did not verify' };
        }
        if (!result.signerCertificateVerified) {
            return { valid: false, reason: 'certificate chain did not verify to Apple Root CA - G3' };
        }
    } catch (err) {
        return { valid: false, reason: `signature/chain verification failed: ${(err as Error).message}` };
    }

    return { valid: true };
}

/** Strip PEM armor and base64-decode to DER bytes. */
function pemToDer(pem: string): Buffer {
    const body = pem
        .replace(/-----BEGIN CERTIFICATE-----/, '')
        .replace(/-----END CERTIFICATE-----/, '')
        .replace(/\s+/g, '');
    return Buffer.from(body, 'base64');
}
