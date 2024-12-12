import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';

// Initialize Turso Client
const client = createClient({
    url: import.meta.env.TURSO_DB_SUBSCRIBERS_URL,
    authToken: import.meta.env.TURSO_DB_SUBSCRIBERS_AUTH_TOKEN,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        // Insert the subscriber into the database
        const query = `
            INSERT INTO subscribers (id, email)
            VALUES (:id, :email)
            ON CONFLICT(email) DO NOTHING
        `;
        await client.execute({
            sql: query,
            args: [uuidv4(), email]
        });

        // Respond with success
        return res.status(200).json({ message: 'Subscription successful!' });
    } catch (error) {
        console.error('Error saving subscriber:', error);
        return res.status(500).json({ error: 'Failed to save subscriber' });
    }
}
