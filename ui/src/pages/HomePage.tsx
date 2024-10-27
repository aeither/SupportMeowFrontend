import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { List, ShieldCheck, Upload } from "lucide-react";

export function HomePage() {
	const features = [
		{
			title: "Upload",
			icon: (
				<Upload className="h-12 w-12 text-blue-500 transition-transform group-hover:scale-110 group-hover:rotate-3" />
			),
			description: "Inscribe compliant content to asteroid with warden",
		},
		{
			title: "List",
			icon: (
				<List className="h-12 w-12 text-green-500 transition-transform group-hover:scale-110 group-hover:rotate-3" />
			),
			description: "Get all projects uploaded",
		},
		{
			title: "Verify",
			icon: (
				<ShieldCheck className="h-12 w-12 text-purple-500 transition-transform group-hover:scale-110 group-hover:rotate-3" />
			),
			description: "Warden verify integrity of images",
		},
	];

	return (
		<div className="bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-16">
					<Badge className="mb-4 text-sm px-3 py-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold">
						Make a Difference
					</Badge>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Donation Platform
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Empower animal shelters through your generosity. Every donation
						brings warmth, care, and hope to our furry friends in need.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{features.map((item, index) => (
						<Card
							key={index}
							className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
						>
							<CardContent className="p-6 flex flex-col items-center text-center">
								<div className="mb-4 transition-transform duration-300 ease-in-out">
									{item.icon}
								</div>
								<h2 className="text-2xl font-semibold text-gray-800 mb-2">
									{item.title}
								</h2>
								<p className="text-gray-600">{item.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}