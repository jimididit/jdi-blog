/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	/* readonly REDIS_URI: string; */
	readonly SITE_URI: string;
	readonly OAUTH_GITHUB_CLIENT_ID: string;
	readonly OAUTH_GITHUB_CLIENT_SECRET: string;
	readonly OAUTH_GITHUB_REPO_ID: string;
	readonly TURSO_DB_URL: string;
	readonly TURSO_DB_AUTH_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
