import { useAgoric } from "@agoric/react-components";
import { Loader2, Upload, XCircle } from "lucide-react"; // Added Loader2
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useWardenContract } from "../hooks/useWardenContract";
import type { FormErrors, InscriptionResponse, UploadFormData } from "../types";

const CONTRACT_ADDRESS =
	"warden14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9srt30us";
const CHAIN_ID = "warden_1337-1";
const MNEMONIC =
	"exclude try nephew main caught favorite tone degree lottery device tissue tent ugly mouse pelican gasp lava flush pen river noise remind balcony emerge";

export default function UploadPage() {
	const { address } = useAgoric();
	const [formData, setFormData] = useState<UploadFormData>({
		name: "",
		description: "",
		price: "",
		image: null,
	});
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state
	const { queryContract, executeContract, isLoading, error } =
		useWardenContract({
			contractAddress: CONTRACT_ADDRESS,
			chainId: CHAIN_ID,
			mnemonic: MNEMONIC,
		});

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

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file size (10MB limit)
			if (file.size > 10 * 1024 * 1024) {
				setErrors((prev) => ({
					...prev,
					image: "File size must be less than 10MB",
				}));
				return;
			}
			setFormData((prev) => ({ ...prev, image: file }));
			setImagePreview(URL.createObjectURL(file));
			setErrors((prev) => ({ ...prev, image: undefined }));
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			setIsSubmitting(true); // Start loading
			try {
				if (!address) {
					throw new Error("Wallet connection is not defined");
				}

				// Convert image to base64 if exists
				let imageBase64 = "";
				if (formData.image) {
					const reader = new FileReader();
					imageBase64 = await new Promise((resolve) => {
						reader.onloadend = () => resolve(reader.result as string);
						reader.readAsDataURL(formData.image);
					});
				}

				const requestBody = {
					name: formData.name,
					description: formData.description,
					price: formData.price,
					image: imageBase64,
					creator: address,
				};

				const response = await fetch(
					"https://1032-5-195-99-219.ngrok-free.app/execute",
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

				/**
				 * Warden contract execute and query
				 */
				await executeContract({
					do_stuff: {
						input: data.transactionHash,
					},
				});

				const result = await queryContract({
					get_future_result: {
						id: 0,
					},
				});
				console.log("🚀 ~ warden ~ get_future_result:", result);

				/**
				 * Reset form after successful submission
				 */
				setFormData({ name: "", description: "", price: "", image: null });
				setImagePreview(null);
				alert("Cat added successfully!");
			} catch (error) {
				console.error("Upload error:", error);
				alert(
					error instanceof Error
						? error.message
						: "Failed to upload cat. Please try again.",
				);
			} finally {
				setIsSubmitting(false); // Stop loading
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
							disabled={isSubmitting}
							className={`w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 flex items-center justify-center
								${
									isSubmitting
										? "bg-indigo-400 cursor-not-allowed"
										: "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								}`}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="animate-spin mr-2 h-4 w-4" />
									Adding Cat...
								</>
							) : (
								"Add Cat"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
