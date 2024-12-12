import { createClient } from "@libsql/client";

export const client = createClient({
    url: import.meta.env.TURSO_DB_URL,
    authToken: import.meta.env.TURSO_DB_AUTH_TOKEN
});

console.log("TURSO_DB_URL:", import.meta.env.TURSO_DB_URL);
console.log("TURSO_DB_AUTH_TOKEN:", import.meta.env.TURSO_DB_AUTH_TOKEN ? "Present" : "Missing");

(async () => {
    try {
        const result = await client.execute('SELECT 1');
        console.log('Turso connection test successful:', result);
    } catch (error) {
        console.error('Error testing Turso connection:', error);
    }
})();

export const getViewsBySlug = async (slug: string) => {
    if (!slug) return 0;

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
    } catch (error) {
        console.error('Error in getViewsBySlug:', error);
        return 0;
    }
};

