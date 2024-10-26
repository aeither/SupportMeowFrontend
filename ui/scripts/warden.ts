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
const { MsgNewSpace } = warden.warden.v1beta3;
const PubKey = ethermint.crypto.v1.ethsecp256k1.PubKey;
const { MsgExecuteContract } = cosmwasm.wasm.v1;

const CONTRACT_ADDRESS =
	"warden14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9srt30us";

main().catch(console.error);

async function main() {
	try {
		// init an ethers wallet from mnemonic
		const mnemonic =
			"exclude try nephew main caught favorite tone degree lottery device tissue tent ugly mouse pelican gasp lava flush pen river noise remind balcony emerge";
		const ethWallet = ethers.Wallet.fromPhrase(mnemonic);
		const ethAddress = ethWallet.address;
		const wardenAddress = toBech32("warden", ethers.getBytes(ethAddress));
		const pubkey = ethers.getBytes(ethWallet.publicKey);
		console.log("\n🔑 Wallet Details:");
		console.log("ETH Address:", ethAddress);
		console.log("Warden Address:", wardenAddress);
		console.log("Public Key:", ethers.hexlify(pubkey));

		// prepare the content of the transaction
		const fee = {
			amount: [{ denom: "award", amount: "100" }],
			gas: "500000",
		};
		console.log("\n💰 Fee Details:", fee);

		const msg = {
			do_stuff: {
				input: "Hey Hackmos2024",
			},
		};
		console.log("\n📝 Message:", msg);

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
		console.log("\n📦 Transaction Body Created");

		// bundle the transaction and sign it
		console.log("\n🔄 Building SignDoc...");
		const signDoc = await buildSignDoc(
			"warden_1337-1",
			wardenAddress,
			pubkey,
			txBody,
			fee,
		);
		console.log("SignDoc built successfully");

		console.log("\n✍️  Signing transaction...");
		const signedTx = await signTransaction(ethWallet, signDoc);
		console.log("Transaction signed successfully");
		console.log("Signed TX Bytes:", ethers.hexlify(signedTx));

		// broadcast
		console.log("\n📡 Broadcasting transaction...");
		const broadcastRes = await broadcastTx(signedTx);
		console.log("\n🎉 Broadcast Response:");
		console.log(JSON.stringify(broadcastRes, null, 2));

		// Query the contract state
		console.log("\n🔍 Querying contract state...");
		const queryResult = await queryContractState(0);
		console.log("\n📊 Query Result:");
		console.log(JSON.stringify(queryResult, null, 2));
	} catch (error) {
		console.error("\n❌ Error:", error);
		throw error;
	}
}

async function buildSignDoc(chainId, wardenAddr, pubkey, txBody, fee) {
	console.log("\n📊 Fetching account details...");
	const account = await fetchAccount(wardenAddr);
	console.log("Account:", account);

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
		fee.granter,
		fee.payer,
	);
	const signDoc = makeSignDoc(
		txBodyBytes,
		authInfoBytes,
		chainId,
		Number(account.accountNumber),
	);
	return signDoc;
}

async function signTransaction(wallet, signDoc) {
	const signDocBytes = SignDoc.encode(signDoc).finish();
	const signatureRaw = wallet.signingKey.sign(ethers.keccak256(signDocBytes));
	const signature = ethers.Signature.from(signatureRaw);
	const signatureRS = ethers.concat([signature.r, signature.s]);
	const signatureRSBytes = ethers.getBytes(signatureRS);

	console.log("\n📝 Signature Details:");
	console.log("R:", signature.r);
	console.log("S:", signature.s);

	const signedTx = TxRaw.encode(
		TxRaw.fromPartial({
			authInfoBytes: signDoc.authInfoBytes,
			bodyBytes: signDoc.bodyBytes,
			signatures: [signatureRSBytes],
		}),
	).finish();

	return signedTx;
}

async function fetchAccount(address) {
	console.log("\n🔍 Fetching account for address:", address);
	const client = await warden.ClientFactory.createRPCQueryClient({
		rpcEndpoint: "http://localhost:26657",
	});
	const { account } = await client.cosmos.auth.v1beta1.account({ address });
	if (!account) {
		throw new Error("Failed to retrieve account from chain");
	}
	return account;
}

async function broadcastTx(bytes) {
	const endpoint = "http://localhost:1317/cosmos/tx/v1beta1/txs";
	console.log("\n🌐 Broadcasting to endpoint:", endpoint);

	const txBytes = ethers.encodeBase64(bytes);
	console.log("Base64 encoded TX:", txBytes);

	const res = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			tx_bytes: txBytes,
			mode: "BROADCAST_MODE_SYNC",
		}),
	});
	const resJson = await res.json();
	return resJson;
}

async function queryContractState() {
	try {
		const queryMsg = {
			get_future_result: {
				id: 0,
			},
		};

		// Properly encode the query message
		const encodedQuery = Buffer.from(JSON.stringify(queryMsg)).toString(
			"base64",
		);

		const endpoint = `http://localhost:1317/cosmwasm/wasm/v1/contract/${CONTRACT_ADDRESS}/smart/${encodedQuery}`;
		console.log("\n🔍 Query endpoint:", endpoint);

		const response = await fetch(endpoint, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("\n❌ Query Error Response:", errorText);
			throw new Error(
				`Query failed with status: ${response.status}. ${errorText}`,
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("\n❌ Failed to query contract state:", error);
		if (error.response) {
			console.error("Response data:", error.response.data);
		}
		throw error;
	}
}

// Alternative query implementation using RPC client
async function queryContractStateAlternative() {
	try {
		const client = await warden.ClientFactory.createRPCQueryClient({
			rpcEndpoint: "http://localhost:26657",
		});

		const queryMsg = {
			get_future_result: {
				id: 0,
			},
		};

		const response = await client.cosmwasm.wasm.v1.smartContractState({
			address: CONTRACT_ADDRESS,
			queryData: Buffer.from(JSON.stringify(queryMsg)),
		});

		return response;
	} catch (error) {
		console.error(
			"\n❌ Failed to query contract state using RPC client:",
			error,
		);
		throw error;
	}
}

// You can try both query methods
async function tryBothQueryMethods() {
	try {
		console.log("\n🔍 Trying REST query...");
		const restResult = await queryContractState();
		console.log("REST Query Result:", restResult);
	} catch (error) {
		console.error("REST query failed:", error);
	}

	try {
		console.log("\n🔍 Trying RPC query...");
		const rpcResult = await queryContractStateAlternative();
		console.log("RPC Query Result:", rpcResult);
	} catch (error) {
		console.error("RPC query failed:", error);
	}
}
