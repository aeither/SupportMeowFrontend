import { SigningStargateClient } from "@cosmjs/stargate";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { Fragment, useState } from "react";

interface InscriptionMetadata {
	metadata: {
		parent: {
			type: string;
			identifier: string;
		};
		metadata: {
			mime: string;
			name: string;
			description: string;
			price: string;
			creator: string;
		};
	};
	content_path: string;
	content_hash: string;
}

interface QueryResponse {
	inscription: InscriptionMetadata[];
}

const QUERY = `
  query {
    inscription(where: { creator: { _eq: "cosmos1m9l358xunhhwds0568za49mzhvuxx9uxre5tud" } }) {
      metadata
      content_path
      content_hash
    }
  }
`;

export function ListPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedInscription, setSelectedInscription] =
		useState<InscriptionMetadata | null>(null);
	const [donationAmount, setDonationAmount] = useState("");
	const [transactionHash, setTransactionHash] = useState("");
	const [error, setError] = useState("");

	const {
		data,
		isLoading: isDataLoading,
		error: queryError,
	} = useQuery({
		queryKey: ["inscriptions"],
		queryFn: async () => {
			const response = await request<QueryResponse>(
				"https://testnet-new-api.asteroidprotocol.io/v1/graphql",
				QUERY,
			);
			return response.inscription;
		},
	});

	const handleOpenModal = (inscription: InscriptionMetadata) => {
		setSelectedInscription(inscription);
		setIsModalOpen(true);
		setError("");
		setTransactionHash("");
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedInscription(null);
		setDonationAmount("");
		setError("");
		setTransactionHash("");
	};

	const handleDonate = async () => {
		if (!selectedInscription || !donationAmount) return;

		setIsLoading(true);
		setError("");
		setTransactionHash("");

		try {
			if (!window.keplr) {
				throw new Error("Please install Keplr extension");
			}

			// Use theta testnet chain ID
			const chainId = "theta-testnet-001";

			// Suggest the testnet chain to Keplr
			await window.keplr.experimentalSuggestChain({
				chainId: chainId,
				chainName: "Cosmos Hub Testnet",
				rpc: "https://rpc.sentry-01.theta-testnet.polypore.xyz",
				rest: "https://rest.sentry-01.theta-testnet.polypore.xyz",
				bip44: {
					coinType: 118,
				},
				bech32Config: {
					bech32PrefixAccAddr: "cosmos",
					bech32PrefixAccPub: "cosmospub",
					bech32PrefixValAddr: "cosmosvaloper",
					bech32PrefixValPub: "cosmosvaloperpub",
					bech32PrefixConsAddr: "cosmosvalcons",
					bech32PrefixConsPub: "cosmosvalconspub",
				},
				currencies: [
					{
						coinDenom: "ATOM",
						coinMinimalDenom: "uatom",
						coinDecimals: 6,
					},
				],
				feeCurrencies: [
					{
						coinDenom: "ATOM",
						coinMinimalDenom: "uatom",
						coinDecimals: 6,
					},
				],
				stakeCurrency: {
					coinDenom: "ATOM",
					coinMinimalDenom: "uatom",
					coinDecimals: 6,
				},
				gasPriceStep: {
					low: 0.01,
					average: 0.025,
					high: 0.04,
				},
			});

			// Enable the chain
			await window.keplr.enable(chainId);
			const offlineSigner = window.keplr.getOfflineSigner(chainId);
			const accounts = await offlineSigner.getAccounts();

			const client = await SigningStargateClient.connectWithSigner(
				"https://rpc.sentry-01.theta-testnet.polypore.xyz",
				offlineSigner,
			);

			// Convert ATOM to uatom (1 ATOM = 1,000,000 uatom)
			const uatomAmount = Math.floor(
				Number.parseFloat(donationAmount) * 1_000_000,
			).toString();

			const balance = await client.getBalance(accounts[0].address, "uatom");
			const totalNeeded = BigInt(uatomAmount) + BigInt(5000);
			console.log("🚀 ~ handleDonate ~ balance:", balance);
			console.log("🚀 totalNeeded", totalNeeded);
			if (BigInt(balance.amount) < totalNeeded) {
				// donation + fees
				throw new Error("Insufficient balance for donation and fees");
			}

			const result = await client.sendTokens(
				accounts[0].address,
				selectedInscription.metadata.metadata.creator ||
					"cosmos1m9l358xunhhwds0568za49mzhvuxx9uxre5tud",
				[{ denom: "uatom", amount: uatomAmount }],
				{
					amount: [{ denom: "uatom", amount: "5000" }],
					gas: "200000",
				},
				`Donation for ${selectedInscription.metadata.metadata.name}`,
			);

			setTransactionHash(result.transactionHash);
		} catch (err) {
			console.error("Donation failed:", err);
			setError(
				err instanceof Error ? err.message : "Failed to process donation",
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (isDataLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
			</div>
		);
	}

	if (queryError) {
		return (
			<div className="min-h-screen flex items-center justify-center text-red-600">
				Error loading data
			</div>
		);
	}

	console.log("data", data);

	return (
		<>
			<div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-3xl font-bold text-gray-900 mb-8">
						Help Our Shelter Cats
					</h1>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{data?.map((inscription) => (
							<div
								key={inscription.content_hash}
								className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
							>
								<div className="relative pt-[75%] w-full">
									<img
										src={inscription.content_path}
										alt={inscription.metadata.metadata.name}
										className="absolute top-0 left-0 w-full h-full object-cover"
									/>
								</div>

								<div className="p-6 flex flex-col flex-grow">
									<div className="flex-grow">
										<h2 className="text-xl font-semibold text-gray-900 mb-2">
											{inscription.metadata.metadata.name}
										</h2>
										{inscription.metadata.metadata.creator && (
											<p className="text-sm text-gray-500 mb-2">
												Creator:{" "}
												{inscription.metadata.metadata.creator.slice(0, 6)}...
												{inscription.metadata.metadata.creator.slice(-4)}
											</p>
										)}
										<p className="text-gray-600 mb-4 line-clamp-3">
											{inscription.metadata.metadata.description}
										</p>
									</div>

									<div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
										<span className="text-lg font-medium text-gray-900">
											Goal: {inscription.metadata.metadata.price} ATOM
										</span>
										<button
											type="button"
											className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											onClick={() => handleOpenModal(inscription)}
										>
											Donate Now
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<Transition appear show={isModalOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900 mb-4"
									>
										Donate to {selectedInscription?.metadata.metadata.name}
									</Dialog.Title>

									<div className="mt-2">
										<div className="mb-4">
											<label
												htmlFor="amount"
												className="block text-sm font-medium text-gray-700"
											>
												Amount (ATOM)
											</label>
											<input
												type="number"
												id="amount"
												className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
												value={donationAmount}
												onChange={(e) => setDonationAmount(e.target.value)}
												placeholder="Enter amount"
												min="0"
												step="0.000001"
												required
											/>
										</div>

										{error && (
											<div className="mb-4 text-sm text-red-600">{error}</div>
										)}

										{transactionHash && (
											<div className="mb-4 text-sm text-green-600">
												Transaction successful! Hash: {transactionHash}
											</div>
										)}
									</div>

									<div className="mt-4 flex justify-end space-x-3">
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
											onClick={handleCloseModal}
										>
											Cancel
										</button>
										<button
											type="button"
											className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
												isLoading
													? "bg-indigo-400 cursor-not-allowed"
													: "bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500"
											}`}
											onClick={handleDonate}
											disabled={isLoading || !donationAmount}
										>
											{isLoading ? (
												<span className="flex items-center">
													<div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full" />
													Processing...
												</span>
											) : (
												"Confirm Donation"
											)}
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

declare global {
	interface Window {
		keplr: any;
	}
}
