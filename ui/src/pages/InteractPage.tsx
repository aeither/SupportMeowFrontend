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

const { Any } = google.protobuf;
const { TxBody, TxRaw, SignDoc } = cosmos.tx.v1beta1;
const { MsgExecuteContract } = cosmwasm.wasm.v1;
const PubKey = ethermint.crypto.v1.ethsecp256k1.PubKey;

const CONTRACT_ADDRESS =
	"warden14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9srt30us";
const CHAIN_ID = "warden_1337-1";

export function InteractPage() {
	const queryFutureResult = async (id: number) => {
		try {
			const client = await warden.ClientFactory.createRPCQueryClient({
				rpcEndpoint: "http://localhost:26657",
			});

			const query = {
				get_future_result: {
					id,
				},
			};

			const queryMsg = new TextEncoder().encode(JSON.stringify(query));
			const result = await client.cosmwasm.wasm.v1.queryContract({
				address: CONTRACT_ADDRESS,
				queryData: queryMsg,
			});
			console.log("🚀 ~ queryFutureResult ~ result:", result)

			return JSON.parse(new TextDecoder().decode(result.data));
		} catch (err) {
			console.error("Query failed:", err);
		}
	};

	const handleExecute = async () => {
		try {
			// You should replace this with your actual mnemonic handling
			const mnemonic =
				"exclude try nephew main caught favorite tone degree lottery device tissue tent ugly mouse pelican gasp lava flush pen river noise remind balcony emerge";
			const ethWallet = ethers.Wallet.fromPhrase(mnemonic);
			const ethAddress = ethWallet.address;
			const wardenAddress = toBech32("warden", ethers.getBytes(ethAddress));
			const pubkey = ethers.getBytes(ethWallet.publicKey);

			const fee = {
				amount: [{ denom: "award", amount: "100" }],
				gas: "500000",
			};

			const msg = {
				do_stuff: {
					input: "hello world",
				},
			};

			const txBody = TxBody.fromPartial({
				messages: [
					{
						typeUrl: MsgExecuteContract.typeUrl,
						value: MsgExecuteContract.fromPartial({
							sender: wardenAddress,
							contract: CONTRACT_ADDRESS,
							msg: new TextEncoder().encode(JSON.stringify(msg)),
						}),
					},
				],
			});

			const signDoc = await buildSignDoc(
				CHAIN_ID,
				wardenAddress,
				pubkey,
				txBody,
				fee,
			);

			const signedTx = await signTransaction(ethWallet, signDoc);
			const result = await broadcastTx(signedTx);

			console.log("Transaction result:", result);
			return result;
		} catch (err) {
			console.error("Execution failed:", err);
		}
	};

	return (
		<>
			<button
				type="button"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={() => queryFutureResult(0)}
			>
				Query Contract
			</button>
			<button
				type="button"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
				onClick={handleExecute}
			>
				Execute Contract
			</button>
		</>
	);
}

async function buildSignDoc(
	chainId: string,
	wardenAddr: string,
	pubkey: Uint8Array,
	txBody: any,
	fee: any,
) {
	const account = await fetchAccount(wardenAddr);

	const pubk = Any.fromPartial({
		typeUrl: PubKey.typeUrl,
		value: PubKey.encode({
			key: pubkey,
		}).finish(),
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

async function fetchAccount(address: string) {
	const client = await warden.ClientFactory.createRPCQueryClient({
		rpcEndpoint: "http://localhost:26657",
	});
	const { account } = await client.cosmos.auth.v1beta1.account({ address });
	if (!account) {
		throw new Error("Failed to retrieve account from chain");
	}
	return account;
}

async function broadcastTx(bytes: Uint8Array) {
	const res = await fetch("http://localhost:1317/cosmos/tx/v1beta1/txs", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			tx_bytes: ethers.encodeBase64(bytes),
			mode: "BROADCAST_MODE_SYNC",
		}),
	});
	return res.json();
}