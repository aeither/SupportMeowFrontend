import { useAgoric } from "@agoric/react-components";
import { Upload, XCircle } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";

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
	const { walletConnection, chainName: agoricChainName } = useAgoric();
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

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			try {
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
					creator: walletConnection.address,
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
							Add New Cat
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
				</div>
			</div>
		</div>
	);
}
