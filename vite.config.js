import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This repository is a GitHub Pages project site, so assets must be served
// from the repo path rather than the root domain.
export default defineConfig({
	plugins: [react()],
	base: "/me/",
});
