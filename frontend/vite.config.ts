import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		target: "esnext",
		sourcemap: false,
		minify: "esbuild",
		cssMinify: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom", "react-router-dom"],
					ui: ["antd", "@ant-design/icons"],
				},
			},
		},
	},
	server: {
		port: 5173,
	},
});
