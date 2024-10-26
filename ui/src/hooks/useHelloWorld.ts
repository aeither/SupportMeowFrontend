import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
// hooks/useHelloWorld.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const RPC_ENDPOINT = "https://rpc.buenavista.wardenprotocol.org:443";
const CHAIN_ID = "buenavista-1";
const CONTRACT_ADDRESS = "your_contract_address";

export function useHelloWorld() {
	const { address } = useAccount();
	const { data: walletClient } = useWalletClient();
	const publicClient = usePublicClient();

	const getGreeting = useQuery({
		queryKey: ["greeting"],
		queryFn: async () => {
			const cosmClient = await SigningCosmWasmClient.connect(RPC_ENDPOINT);
			const response = await cosmClient.queryContractSmart(CONTRACT_ADDRESS, {
				get_greeting: {},
			});
			return response as string;
		},
	});

	const sayHello = useMutation({
		mutationFn: async () => {
			if (!address || !walletClient) throw new Error("Wallet not connected");

			const cosmClient = await SigningCosmWasmClient.connectWithSigner(
				RPC_ENDPOINT,
				walletClient as any,
				{
					chainId: CHAIN_ID,
					gasPrice: {
						amount: "0.025",
						denom: "uward",
					},
				},
			);

			const msg = {
				say_hello: {},
			};

			const response = await cosmClient.execute(
				address,
				CONTRACT_ADDRESS,
				msg,
				"auto",
				undefined,
				{
					amount: [],
					gas: "200000",
				},
			);

			return response;
		},
	});

	return {
		greeting: getGreeting.data,
		isLoadingGreeting: getGreeting.isLoading,
		sayHello: sayHello.mutate,
		isSayingHello: sayHello.isPending,
		error: getGreeting.error || sayHello.error,
	};
}