// types/contract.ts
export interface HelloWorldContract {
	contractAddress: string;
	codeId: number;
}

export interface HelloWorldMsg {
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	say_hello: {};
}

export interface HelloWorldQuery {
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	get_greeting: {};
}