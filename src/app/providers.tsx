// This file will be gonna a list of tools that are going to wrap around our entire application
// One of the tools will be the rainbowkitconfig
// Why we want to wrap it around our entire application is bcs we want everything inside of our application to know about our wallet, to be able to access our wallet

"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import config from "@/RainbowKitConfig"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit"
import { useState } from "react"
import "@rainbow-me/rainbowkit/styles.css"

export function Providers(props: { children: ReactNode}) {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {props.children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}