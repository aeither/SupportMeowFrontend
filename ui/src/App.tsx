import { AgoricProvider } from "@agoric/react-components";
import "@agoric/react-components/dist/style.css";
import { ThemeProvider, useTheme } from "@interchain-ui/react";
import { wallets } from "cosmos-kit";
import { useEffect } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Tabs } from "./components/Tabs";
import { ContractProvider } from "./providers/Contract";

// Root layout component
function RootLayout() {
	const { themeClass, setTheme, setColorMode } = useTheme();

	useEffect(() => {
		setColorMode("dark");
		setTheme("dark");
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
				path: "/some-path",
				element: <div>Some Component</div>,
			},
		],
	},
]);

function App() {
	return (
		<ThemeProvider>
			<AgoricProvider
				wallets={wallets.extension}
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
				]}
				defaultChainName="agoric-local"
			>
				<ContractProvider>
					<RouterProvider router={router} />
				</ContractProvider>
			</AgoricProvider>
		</ThemeProvider>
	);
}

export default App;