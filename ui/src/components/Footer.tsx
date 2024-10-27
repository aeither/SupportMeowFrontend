import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Footer() {
	return (
		<footer className="bg-background text-foreground">
			<div className="container mx-auto px-4 py-12">
				<div className="flex justify-center items-center gap-12 mb-12 flex-wrap">
					<img
						src="/agoric.png"
						alt="Agoric Logo"
						className="h-12 w-auto object-contain hover:scale-110 transition-transform shadow-md rounded"
					/>
					<img
						src="/asteroid.png"
						alt="Asteroid Logo"
						className="h-12 w-auto object-contain hover:scale-110 transition-transform shadow-md rounded"
					/>
					<img
						src="/cosmos.png"
						alt="Cosmos Logo"
						className="h-12 w-auto object-contain hover:scale-110 transition-transform shadow-md rounded"
					/>
					<img
						src="/interchain.png"
						alt="Interchain Logo"
						className="h-12 w-auto object-contain hover:scale-110 transition-transform shadow-md rounded"
					/>
					<img
						src="/warden.png"
						alt="Warden Logo"
						className="h-12 w-auto object-contain hover:scale-110 transition-transform shadow-md rounded"
					/>
				</div>

				<Separator className="mb-12" />

				<div className="grid grid-cols-1 md:grid-cols-4 gap-12">
					<div>
						<h2 className="text-xl font-bold mb-6">About Us</h2>
						<p className="text-base opacity-90">
							Built by Gio and Armando with 🧃
						</p>
					</div>

					<div>
						<h2 className="text-xl font-bold mb-6">Quick Links</h2>
						<ul className="space-y-3">
							<li>
								<a
									href="/list"
									className="text-base hover:text-primary transition-colors"
								>
									List
								</a>
							</li>
							<li>
								<a
									href="/upload"
									className="text-base hover:text-primary transition-colors"
								>
									Upload
								</a>
							</li>
							<li>
								<a
									href="/verify"
									className="text-base hover:text-primary transition-colors"
								>
									Verify
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h2 className="text-xl font-bold mb-6">Contact Us</h2>
						<p className="text-base opacity-90">
							We are Decentralized around the world.
						</p>
					</div>

					<div>
						<h2 className="text-xl font-bold mb-6">Repository</h2>
						<div className="flex space-x-6">
							<a
								href="https://github.com/aeither/SupportMeowFrontend"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors"
							>
								<Button variant="ghost" size="lg" aria-label="Frontend GitHub">
									<FaGithub className="h-6 w-6" />
								</Button>
							</a>
							<a
								href="https://github.com/armsves/SupportMEowBackend"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors"
							>
								<Button variant="ghost" size="lg" aria-label="Backend GitHub">
									<FaGithub className="h-6 w-6" />
								</Button>
							</a>
						</div>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="text-center text-sm opacity-75">
					<p>&copy; {new Date().getFullYear()} All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}