import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Footer() {
	return (
		<footer className="bg-background text-foreground">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h2 className="text-lg font-semibold mb-4">About Us</h2>
						<p className="text-sm">Built by Gio and Armando with 🧃</p>
					</div>
					<div>
						<h2 className="text-lg font-semibold mb-4">Quick Links</h2>
						<ul className="space-y-2">
							<li>
								<a href="/list" className="text-sm hover:underline">
									List
								</a>
							</li>
							<li>
								<a href="/upload" className="text-sm hover:underline">
									Upload
								</a>
							</li>
							<li>
								<a href="/verify" className="text-sm hover:underline">
									Verify
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h2 className="text-lg font-semibold mb-4">Contact Us</h2>
						<p className="text-sm">We are Decentralized around the world.</p>
					</div>
					<div>
						<h2 className="text-lg font-semibold mb-4">Repository</h2>
						<div className="flex space-x-4">
							<a
								href="https://github.com/aeither/SupportMeowFrontend"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button
									variant="ghost"
									size="icon"
									aria-label="Frontend GitHub"
								>
									<FaGithub className="h-5 w-5" />
								</Button>
							</a>
							<a
								href="https://github.com/armsves/SupportMEowBackend"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button variant="ghost" size="icon" aria-label="Backend GitHub">
									<FaGithub className="h-5 w-5" />
								</Button>
							</a>
						</div>
					</div>
				</div>
				<Separator className="my-8" />
				{/* Partners/Logos Section */}
				<div className="flex justify-center items-center gap-8 mb-8 flex-wrap">
					<img
						src="/agoric.png"
						alt="Agoric Logo"
						className="h-8 w-auto object-contain"
					/>
					<img
						src="/asteroid.png"
						alt="Asteroid Logo"
						className="h-8 w-auto object-contain"
					/>
					<img
						src="/cosmos.png"
						alt="Cosmos Logo"
						className="h-8 w-auto object-contain"
					/>
					<img
						src="/interchain.png"
						alt="Interchain Logo"
						className="h-8 w-auto object-contain"
					/>
					<img
						src="/warden.png"
						alt="Warden Logo"
						className="h-8 w-auto object-contain"
					/>
				</div>
				<div className="text-center text-sm">
					<p>&copy; {new Date().getFullYear()} All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
