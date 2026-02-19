import type { APIRoute } from "astro";
import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";

// Create client getter function to ensure env vars are available
const getClient = () => {
    // Use process.env for Vercel compatibility, fallback to import.meta.env for Astro dev
    const url = process.env.TURSO_DB_SUBSCRIBERS_URL || import.meta.env.TURSO_DB_SUBSCRIBERS_URL;
    const authToken = process.env.TURSO_DB_SUBSCRIBERS_AUTH_TOKEN || import.meta.env.TURSO_DB_SUBSCRIBERS_AUTH_TOKEN;
    
    if (!url || !authToken) {
        console.error('Missing Turso subscriber credentials:', {
            url: url ? 'Present' : 'Missing',
            authToken: authToken ? 'Present' : 'Missing'
        });
        throw new Error('TURSO_DB_SUBSCRIBERS_URL and TURSO_DB_SUBSCRIBERS_AUTH_TOKEN must be set');
    }
    
    return createClient({
        url,
        authToken
    });
};

// Initialize table if it doesn't exist
let tableInitialized = false;
const initializeTable = async (client: ReturnType<typeof getClient>) => {
    if (tableInitialized) return;
    
    try {
        await client.execute(`
            CREATE TABLE IF NOT EXISTS subscribers (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        tableInitialized = true;
        console.log('subscribers table initialized successfully');
    } catch (error) {
        console.error('Error initializing subscribers table:', error);
        // Don't throw - allow the function to continue
    }
};

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
            return new Response(
                JSON.stringify({ error: 'Invalid email address' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Get client instance
        const client = getClient();
        
        // Ensure table exists
        await initializeTable(client);
        
        // Insert the subscriber into the database
        // LibSQL/Turso uses named parameters with object args, not array
        const id = uuidv4();
        await client.execute({
            sql: `
                INSERT INTO subscribers (id, email)
                VALUES (:id, :email)
                ON CONFLICT(email) DO NOTHING
            `,
            args: {
                id,
                email
            }
        });

        // Respond with success
        return new Response(
            JSON.stringify({ message: 'Subscription successful!' }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Error saving subscriber:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(
            JSON.stringify({ 
                error: 'Failed to save subscriber',
                message: errorMessage
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};
