import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Footer() {
	const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useEffect(() => {
		document.body.style.cursor = hoveredLogo ? "none" : "default";
		return () => {
			document.body.style.cursor = "default";
		};
	}, [hoveredLogo]);

	const logos = [
		{ src: "/agoric.png", alt: "Agoric Logo" },
		{ src: "/asteroid.png", alt: "Asteroid Logo" },
		{ src: "/cosmos.png", alt: "Cosmos Logo" },
		{ src: "/interchain.png", alt: "Interchain Logo" },
		{ src: "/warden.png", alt: "Warden Logo" },
	];

	return (
		<footer className="bg-background text-foreground relative">
			<div className="container mx-auto px-4 py-12">
				<div className="flex justify-center items-center gap-12 mb-12 flex-wrap">
					{logos.map((logo) => (
						<div
							key={logo.src}
							onMouseEnter={() => setHoveredLogo(logo.src)}
							onMouseLeave={() => setHoveredLogo(null)}
							className="relative"
						>
							<img
								src={logo.src}
								alt={logo.alt}
								className="h-12 w-auto object-contain hover:scale-110 transition-transform shadow-md rounded"
							/>
						</div>
					))}
				</div>

				{hoveredLogo && (
					<div
						className="fixed pointer-events-none z-10"
						style={{
							left: `${mousePos.x}px`,
							top: `${mousePos.y}px`,
							transform: "translate(-50%, -50%)",
						}}
					>
						<div className="bg-white p-4 rounded-lg shadow-lg">
							<img
								src={hoveredLogo}
								alt="Hovered Logo"
								className="w-48 h-48 object-contain"
							/>
						</div>
					</div>
				)}

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

					<div className="flex flex-col items-center">
						<h2 className="text-xl font-bold mb-6">Repositories</h2>
						<div className="flex flex-col space-y-6">
							<a
								href="https://github.com/aeither/SupportMeowFrontend"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors"
							>
								<Button
									variant="ghost"
									size="lg"
									aria-label="Frontend GitHub"
									className="justify-center"
								>
									<FaGithub className="h-6 w-6" />
									<span className="ml-2">Frontend</span>
								</Button>
							</a>
							<a
								href="https://github.com/armsves/SupportMEowBackend"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors"
							>
								<Button
									variant="ghost"
									size="lg"
									aria-label="Backend GitHub"
									className="justify-center"
								>
									<FaGithub className="h-6 w-6" />
									<span className="ml-2">Backend</span>
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
