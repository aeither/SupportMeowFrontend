import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";

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
	const { data, isLoading, error } = useQuery({
		queryKey: ["inscriptions"],
		queryFn: async () => {
			const response = await request<QueryResponse>(
				"https://testnet-new-api.asteroidprotocol.io/v1/graphql",
				QUERY,
			);
			return response.inscription;
		},
	});

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center text-red-600">
				Error loading data
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Help Our Shelter Cats
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{data?.map((inscription, index) => (
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
										onClick={() => {
											console.log(`Donate to ${inscription.content_hash}`);
										}}
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
	);
}