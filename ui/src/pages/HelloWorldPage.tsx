"use client";

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useState } from "react";

const chainId = "theta-testnet-001";
const treasuryAddress = "cosmos1dknqh4amzlechgzpp3rtrzygv33xwfq9l6ydjp";

const ExecuteMsg = {
	doStuff: (input) => ({
		do_stuff: { input },
	}),
	futureReady: (output) => ({
		future_ready: { output },
	}),
};

const QueryMsg = {
	getFutureResult: (id) => ({
		get_future_result: { id },
	}),
};

export function Hello() {
	const [inputValue, setInputValue] = useState("");
	const [outputText, setOutputText] = useState("");

	const handleButton1Click = async () => {
		// Enable the chain
		await window.keplr.enable(chainId);
		const offlineSigner = window.keplr.getOfflineSigner(chainId);
		const accounts = await offlineSigner.getAccounts();

		const client = await SigningCosmWasmClient.connectWithSigner(
			"https://rpc.sentry-01.theta-testnet.polypore.xyz",
			offlineSigner,
		);

		// Convert ATOM to uatom (1 ATOM = 1,000,000 uatom)
		const uatomAmount = Math.floor(
			Number.parseFloat("0.01") * 1_000_000,
		).toString();

		const balance = await client.getBalance(accounts[0].address, "uatom");
		const totalNeeded = BigInt(uatomAmount) + BigInt(5000);
		console.log("🚀 ~ handleDonate ~ balance:", balance);
		console.log("🚀 totalNeeded", totalNeeded);
		if (BigInt(balance.amount) < totalNeeded) {
			// donation + fees
			throw new Error("Insufficient balance for donation and fees");
		}

		const msg = ExecuteMsg.doStuff("execute offchain AI model for safe content :)");
		const fee = {
			amount: [
				{
					denom: "uatom",
					amount: "5000",
				},
			],
			gas: "200000",
		};

		return await client.execute(accounts[0].address, treasuryAddress, msg, fee);
	};

	const handleButton2Click = () => {
		setOutputText(`Button 2 clicked! Input value: ${inputValue}`);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-md w-96">
				<h1 className="text-2xl font-bold mb-6 text-center">Account Page</h1>
				<div className="space-y-4">
					<input
						type="text"
						placeholder="Enter test value"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<div className="flex space-x-4">
						<button
							type="button"
							onClick={handleButton1Click}
							className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Button 1
						</button>
						<button
							type="button"
							onClick={handleButton2Click}
							className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Button 2
						</button>
					</div>
					{outputText && (
						<div className="mt-4 p-4 bg-gray-100 rounded-md">
							<p className="text-center">{outputText}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
