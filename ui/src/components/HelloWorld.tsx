// components/HelloWorld.tsx
import { Card, Button } from "react-daisyui";
import { useAccount } from "wagmi";
import { useHelloWorld } from "../hooks/useHelloWorld";

export function HelloWorld() {
	const { isConnected } = useAccount();
	const { greeting, isLoadingGreeting, sayHello, isSayingHello, error } =
		useHelloWorld();

	return (
		<Card className="p-6 max-w-md mx-auto mt-8">
			<div className="space-y-4">
				<h2 className="text-2xl font-bold text-center">Hello World Contract</h2>

				{!isConnected ? (
					<p className="text-center text-gray-500">
						Please connect your wallet to interact with the contract
					</p>
				) : (
					<>
						<div className="text-center">
							<h3 className="font-semibold mb-2">Current Greeting:</h3>
							{isLoadingGreeting ? (
								<div className="animate-spin h-5 w-5 border-b-2 border-gray-900 rounded-full mx-auto" />
							) : (
								<p className="text-lg">{greeting}</p>
							)}
						</div>

						<Button
							className="w-full"
							onClick={() => sayHello()}
							disabled={isSayingHello}
						>
							{isSayingHello ? (
								<div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
							) : (
								"Say Hello"
							)}
						</Button>

						{error && (
							<p className="text-red-500 text-sm text-center">
								{error.message}
							</p>
						)}
					</>
				)}
			</div>
		</Card>
	);
}
