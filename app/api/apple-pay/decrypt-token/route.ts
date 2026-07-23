import { NextRequest, NextResponse } from "next/server";
import crypto from 'node:crypto';

export const runtime = 'nodejs';

const MERCHANT_IDENTIFIER = 'merchant.com.jessbodie.applepay';

function decryptToken(
    parsed: { ciphertext: string, ephemeralPublicKey: string }, 
    key: string,
) {
    
    const ephemeralPublicKey = crypto.createPublicKey({ 
        key: Buffer.from(parsed.ephemeralPublicKey, 'base64'), 
        format: 'der', 
        type: 'spki' 
    });
    const privateKey = crypto.createPrivateKey(key);
    const sharedSecret = crypto.diffieHellman({ privateKey, publicKey: ephemeralPublicKey });

    // ---------------------------------------------------------------------------
    // EC_v1 symmetric-key derivation + AES-GCM decryption.
    //
    // Attribution: I implemented the rest of this Apple Pay integration hands-on,
    // but this cryptographic section 
    // (ECDH shared secret → key-derivation function → authenticated decrypt) 
    // was written with substantial help from Claude Code. 
    //
    // Sources: Apple "Restoring the Symmetric Key" and "Payment Token Format
    // Reference"; NIST SP 800-56A §5.8.1 (Concat KDF). The exact byte framing
    // (0x0D length prefix, "id-aes256-GCM", 4-byte counter) follows common EC_v1
    // reference implementations.
    // ---------------------------------------------------------------------------
    const counter = Buffer.from([0x00, 0x00, 0x00, 0x01]);
    const algorithmId = Buffer.concat([
        Buffer.from([0x0d]),
        Buffer.from('id-aes256-GCM', 'ascii'),
    ]);
    const partyU = Buffer.from('Apple', 'ascii');
    const partyV = crypto.createHash('sha256').update(MERCHANT_IDENTIFIER).digest();
    const kdfInput = Buffer.concat([counter, sharedSecret, algorithmId, partyU, partyV]);
    const symmetricKey = crypto.createHash('sha256').update(kdfInput).digest();

    const cipherBytes = Buffer.from(parsed.ciphertext, 'base64');
    const authTag   = cipherBytes.subarray(cipherBytes.length - 16);
    const encrypted = cipherBytes.subarray(0, cipherBytes.length - 16);
    const iv = Buffer.alloc(16); // per Apple EC_v1: IV of 16 zero bytes, no AAD

    const decipher = crypto.createDecipheriv('aes-256-gcm', symmetricKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
}

export async function POST(request: NextRequest) {
    const { paymentData } = await request.json();

    if (!paymentData) {
        return NextResponse.json({ error: 'Missing paymentData'}, {status: 400});
    }

    const key = process.env.APPLE_PAY_PAYMENT_PROCESSING_KEY!;

    const parsed = {
        ciphertext: paymentData.data,
        ephemeralPublicKey: paymentData.header.ephemeralPublicKey,
        publicKeyHash:  paymentData.header.publicKeyHash,
        transactionId: paymentData.header.transactionId,
        version: paymentData.version
    };
    if (parsed.version !== 'EC_v1') {
        return NextResponse.json({ error: `Unsupported version ${parsed.version}` }, {status: 400})
    } 

    let payment;
    try {
        payment = decryptToken(parsed, key)
    } catch (err) {
        console.log('Decryption failed:', err);
        return NextResponse.json({ error: 'Decryption failed'}, {status: 500});
    }
    console.log('DECRYPTED (**Sandbox demo only**):', payment);
    return NextResponse.json({ ok: true }); //TODO, ADD DEBUG PANEL
}