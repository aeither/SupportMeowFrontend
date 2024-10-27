// components/ui/animated-background.tsx
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "./ui/animated-grid-pattern";

interface AnimatedBackgroundProps {
	children: React.ReactNode;
	className?: string;
	containerClassName?: string;
	numSquares?: number;
	maxOpacity?: number;
	duration?: number;
	repeatDelay?: number;
	patternClassName?: string;
}

export function AnimatedBackground({
	children,
	className,
	containerClassName,
	numSquares = 30,
	maxOpacity = 0.1,
	duration = 3,
	repeatDelay = 1,
	patternClassName,
}: AnimatedBackgroundProps) {
	return (
		<div
			className={cn(
				"relative flex h-[300px] w-full items-center justify-center overflow-hidden p-20",
				containerClassName,
			)}
		>
			<div className={cn("z-10", className)}>{children}</div>
			<AnimatedGridPattern
				numSquares={numSquares}
				maxOpacity={maxOpacity}
				duration={duration}
				repeatDelay={repeatDelay}
				className={cn(
					"[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
					"inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
					patternClassName,
				)}
			/>
		</div>
	);
}
