import { AgoricProvider } from "@agoric/react-components";
import "@agoric/react-components/dist/style.css";
import { ThemeProvider, useTheme } from "@interchain-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wallets } from "cosmos-kit";
import { useEffect } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Tabs } from "./components/Tabs";
import { InteractPage } from "./pages/InteractPage";
import { ListPage } from "./pages/ListPage";
import UploadPage from "./pages/UploadPage";
import { VerifyPage } from "./pages/VerifyPage";
import { ContractProvider } from "./providers/Contract";

const queryClient = new QueryClient();

// Root layout component
function RootLayout() {
	const { themeClass, setTheme, setColorMode } = useTheme();

	useEffect(() => {
		setColorMode("light");
		setTheme("light");
	}, [setTheme, setColorMode]);

	return (
		<div className={themeClass}>
			<Navbar />
			<Outlet />
		</div>
	);
}

// Router configuration
const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				path: "/",
				element: <Tabs />,
			},
			// Add more routes as needed
			{
				path: "/upload",
				element: <UploadPage />,
			},
			{
				path: "/list",
				element: <ListPage />,
			},
			{
				path: "/verify",
				element: <VerifyPage />,
			},
			{
				path: "/interact",
				element: <InteractPage />,
			},
		],
	},
]);

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<AgoricProvider
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					wallets={wallets.extension as unknown as any}
					agoricNetworkConfigs={[
						{
							testChain: {
								chainId: "agoriclocal",
								chainName: "agoric-local",
								iconUrl: "agoric.svg",
							},
							apis: {
								rest: ["http://localhost:1317"],
								rpc: ["http://localhost:26657"],
							},
						},
						{
							testChain: {
								chainId: "agoric-emerynet-8",
								chainName: "emerynet",
								iconUrl: "agoric.svg",
							},
							apis: {
								rest: ["https://emerynet.api.agoric.net"],
								rpc: ["https://emerynet.rpc.agoric.net"],
							},
						},
						{
							testChain: {
								chainId: "theta-testnet-001",
								chainName: "cosmos-hub-testnet",
								iconUrl: "cosmos.svg",
							},
							apis: {
								rest: ["https://rest.sentry-01.theta-testnet.polypore.xyz"],
								rpc: ["https://rpc.sentry-01.theta-testnet.polypore.xyz"],
							},
						},
					]}
					defaultChainName="agoric-local"
				>
					<ContractProvider>
						<RouterProvider router={router} />
					</ContractProvider>
				</AgoricProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
