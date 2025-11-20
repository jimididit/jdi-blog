import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import markdoc from "@astrojs/markdoc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import remarkCodeTitles from 'remark-code-titles'
import decapCmsOauth from "astro-decap-cms-oauth";

// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// https://astro.build/config
export default defineConfig( /** @type {import('astro').AstroUserConfig} */{
  output: 'server',
  site: 'https://blog.jimididit.com',
  server: {
    port: 4321, // The port to run the dev server on.
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'ayu-dark',
      wrap: true,
      langs: ['batch', 'bash', 'markdown', 'powershell', 'ps1', 'html']
    },
    remarkPlugins: [
      remarkCodeTitles
    ]
  },
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'ayu-dark',
        wrap: true,
        langs: ['batch', 'bash', 'markdown', 'ini', 'powershell', 'ps1', 'html']
      },
    }), 
    markdoc({
      allowHTML: true,
    }),
    svelte(), 
    tailwind({
      applyBaseStyles: false,
    }), 
    sitemap({
      lastmod: new Date(),
      changefreq: 'daily',
      priority: 1,
    }),
    decapCmsOauth()
  ],
  vite: {
    plugins: [],
    resolve: {
      alias: {
        $: path.resolve(__dirname, './src')
      }
    },
    optimizeDeps: {
      allowNodeBuiltins: true
    }
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: {
      enabled: true,
    },
    imageService: true,
    devImageService: 'sharp'
  })
});