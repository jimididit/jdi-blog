import { z, defineCollection } from "astro:content";

const faqSchema = z.object({
	question: z.string(),
	answer: z.string(),
}).array().optional();

const blogCollection = defineCollection({
	schema: z.object({
		title: z
			.string()
			.max(100, "The title length must be less than or equal to 100 chars"),
		description: z.string(),
		tags: z.array(z.string()),
		author: z.string(),
		authorImage: z.string().optional(),
		authorTwitter: z.string(),
		date: z.string(),
		image: z.string().optional(),
		category: z.string(),
		faq: faqSchema,
	}),
});

export const collections = {
	blog: blogCollection,
};
