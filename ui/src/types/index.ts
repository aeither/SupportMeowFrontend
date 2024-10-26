export interface CopyBag<T = string> {
	payload: Array<[T, bigint]>;
}

export interface Purse {
	brand: unknown;
	brandPetname: string;
	currentAmount: {
		brand: unknown;
		value: bigint | CopyBag;
	};
	displayInfo: {
		decimalPlaces: number;
		assetKind: unknown;
	};
}

import type { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
	interface Window extends KeplrWindow {}
}

export interface UploadFormData {
		name: string;
		description: string;
		price: string;
		image: File | null;
	}

export interface FormErrors {
	name?: string;
	description?: string;
	price?: string;
	image?: string;
}

export type InscriptionResponse = {
	transactionHash: string;
	inscriptionData: {
		data: {
			inscription: Array<{
				metadata: {
					parent: {
						type: string;
						identifier: string;
					};
					metadata: {
						mime: string;
						name: string;
						price: string;
						description: string;
					};
				};
				content_path: string;
				content_hash: string;
			}>;
		};
	};
};
