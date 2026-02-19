import { createClient } from "@libsql/client";

// Create client getter function to ensure env vars are available
const getClient = () => {
    // Use process.env for Vercel compatibility, fallback to import.meta.env for Astro dev
    const url = process.env.TURSO_DB_URL || import.meta.env.TURSO_DB_URL;
    const authToken = process.env.TURSO_DB_AUTH_TOKEN || import.meta.env.TURSO_DB_AUTH_TOKEN;
    
    if (!url || !authToken) {
        console.error('Missing Turso credentials:', {
            url: url ? 'Present' : 'Missing',
            authToken: authToken ? 'Present' : 'Missing'
        });
        throw new Error('TURSO_DB_URL and TURSO_DB_AUTH_TOKEN must be set');
    }
    
    return createClient({
        url,
        authToken
    });
};

// Initialize the post_stats table if it doesn't exist
let tableInitialized = false;

const initializeTable = async (client: ReturnType<typeof getClient>) => {
    if (tableInitialized) return;
    
    try {
        await client.execute(`
            CREATE TABLE IF NOT EXISTS post_stats (
                uid TEXT PRIMARY KEY,
                slug TEXT UNIQUE NOT NULL,
                views INTEGER NOT NULL DEFAULT 0
            )
        `);
        tableInitialized = true;
        console.log('post_stats table initialized successfully');
    } catch (error) {
        console.error('Error initializing post_stats table:', error);
        // Don't throw - allow the function to continue and handle gracefully
    }
};

export const getViewsBySlug = async (slug: string) => {
    if (!slug) return 0;

    // Get client instance (creates new one each time to ensure env vars are fresh)
    const client = getClient();
    
    // Ensure table exists before proceeding
    await initializeTable(client);

    try {
        console.log('Starting transaction...');
        const transaction = await client.transaction('write');

        console.log('Selecting existing views...');
        const rsSelected = await transaction.execute({
            sql: 'SELECT * FROM post_stats WHERE slug = :slug',
            args: { slug },
        });

        console.log('Selected views:', rsSelected.rows);

        const prevViewCount = rsSelected.rows?.length
            ? rsSelected.rows[0].views as number
            : 0;

        console.log('Previous view count:', prevViewCount);

        const rsUpdated = await transaction.execute({
            sql: `
                INSERT INTO post_stats (uid, slug, views)
                VALUES (:uid, :slug, :views)
                ON CONFLICT(slug) DO UPDATE SET views = :views
                RETURNING views
            `,
            args: {
                uid: crypto.randomUUID(),
                slug,
                views: prevViewCount + 1,
            },
        });

        console.log('Updated views:', rsUpdated.rows);

        await transaction.commit();
        console.log('Transaction committed.');
        return rsUpdated.rows[0].views as number;
    } catch (error: any) {
        console.error('Error in getViewsBySlug:', error);
        
        // If table doesn't exist, try initializing and retry once
        if (error?.cause?.proto?.message?.includes('no such table: post_stats') || 
            error?.message?.includes('no such table: post_stats')) {
            console.log('Table missing, reinitializing...');
            tableInitialized = false;
            await initializeTable(client);
            
            // Retry once after initialization
            try {
                const transaction = await client.transaction('write');
                const rsSelected = await transaction.execute({
                    sql: 'SELECT * FROM post_stats WHERE slug = :slug',
                    args: { slug },
                });
                
                const prevViewCount = rsSelected.rows?.length
                    ? rsSelected.rows[0].views as number
                    : 0;
                
                const rsUpdated = await transaction.execute({
                    sql: `
                        INSERT INTO post_stats (uid, slug, views)
                        VALUES (:uid, :slug, :views)
                        ON CONFLICT(slug) DO UPDATE SET views = :views
                        RETURNING views
                    `,
                    args: {
                        uid: crypto.randomUUID(),
                        slug,
                        views: prevViewCount + 1,
                    },
                });
                
                await transaction.commit();
                return rsUpdated.rows[0].views as number;
            } catch (retryError) {
                console.error('Error on retry:', retryError);
                return 0;
            }
        }
        
        return 0;
    }
};

