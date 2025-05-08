"use client"

import HomeContent from "@/components/HomeContent";
import { useAccount } from "wagmi"

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div>
      { (!isConnected) ? (
        <div className="flex items-center justify-center min-h-[60vh] p-4 md:p-8">
          <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl border border-blue-200 p-8 flex flex-col items-center text-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Connect your wallet to use <span className="text-blue-600">TSender</span>
            </h2>
            <p className="text-gray-600">
              Start sending gas-efficient airdrops in seconds. Simply connect your wallet and you're ready to go!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
          <div className="max-w-2xl min-w-full xl:min-w-lg w-full lg:mx-auto p-6 flex flex-col gap-6 bg-white rounded-xl ring-[4px] border-2  border-blue-500 ring-blue-500/25">
            <h1 className="text-2xl font-bold text text-gray-800">
              TSender
            </h1>
            <HomeContent />
          </div>
        </div>
      )}
    </div>

  );
}
