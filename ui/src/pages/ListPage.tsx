// You can define this interface in your types.ts
interface Product {
	id: string;
	name: string;
	description: string;
	price: string;
	imageUrl: string;
}

export function ListPage() {
	// Mock data - replace with your actual data fetching logic
	const products: Product[] = [
		{
			id: "1",
			name: "Whiskers",
			description: "Sweet senior cat needing medical care",
			price: "50",
			imageUrl: "/whiskers.jpg",
		},
		{
			id: "2",
			name: "Luna",
			description:
				"Rescued from the streets, Luna needs surgery for her injured paw. She's a loving cat who purrs despite her pain and would be grateful for any help towards her recovery.",
			price: "100",
			imageUrl: "/luna.jpg",
		},
	];

	return (
		<div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Help Our Shelter Cats
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((product) => (
						<div
							key={product.id}
							className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
						>
							{/* Image container with fixed aspect ratio */}
							<div className="relative pt-[75%] w-full">
								<img
									src={product.imageUrl}
									alt={product.name}
									className="absolute top-0 left-0 w-full h-full object-cover"
								/>
							</div>

							{/* Content container */}
							<div className="p-6 flex flex-col flex-grow">
								<div className="flex-grow">
									<h2 className="text-xl font-semibold text-gray-900 mb-2">
										{product.name}
									</h2>
									<p className="text-gray-600 mb-4 line-clamp-3">
										{product.description}
									</p>
								</div>

								<div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
									<span className="text-lg font-medium text-gray-900">
										Goal: {product.price} ATOM
									</span>
									<button
										type="button"
										className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										onClick={() => {
											// Add your donation action here
											console.log(`Donate to ${product.id}`);
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