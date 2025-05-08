// U can find this template in the vitest docs also, it got asked and provided the 

import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths' // go check out the docs of vitest, we need to this dependency also in order to resolve the tsconfig paths, so we can use absolute imports in our project
// This is a tool that allows typescript path to basically work
// However, when we search for it, it is used to resolve the ts path for vue projects
// However, we still follow patrick even we can run the vitest without this dependency or even u can say even without this config file

export default defineConfig({
    plugins: [tsconfigPaths()], // to resolve the tsconfig paths, allow vitest to work with typescript environment
    test: {
        environment: 'jsdom', // as we are working in browser environment
        exclude: ['**/node_modules/**', '**/test/**', 'playwright-report/**', 'test-results/**'],
        deps: {
            inline: ['wagmi', '@wagmi/core'] // inline the deps to avoid the error: "Error: Cannot find module 'react/jsx-runtime' from 'node_modules/@rainbow-me/rainbowkit/dist/index.js'"
        }
    },

})