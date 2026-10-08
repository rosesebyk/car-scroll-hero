import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the repo name or every asset 404s on GH Pages.
export default defineConfig({ base: '/car-scroll-hero/', plugins: [react()] })
