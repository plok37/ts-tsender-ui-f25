"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { anvil, zksync } from "wagmi/chains" // This is the allowed chains that the application will allow

export default getDefaultConfig({
    appName: "TSender",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [anvil, zksync],
    ssr: false, // As we want to make a static site
})
