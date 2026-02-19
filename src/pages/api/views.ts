import type { APIRoute } from "astro";
import { getViewsBySlug } from "src/utils/views/turso";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
	try {
		const slug = url.searchParams.get('slug');

		if (!slug) {
			return new Response(
				JSON.stringify({ views: 0, error: 'Missing slug parameter' }),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		const views = await getViewsBySlug(slug);

		return new Response(
			JSON.stringify({ views }),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error) {
		console.error('Error fetching views:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return new Response(
			JSON.stringify({ 
				views: 0, 
				error: 'Failed to fetch views',
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
