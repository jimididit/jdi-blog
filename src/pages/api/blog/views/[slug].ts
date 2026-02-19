import type { APIRoute } from "astro";
import { getViewsBySlug } from "src/utils/views/turso";
// import { getViewsBySlug } from "src/utils/views/ioredis";
// import { getViewsBySlug } from "src/utils/views/in-memory";

// In development/HMR, you can accidentally make this call numerous times and exceed your quota...
// thus, the in-memory version of `getViewsBySlug` is used

// When deploying, and you have either `ioredis` or `turso` configured with your cloned version - 
// please uncomment the respective line

export const prerender = false;

// Handle CORS preflight requests
export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Max-Age': '86400',
		},
	});
};

export const GET: APIRoute = async ({ params, request }) => {
	try {
		// Log for debugging in production
		console.log('[API] Views endpoint called with slug:', params.slug);
		console.log('[API] Environment check:', {
			hasUrl: !!(process.env.TURSO_DB_URL || import.meta.env.TURSO_DB_URL),
			hasToken: !!(process.env.TURSO_DB_AUTH_TOKEN || import.meta.env.TURSO_DB_AUTH_TOKEN)
		});
		
		if (!params.slug) {
			return new Response(
				JSON.stringify({ views: 0, error: 'Missing slug parameter' }),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				}
			);
		}
		
		const views = await getViewsBySlug(params.slug);
		
		return new Response(
			JSON.stringify({ views }),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Cache-Control': 'no-cache, no-store, must-revalidate',
				},
			}
		);
	} catch (error) {
		console.error('[API] Error fetching views:', error);
		return new Response(
			JSON.stringify({ 
				views: 0, 
				error: 'Failed to fetch views',
				message: error instanceof Error ? error.message : 'Unknown error'
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			}
		);
	}
};
