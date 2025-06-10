import { defineMarkdocConfig } from "@astrojs/markdoc/config";
import shiki from "@astrojs/markdoc/shiki";

/** @type {import('@markdoc/markdoc').Config} */
export const shikiConfig ={
    extends: [
		shiki({
			theme: 'dracula',
			wrap: true,
			langs: []
		}),
	]
}