import { vitePlugin as remix } from "@remix-run/dev"
import { defineConfig } from "vite"
import paths from "vite-tsconfig-paths"
import icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    process.IS_STORYBOOK ? [] : [remix()],
    paths({ ignoreConfigErrors: true }),
    icons({ compiler: 'jsx', jsx: 'react' })
  ],
})
