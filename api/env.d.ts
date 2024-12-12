/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly TURSO_DB_SUBSCRIBERS_URL: string;
	readonly TURSO_DB_SUBSCRIBERS_AUTH_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
