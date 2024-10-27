import OrbitingCircles from "./ui/orbiting-circles";

export function Orbit() {
	const logos = [
		{ src: "/agoric.png", alt: "Agoric Logo" },
		{ src: "/asteroid.png", alt: "Asteroid Logo" },
		{ src: "/cosmos.png", alt: "Cosmos Logo" },
		{ src: "/interchain.png", alt: "Interchain Logo" },
		{ src: "/warden.png", alt: "Warden Logo" },
	];

	return (
		<div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
			<span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-sm font-semibold leading-none text-transparent dark:from-white dark:to-black">
				SupportMEow
			</span>

			{/* Inner Circles */}
			<OrbitingCircles
				className="size-[30px] border-none bg-transparent"
				duration={20}
				delay={20}
				radius={80}
			>
				<div className="size-[30px] rounded-full overflow-hidden">
					<img
						src={logos[0].src}
						alt={logos[0].alt}
						className="h-full w-full object-cover"
					/>
				</div>
			</OrbitingCircles>
			<OrbitingCircles
				className="size-[30px] border-none bg-transparent"
				duration={20}
				delay={10}
				radius={80}
			>
				<div className="size-[30px] rounded-full overflow-hidden">
					<img
						src={logos[1].src}
						alt={logos[1].alt}
						className="h-full w-full object-cover"
					/>
				</div>
			</OrbitingCircles>

			{/* Outer Circles (reverse) */}
			<OrbitingCircles
				className="size-[50px] border-none bg-transparent"
				radius={190}
				duration={20}
				reverse
			>
				<div className="size-[50px] rounded-full overflow-hidden">
					<img
						src={logos[2].src}
						alt={logos[2].alt}
						className="h-full w-full object-cover"
					/>
				</div>
			</OrbitingCircles>
			<OrbitingCircles
				className="size-[50px] border-none bg-transparent"
				radius={190}
				duration={20}
				delay={20}
				reverse
			>
				<div className="size-[50px] rounded-full overflow-hidden">
					<img
						src={logos[3].src}
						alt={logos[3].alt}
						className="h-full w-full object-cover"
					/>
				</div>
			</OrbitingCircles>
			<OrbitingCircles
				className="size-[50px] border-none bg-transparent"
				radius={190}
				duration={20}
				delay={5}
				reverse
			>
				<div className="size-[50px] rounded-full overflow-hidden">
					<img
						src={logos[4].src}
						alt={logos[4].alt}
						className="h-full w-full object-cover"
					/>
				</div>
			</OrbitingCircles>
		</div>
	);
}