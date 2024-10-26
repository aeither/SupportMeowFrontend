// hooks/useWardenContract.ts
import { toBech32 } from "@cosmjs/encoding";
import { Int53 } from "@cosmjs/math";
import { makeAuthInfoBytes, makeSignDoc } from "@cosmjs/proto-signing";
import {
  cosmos,
  cosmwasm,
  ethermint,
  getSigningCosmwasmClientOptions,
  google,
  warden,
} from "@wardenprotocol/wardenjs";
import { ethers } from "ethers";
import { useState } from "react";

const { Any } = google.protobuf;
const { TxBody, TxRaw, SignDoc } = cosmos.tx.v1beta1;
const { MsgExecuteContract } = cosmwasm.wasm.v1;
const PubKey = ethermint.crypto.v1.ethsecp256k1.PubKey;

interface UseWardenContractConfig {
	contractAddress: string;
	chainId: string;
	rpcEndpoint?: string;
	restEndpoint?: string;
	mnemonic?: string;
}

interface ExecuteMsg {
	[key: string]: any;
}

export function useWardenContract({
	contractAddress,
	chainId,
	rpcEndpoint = "http://localhost:26657",
	restEndpoint = "http://localhost:1317",
	mnemonic,
}: UseWardenContractConfig) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const queryContract = async <T>(queryMsg: any): Promise<T> => {
		setIsLoading(true);
		setError(null);

		try {
			const encodedQuery = Buffer.from(JSON.stringify(queryMsg)).toString(
				"base64",
			);
			const endpoint = `${restEndpoint}/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${encodedQuery}`;

			const response = await fetch(endpoint, {
				method: "GET",
				headers: { Accept: "application/json" },
			});

			if (!response.ok) {
				throw new Error(`Query failed with status: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (err) {
			console.error("REST query failed, trying RPC...");
			try {
				const client = await warden.ClientFactory.createRPCQueryClient({
					rpcEndpoint,
				});

				const response = await client.cosmwasm.wasm.v1.smartContractState({
					address: contractAddress,
					queryData: Buffer.from(JSON.stringify(queryMsg)),
				});

				return response as T;
			} catch (rpcErr) {
				const error = new Error("Both REST and RPC queries failed");
				setError(error);
				throw error;
			}
		} finally {
			setIsLoading(false);
		}
	};

	const executeContract = async (msg: ExecuteMsg, customFee?: any) => {
		if (!mnemonic) {
			throw new Error("Mnemonic is required for contract execution");
		}

		setIsLoading(true);
		setError(null);

		try {
			const ethWallet = ethers.Wallet.fromPhrase(mnemonic);
			const ethAddress = ethWallet.address;
			const wardenAddress = toBech32("warden", ethers.getBytes(ethAddress));
			const pubkey = ethers.getBytes(ethWallet.publicKey);

			const fee = customFee ?? {
				amount: [{ denom: "award", amount: "100" }],
				gas: "500000",
			};

			const txBody = TxBody.fromPartial({
				messages: [
					{
						typeUrl: MsgExecuteContract.typeUrl,
						value: MsgExecuteContract.fromPartial({
							sender: wardenAddress,
							contract: contractAddress,
							msg: new TextEncoder().encode(JSON.stringify(msg)),
						}),
					},
				],
			});

			const signDoc = await buildSignDoc(
				chainId,
				wardenAddress,
				pubkey,
				txBody,
				fee,
				rpcEndpoint,
			);

			const signedTx = await signTransaction(ethWallet, signDoc);
			const result = await broadcastTx(signedTx, restEndpoint);

			return result;
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Execution failed");
			setError(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		queryContract,
		executeContract,
		isLoading,
		error,
	};
}

// Helper functions
async function buildSignDoc(
	chainId: string,
	wardenAddr: string,
	pubkey: Uint8Array,
	txBody: any,
	fee: any,
	rpcEndpoint: string,
) {
	const account = await fetchAccount(wardenAddr, rpcEndpoint);

	const pubk = Any.fromPartial({
		typeUrl: PubKey.typeUrl,
		value: PubKey.encode({ key: pubkey }).finish(),
	});

	const txBodyEncodeObject = {
		typeUrl: TxBody.typeUrl,
		value: txBody,
	};

	const { registry } = getSigningCosmwasmClientOptions();
	const txBodyBytes = registry.encode(txBodyEncodeObject);
	const gasLimit = Int53.fromString(fee.gas).toNumber();
	const authInfoBytes = makeAuthInfoBytes(
		[{ pubkey: pubk, sequence: account.sequence }],
		fee.amount,
		gasLimit,
	);

	return makeSignDoc(
		txBodyBytes,
		authInfoBytes,
		chainId,
		Number(account.accountNumber),
	);
}

async function signTransaction(wallet: ethers.Wallet, signDoc: any) {
	const signDocBytes = SignDoc.encode(signDoc).finish();
	const signatureRaw = wallet.signingKey.sign(ethers.keccak256(signDocBytes));
	const signature = ethers.Signature.from(signatureRaw);
	const signatureRS = ethers.concat([signature.r, signature.s]);
	const signatureRSBytes = ethers.getBytes(signatureRS);

	return TxRaw.encode(
		TxRaw.fromPartial({
			authInfoBytes: signDoc.authInfoBytes,
			bodyBytes: signDoc.bodyBytes,
			signatures: [signatureRSBytes],
		}),
	).finish();
}

async function fetchAccount(address: string, rpcEndpoint: string) {
	const client = await warden.ClientFactory.createRPCQueryClient({
		rpcEndpoint,
	});
	const { account } = await client.cosmos.auth.v1beta1.account({ address });
	if (!account) {
		throw new Error("Failed to retrieve account from chain");
	}
	return account;
}

async function broadcastTx(bytes: Uint8Array, restEndpoint: string) {
	const res = await fetch(`${restEndpoint}/cosmos/tx/v1beta1/txs`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			tx_bytes: ethers.encodeBase64(bytes),
			mode: "BROADCAST_MODE_SYNC",
		}),
	});
	return res.json();
}
