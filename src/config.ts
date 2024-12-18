import type { NavItems } from "./types";

export const NAV_ITEMS: NavItems = {
	home: {
		path: "/",
		title: "home",
	},
	blog: {
		path: "/blog",
		title: "blog",
	},
	tags: {
		path: "/tags",
		title: "tags",
	},
	media: {
		path: "/media",
		title: "media",
	},
	about: {
		path: "/about",
		title: "about",
	},
};

export const SITE = {
	// Site's details
	name: "jimididit",
	title: "Blog",
	description: "An Experienced Developer's Experiences",
	url: "https://jdi-blog.vercel.app",
	githubUrl: "https://github.com/jimididit",
	webURL: "https://jimididit.com",
	listDrafts: true,
	image:
		"",
	// YT video channel Id (used in media.astro)
	ytChannelId: "UCrnOK-fhwtwdcjYVnKysm4Q",
	// Optional, user/author settings (example)
	// Author: name
	author: "jimi flynn",
	// Author: Twitter handler
	authorTwitter: "jimdidit",
	// Author: Instagram handler
	authorInsta: "jimi.did.it",
	// Author: Image external source
	authorImage: "https://avatars.githubusercontent.com/u/98427565?v=4",
	// Author: Bio
	authorBio:
		"Programming Geek, Cyber Security Enthusiast, Content Creator",
};

// Ink - Theme configuration
export const PAGE_SIZE = 8;
export const USE_POST_IMG_OVERLAY = false;
export const USE_MEDIA_THUMBNAIL = false;

export const USE_AUTHOR_CARD = true;
export const USE_SUBSCRIPTION = true; /* works only when USE_AUTHOR_CARD is true */

export const USE_VIEW_STATS = true;
