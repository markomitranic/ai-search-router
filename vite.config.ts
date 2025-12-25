import { resolve } from "node:path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	build: {
		outDir: "./dist/chromium",
		emptyOutDir: true,
		minify: "esbuild",
		rollupOptions: {
			input: {
				background: resolve(__dirname, "src/background.ts"),
				search: resolve(__dirname, "src/search.ts"),
				"popup/popup": resolve(__dirname, "src/popup/popup.ts"),
				"options/options": resolve(__dirname, "src/options/options.ts"),
			},
			output: {
				entryFileNames: "[name].js",
				assetFileNames: "[name][extname]",
				format: "es",
				manualChunks: undefined, // Disable code splitting - inline everything
			},
		},
		target: "es2020",
		sourcemap: false,
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: "manifest.json", dest: "." },
				{ src: "src/search.html", dest: "." },
				{ src: "src/popup/popup.html", dest: "popup" },
				{ src: "src/popup/popup.css", dest: "popup" },
				{ src: "src/options/options.html", dest: "options" },
				{ src: "src/options/options.css", dest: "options" },
				{ src: "icons", dest: "." },
			],
		}),
	],
});
