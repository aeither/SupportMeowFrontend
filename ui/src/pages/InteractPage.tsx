// pages/InteractPage.tsx
import { useWardenContract } from "../hooks/useWardenContract";

const CONTRACT_ADDRESS =
	"warden14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9srt30us";
const CHAIN_ID = "warden_1337-1";
const MNEMONIC =
	"exclude try nephew main caught favorite tone degree lottery device tissue tent ugly mouse pelican gasp lava flush pen river noise remind balcony emerge";

export function InteractPage() {
	const { queryContract, executeContract, isLoading, error } =
		useWardenContract({
			contractAddress: CONTRACT_ADDRESS,
			chainId: CHAIN_ID,
			mnemonic: MNEMONIC,
		});

	const handleQuery = async () => {
		try {
			const result = await queryContract({
				get_future_result: {
					id: 0,
				},
			});
			console.log("Query Result:", result);
		} catch (err) {
			console.error("Query failed:", err);
		}
	};

	const handleExecute = async () => {
		try {
			const result = await executeContract({
				do_stuff: {
					input: "hello world",
				},
			});
			console.log("Transaction result:", result);
		} catch (err) {
			console.error("Execution failed:", err);
		}
	};

	return (
		<>
			{error && <div className="text-red-500">{error.message}</div>}
			<button
				type="button"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={handleQuery}
				disabled={isLoading}
			>
				Query Contract
			</button>
			<button
				type="button"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
				onClick={handleExecute}
				disabled={isLoading}
			>
				Execute Contract
			</button>
		</>
	);
}
