import { useAgoric } from "@agoric/react-components";
import { Upload, XCircle } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { getIbcChannel, rpcEndpoints } from '../util';

interface FormData {
	name: string;
	description: string;
	price: string;
	image: File | null;
}

interface FormErrors {
	name?: string;
	description?: string;
	price?: string;
	image?: string;
}

type InscriptionResponse = {
	transactionHash: string;
	inscriptionData: {
		data: {
			inscription: Array<{
				metadata: {
					parent: {
						type: string;
						identifier: string;
					};
					metadata: {
						mime: string;
						name: string;
						price: string;
						description: string;
					};
				};
				content_path: string;
				content_hash: string;
			}>;
		};
	};
};

export default function UploadPage() {
	const { address, } = useAgoric();
	const [formData, setFormData] = useState<FormData>({
		name: "",
		description: "",
		price: "",
		image: null,
	});
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [errors, setErrors] = useState<FormErrors>({});

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	// In validateForm function
	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};
		if (!formData.name.trim()) newErrors.name = "Name is required";
		if (!formData.description.trim())
			newErrors.description = "Description is required";
		if (!formData.price.trim()) newErrors.price = "Price is required";
		if (!formData.image) newErrors.image = "Image is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// In handleImageChange function
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev) => ({ ...prev, image: file }));
			setImagePreview(URL.createObjectURL(file));
			setErrors((prev) => ({ ...prev, image: undefined }));
		}
	};

	const { walletConnection, chainName: agoricChainName } = useAgoric();

	const testIBC = async () => {
		//e.preventDefault();
		console.log('testIBCaa');


		const form = new FormData();
		form.append("name", "fasdfas");
		//form.append("group_id", uuidv4());
		form.append("keyvalues", "{}");

		// Create a mock file using Blob
		const mockFile = new Blob(["This is a mock file content"], { type: "text/plain" });
		form.append("file", mockFile, "mockfile.txt");

		const options = {
			method: 'POST',
			headers: {
				Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1OTVmNGMwYi05MzhjLTQ2ZDQtOGMyNS1lNGY5MzYwNzE1OTAiLCJlbWFpbCI6ImFybXN2ZXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjE2M2M4MzJhZmYzYTliN2Q3YmFlIiwic2NvcGVkS2V5U2VjcmV0IjoiYjE4ODhmMDViN2M5YTZlZTEzMmUxZTcwMWUwZWJjZjk5ZTk3YjIwYjMyMDZkNDBhOGZiZGM4ZmQ4NTdlNmVmNyIsImV4cCI6MTc2MTUzNjQ1Mn0.ipJyOItQt4ok9RMxSbhwoKLN_GPU8QX2UVTIoUftJ8w'
			},
			body: form
		};

		let cid

		await fetch('https://uploads.pinata.cloud/v3/files', options)
			.then(response => response.json())
			.then(response => {
				cid = response
				console.log('IPFS response',response)
			})
			.catch(err => console.error(err));

		console.log('cid:', cid.data.cid);

		
		let chain = '';
		if (address.startsWith('osmo1')) {
			chain = 'osmosis';
		} else if (address.startsWith('agoric1')) {
			chain = 'agoric';
		} else {
			throw new Error('unsupported address prefix');
		}
		const { signingClient, address: walletAddress } = walletConnection;
		console.log('walletAddress:', walletAddress);
		console.log('chain:', chain);
		console.log('agoricChainName:', agoricChainName)
		const sourceChannel = await getIbcChannel(agoricChainName, chain);
		
		console.log('sourceChannel:', sourceChannel);

		const sendMsg = {
			typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
			value: {
				sourcePort: 'transfer',
				sourceChannel,
				token: { denom: 'uatom', amount: '1' },
				sender: walletAddress,
				receiver: address,
				timeoutTimestamp: (Math.floor(Date.now() / 1000) + 600) * 1e9, // 10
				memo: "Upload to Asteroid IPFS CID: " + cid.data.cid,
			},
			memo: "gada",
		};
		
		console.log('sendMsg:', sendMsg);

		const fee = {
			amount: [{ denom: 'ubld', amount: '5000' }],
			gas: '200000',
		};

		const result = await signingClient.signAndBroadcast(
			walletAddress,
			[sendMsg],
			fee,
			'', //transaction memo
		);
		console.log(result);
		if (result.code !== undefined && result.code !== 0) {
			throw new Error(`failed to send message: ${result}`);
		}
		console.log('message sent successfully');
		
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			try {
				// Check if walletConnection.address is defined
				if (!address) {
					alert("Wallet connection is not defined");
					return;
				}
				console.log("walletConnection.address: ", address);

				// Convert image to base64 if exists
				let imageBase64 = "";
				if (formData.image) {
					const reader = new FileReader();
					imageBase64 = await new Promise((resolve) => {
						reader.onloadend = () => resolve(reader.result as string);
						reader.readAsDataURL(formData.image);
					});
				}

				// Prepare request body
				const requestBody = {
					name: formData.name,
					description: formData.description,
					price: formData.price,
					image: imageBase64,
					// creator: walletConnection.address,
					creator: address,
				};

				console.log("requestBody", requestBody);

				// Make API call
				const response = await fetch(
					"https://1115-5-195-99-219.ngrok-free.app/execute",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(requestBody),
					},
				);

				if (!response.ok) {
					throw new Error("Upload failed");
				}

				const data: InscriptionResponse = await response.json();
				console.log("Upload successful:", data);

				// Reset form after successful submission
				setFormData({ name: "", description: "", price: "", image: null });
				setImagePreview(null);
				alert("Cat added successfully!");
			} catch (error) {
				console.error("Upload error:", error);
				alert("Failed to upload cat. Please try again.");
			}
		}
	};
	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-xl mx-auto">
				<div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-8 py-10">
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900">
							Add New Cat thru IBC
						</h2>
						<p className="mt-1 text-sm text-gray-600">
							Please provide the cat's details and photo
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name Input */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700"
							>
								Cat's Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter cat's name"
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-600">{errors.name}</p>
							)}
						</div>

						{/* Description Input */}
						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium text-gray-700"
							>
								Story
							</label>
							<textarea
								id="description"
								name="description"
								rows={4}
								required
								className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								value={formData.description}
								onChange={handleInputChange}
								placeholder="Share the cat's story"
							/>
							{errors.description && (
								<p className="mt-1 text-sm text-red-600">
									{errors.description}
								</p>
							)}
						</div>

						{/* Price Input */}
						<div>
							<label
								htmlFor="price"
								className="block text-sm font-medium text-gray-700"
							>
								Donation Goal (ATOM)
							</label>
							<div className="mt-2 relative rounded-md shadow-sm">
								<input
									id="price"
									name="price"
									type="text"
									required
									className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									value={formData.price}
									onChange={handleInputChange}
									placeholder="0.00"
								/>
							</div>
							{errors.price && (
								<p className="mt-1 text-sm text-red-600">{errors.price}</p>
							)}
						</div>

						{/* Image Upload */}
						<div>
							{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
							<label className="block text-sm font-medium text-gray-700">
								Cat's Photo
							</label>
							<div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
								<div className="text-center">
									{imagePreview ? (
										<div className="relative inline-block">
											<img
												src={imagePreview}
												alt="Preview"
												className="h-40 w-40 object-cover rounded-lg"
											/>
											<button
												type="button"
												onClick={() => {
													setImagePreview(null);
													setFormData((prev) => ({ ...prev, image: null }));
												}}
												className="absolute -top-2 -right-2 p-1 bg-white rounded-full text-gray-500 hover:text-red-500 shadow-sm"
											>
												<XCircle className="h-5 w-5" />
											</button>
										</div>
									) : (
										<>
											<Upload className="mx-auto h-12 w-12 text-gray-300" />
											<div className="mt-4 flex text-sm leading-6 text-gray-600">
												<label
													htmlFor="image"
													className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
												>
													<span>Upload a photo</span>
													<input
														id="image"
														name="image"
														type="file"
														className="sr-only"
														onChange={handleImageChange}
														accept="image/png" // Changed from image/* to image/png
													/>
												</label>
												<p className="pl-1">or drag and drop</p>
											</div>
											<p className="text-xs leading-5 text-gray-600">
												PNG, JPG, GIF up to 10MB
											</p>
										</>
									)}
								</div>
							</div>
							{/* {errors.image && (
								<p className="mt-1 text-sm text-red-600">{errors.image}</p>
							)} */}
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
						>
							Add Cat
						</button>
					</form>

					<br></br>
					<button
						//type="submit"
						onClick={testIBC}
						className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
					>
						TestIBC
					</button>
				</div>
			</div>
		</div>
	);
}
