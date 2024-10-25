import { ConnectWalletButton, NetworkDropdown } from "@agoric/react-components";
import { ThumbsUpIcon } from "lucide-react";

const Navbar = () => {
	return (
		<nav className="top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo and Brand */}
					<div className="flex items-center">
						<a
							href="/"
							className="flex items-center space-x-3 group"
							aria-label="Home"
						>
							{/* <div className="relative flex-shrink-0 w-8 h-8">
								<img
									src="/agoric.svg"
									alt=""
									className="w-full h-full object-contain transition-transform group-hover:scale-105"
									loading="eager"
								/>
							</div> */}
							<ThumbsUpIcon  className="text-white"/>
							<span className="hidden sm:block text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
								Cat Shelter
							</span>
						</a>
					</div>

					{/* Rest of the navbar remains the same */}
					<div className="hidden md:flex items-center space-x-4">
						{/* Add navigation links if needed */}
					</div>

					<div className="flex items-center space-x-4">
						<div className="relative">
							<NetworkDropdown className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" />
						</div>

						<ConnectWalletButton className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors" />
					</div>
				</div>
			</div>
		</nav>
	);
};

export { Navbar };
