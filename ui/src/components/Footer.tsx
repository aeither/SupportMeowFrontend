import { FaFacebook, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Footer() {
	return (
		<footer className="bg-background text-foreground">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h2 className="text-lg font-semibold mb-4">About Us</h2>
						<p className="text-sm">
							Built by Gio and Armando with 🧃
						</p>
					</div>
					<div>
						<h2 className="text-lg font-semibold mb-4">Quick Links</h2>
						<ul className="space-y-2">
							<li>
								<a href="#" className="text-sm hover:underline">
									Home
								</a>
							</li>
							<li>
								<a href="#" className="text-sm hover:underline">
									Products
								</a>
							</li>
							<li>
								<a href="#" className="text-sm hover:underline">
									About
								</a>
							</li>
							<li>
								<a href="#" className="text-sm hover:underline">
									Contact
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h2 className="text-lg font-semibold mb-4">Contact Us</h2>
						<p className="text-sm">We are Decentralized around the world.</p>
					</div>
					<div>
						<h2 className="text-lg font-semibold mb-4">Follow Us</h2>
						<div className="flex space-x-4">
							<Button variant="ghost" size="icon" aria-label="Facebook">
								<FaFacebook className="h-5 w-5" />
							</Button>
							<Button variant="ghost" size="icon" aria-label="Twitter">
								<FaTwitter className="h-5 w-5" />
							</Button>
							<Button variant="ghost" size="icon" aria-label="Instagram">
								<FaInstagram className="h-5 w-5" />
							</Button>
							<Button variant="ghost" size="icon" aria-label="GitHub">
								<FaGithub className="h-5 w-5" />
							</Button>
						</div>
					</div>
				</div>
				<Separator className="my-8" />
				<div className="text-center text-sm">
					<p>
						&copy; {new Date().getFullYear()} All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}