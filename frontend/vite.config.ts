/// <reference types="vitest" />
import { defineConfig, loadEnv, type ServerOptions } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// import { sentryVitePlugin } from '@sentry/vite-plugin'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

type TMode = 'development' | 'test' | 'production'

interface AppEnv {
    PORT: string
    BACKEND_PROXY: string
    SENTRY_TOKEN: string
    VITE_ENV: TMode
}

const validateEnv = (envMode: TMode, env: AppEnv) => {
    const requiredVars: (keyof AppEnv)[] = ['PORT', 'BACKEND_PROXY', 'VITE_ENV']

    if (envMode === 'production') {
        requiredVars.push('SENTRY_TOKEN')
    }

    for (const key of requiredVars) {
        if (!env[key]) {
            throw new Error(`${key} is missing! Please define it in your .env.${envMode}`)
        }
    }
}

const normalizePort = (port: string) => {
    const normalizedPort = parseInt(port)
    if (isNaN(normalizedPort)) {
        throw new Error(`Invalid port value: ${port}`)
    }

    return normalizedPort
}

export default defineConfig(({ mode }) => {
    const envMode = mode as TMode
    const env = loadEnv(envMode, process.cwd(), '') as unknown as AppEnv

    validateEnv(envMode, env)

    const port = normalizePort(env.PORT)

    const config: ServerOptions = {
        port,
        open: true,
        proxy: {
            '/api': {
                target: env.BACKEND_PROXY,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }

    return {
        plugins: [
            TanStackRouterVite(),
            react(),
            tailwindcss(),
            // env.VITE_ENV === 'production' &&
            //     sentryVitePlugin({
            //         org: 'bb-coder-guy',
            //         project: 'react-production-setup',
            //         authToken: env.SENTRY_TOKEN,
            //         sourcemaps: {
            //             filesToDeleteAfterUpload: 'dist/assets/**/*.map'
            //         }
            //     })
        ],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: 'src/setupTests.ts',
            include: ['src/**/*.{test,spec}.{ts,tsx}'],
            coverage: {
                reporter: ['json', 'html'],
                include: ['src/**/*.ts', 'src/**/*.tsx'],
                exclude: ['coverage', 'dist', 'build', 'src/setupTests.ts', 'src/**/*.{test,spec}.{ts,tsx}'],
                thresholds: {
                    statements: 30,
                    branches: 30,
                    functions: 30,
                    lines: 30
                }
            }
        },
        resolve: {
            alias: {
                '@features': path.resolve(__dirname, 'src/features'),
                '@shared': path.resolve(__dirname, 'src/shared'),
                '@': path.resolve(__dirname, './src')
            }
        },
        server: config,
        preview: config,
        build: {
            minify: true,
            sourcemap: env.VITE_ENV === 'production',
            rollupOptions: {
                external: [/.*\.(test|spec)\.(ts|tsx)$/]
            }
        }
    }
})
