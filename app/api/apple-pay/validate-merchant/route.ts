import { NextRequest, NextResponse } from "next/server";
import https from 'node:https';

export const runtime = 'nodejs';

const MERCHANT_IDENTIFIER = 'merchant.com.jessbodie.applepay';
const DISPLAY_NAME = 'Jess Bodie Richards (Sandbox)';
const INITIATIVE_CONTEXT = 'www.jessbodie.com';

export async function POST(request: NextRequest) {
    const { validationURL } = await request.json();

    if (!validationURL) {
        return NextResponse.json({ error: 'Missing validationURL'}, {status: 400});
    }

    const url = new URL(validationURL);
    if (!url.hostname.endsWith('.apple.com')) {
        return NextResponse.json({ error: 'Untrusted validation host' }, { status: 400});
    }

    const cert = process.env.APPLE_PAY_MERCHANT_CERT!;
    const key = process.env.APPLE_PAY_MERCHANT_KEY!;

    const body = JSON.stringify({
        merchantIdentifier: MERCHANT_IDENTIFIER,
        displayName: DISPLAY_NAME,
        initiative: 'web',
        initiativeContext: INITIATIVE_CONTEXT,
    });

    const merchantSession = await new Promise((resolve, reject) => {
        const req = https.request(
            {
                hostname: url.hostname,
                path: url.pathname,
                method: 'POST',
                cert,
                key,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body),
                },
            },
            (res) => {
                let data ='';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >=200 && res.statusCode < 300) {
                        resolve(JSON.parse(data));
                    } else {
                        reject(new Error(`Apple returned ${res.statusCode}: ${data}`));
                    }
                });
            }
        );
        req.on('error', reject);
        req.write(body);
        req.end();
    });

    return NextResponse.json(merchantSession);
}