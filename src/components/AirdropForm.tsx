"use client";

import InputField from "@/components/ui/InputField";
import { useState, useMemo, useEffect } from "react";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants"
import {
    useChainId,
    useConfig,
    useAccount,
    useWriteContract,
    useReadContracts,
    useWaitForTransactionReceipt
} from "wagmi";
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { calculateTotal, formatTokenAmount } from "@/utils/" 
import { CgSpinner } from "react-icons/cg";

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipientAddresses, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const chainId = useChainId() // This is a hook that returns the current chain id
    const config = useConfig() // This is a hook that returns the current config
    const account = useAccount() // This is a hook that returns the current account
    const total: number = useMemo(() => calculateTotal(amounts), [amounts]) // This is a hook that returns the total amount of tokens to be sent, it will only recalculate (calling the calculateTotal() function) when the amounts ([amounts]) change
    const {data: hash, isPending, error, writeContractAsync } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({
        hash: hash,
        confirmations: 1,
    })
    const {data:tokenData} = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "decimals",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address]
            },
        ],
    })

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("No address found, please use a supported chain!")
            return 0
        }

        // Read from the chain to see if we have approved enough tokens
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`, // we want to make sure this is a string that starts with 0x
            functionName: "allowance",
            args: [account.address, tokenAddress as `0x${string}`],
        })
        return response as number
    }

    async function handleSubmit() {
        console.log("Token Address:", tokenAddress);
        console.log("Recipient Addresses:", recipientAddresses);
        console.log("Amounts:", amounts);
        
        // 1a. If already approved, moved to step 2
        // 1b. Approve our tsender contract to send our tokens
        // 2. Call the airdrop function in our tsender contract
        // 3. Wait for the transaction to be mined

        // U can get the chainId by using vm. but it's much easier to use wagmi hook
        const tsenderAddress = chainsToTSender[chainId]["tsender"];
        console.log("TSender address: ", tsenderAddress, " and chainId: ", chainId);
        
        const approvedAmount = await getApprovedAmount(tsenderAddress);
        console.log("Approved amount: ", approvedAmount);

        if (approvedAmount < total) { 
            const approvedHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tsenderAddress as `0x${string}`, BigInt(total)]
            })
            
            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvedHash
            })
            console.log("Approval confirmed: ", approvalReceipt);

            await writeContractAsync({
                abi: tsenderAbi,
                address: tsenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    recipientAddresses.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ""),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ""),
                    BigInt(total)]
            })            
        } else {
            await writeContractAsync({
                abi: tsenderAbi,
                address: tsenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    recipientAddresses.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ""),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ""),
                    BigInt(total)]
            })
        }
    }

    function getButtonContent() {
        if (isPending) {
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <CgSpinner className="animate-spin" size={20} />
                    <span>Confirming in wallet...</span>
                </div>
            )
        }
        if (isConfirming) {
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <CgSpinner className="animate-spin" size={20} />
                    <span>Waiting for transaction to be included...</span>
                </div>
            )
        }
        if (error || isError) {
            console.log(error)
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <span>Error, see console.</span>
                </div>
            )
        }
        if (isConfirmed) {
            return "Transaction confirmed."
        }
        return "Airdrop Tokens"
    }

    useEffect(() => {
        const savedTokenAddress = localStorage.getItem('tokenAddress')
        const savedRecipients = localStorage.getItem('recipients')
        const savedAmounts = localStorage.getItem('amounts')

        if (savedTokenAddress) setTokenAddress(savedTokenAddress)
        if (savedRecipients) setRecipients(savedRecipients)
        if (savedAmounts) setAmounts(savedAmounts)
    }, []) // [] this means this useEffect will only run once when the component mounts

    useEffect(() => {
        localStorage.setItem('tokenAddress', tokenAddress)
    }, [tokenAddress])
    useEffect(() => {
        localStorage.setItem('recipients', recipientAddresses)
    }, [recipientAddresses])

    useEffect(() => {
        localStorage.setItem('amounts', amounts)
    }, [amounts])

    return (
        <div className="flex-col flex space-y-4">
            <InputField
                label="Token Address"
                placeholder="0x"
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)}
            />

            <InputField
                label="Recipient Addresses"
                placeholder="0x1234567890, 0x0987654321, 0x1122334455"
                value={recipientAddresses}
                onChange={e => setRecipients(e.target.value)}
                large={true}
            />
            <InputField
                label="Amount"
                placeholder="100, 200, 300"
                value={amounts}
                onChange={e => setAmounts(e.target.value)}
                large={true}
            />
            <div className="border border-gray-300 rounded-md shadow-sm p-3">
                <div className="flex flex-col space-y-2 justify-between">
                    <label className="font-bold text-sm text-gray-800 mb-">
                        Transaction Details
                    </label>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-zinc-600">
                                Token Name:
                            </span>
                            <span>
                                {tokenData?.[1]?.result as string}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-zinc-600">
                                Amount (wei):
                            </span>
                            <span>
                                {total}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-zinc-600">
                                Amount (tokens):
                            </span>
                            <span>
                                {formatTokenAmount(total, tokenData?.[0]?.result as number)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm
                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {getButtonContent()}
            </button>
        </div>
    )
}