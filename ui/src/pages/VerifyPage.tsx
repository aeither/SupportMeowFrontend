"use client";

import { useAgoric } from "@agoric/react-components";
import { Upload, XCircle } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";

interface FormData {
	image: File | null;
	transactionHash: string;
}

interface FormErrors {
	image?: string;
	transactionHash?: string;
}

export function VerifyPage() {
	const { address } = useAgoric();
	const [formData, setFormData] = useState<FormData>({
		image: null,
		transactionHash: "",
	});
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitResult, setSubmitResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};
		if (!formData.image) newErrors.image = "Image is required";
		if (!formData.transactionHash.trim())
			newErrors.transactionHash = "Transaction hash is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

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
			setIsSubmitting(true);
			setSubmitResult(null);
			try {
				if (!address) {
					throw new Error("Wallet connection is not defined");
				}

				let imageBase64 = "";
				if (formData.image) {
					const reader = new FileReader();
					imageBase64 = await new Promise((resolve) => {
						reader.onloadend = () => resolve(reader.result as string);
						reader.readAsDataURL(formData.image);
					});
				}

				const requestBody = {
					image: imageBase64,
					transactionHash: formData.transactionHash,
					verifier: address,
				};

				const response = await fetch(
					"https://1115-5-195-99-219.ngrok-free.app/verify",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(requestBody),
					},
				);

				if (!response.ok) {
					throw new Error("Verification failed");
				}

				const data = await response.json();
				console.log("Verification successful:", data);
				setSubmitResult({ success: true, message: "Verification successful!" });

				setFormData({ image: null, transactionHash: "" });
				setImagePreview(null);
			} catch (error) {
				console.error("Verification error:", error);
				setSubmitResult({
					success: false,
					message: "Verification failed. Please try again.",
				});
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-xl mx-auto">
				<div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-8 py-10">
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900">
							Verify Transaction
						</h2>
						<p className="mt-1 text-sm text-gray-600">
							Please provide the transaction image and hash for verification
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="image"
								className="block text-sm font-medium text-gray-700"
							>
								Transaction Image
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
													<span>Upload an image</span>
													<input
														id="image"
														name="image"
														type="file"
														className="sr-only"
														onChange={handleImageChange}
														accept="image/*"
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
							{errors.image && (
								<p className="mt-1 text-sm text-red-600">{errors.image}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="transactionHash"
								className="block text-sm font-medium text-gray-700"
							>
								Transaction Hash
							</label>
							<input
								id="transactionHash"
								name="transactionHash"
								type="text"
								required
								value={formData.transactionHash}
								onChange={handleInputChange}
								placeholder="Enter transaction hash"
								className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							/>
							{errors.transactionHash && (
								<p className="mt-1 text-sm text-red-600">
									{errors.transactionHash}
								</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Verifying..." : "Verify Transaction"}
						</button>
					</form>

					{submitResult && (
						<div
							className={`mt-4 p-4 rounded-md ${submitResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
						>
							<h3 className="text-sm font-medium">
								{submitResult.success ? "Success" : "Error"}
							</h3>
							<p className="mt-2 text-sm">{submitResult.message}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}