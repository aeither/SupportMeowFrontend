import type { ReactNode } from "react";
import Ripple from "./ui/ripple";

interface RippleWrapperProps {
	children: ReactNode;
	className?: string;
}

export function RippleWrapper({
	children,
	className = "",
}: RippleWrapperProps) {
	return (
		<div
			className={`relative flex min-h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl ${className}`}
		>
			<div className="z-10">{children}</div>
			<Ripple />
		</div>
	);
}
