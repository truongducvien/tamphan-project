export interface BaseResponeList<IData> extends BaseResponeAction {
	data?: {
		items: Array<IData>;
		pageNum: number;
		pageSize: number;
		totalItems: number;
		totalPages: number;
	};
}

export interface BaseResponeAction {
	code: string;
	errors: Array<{ code: string; message: string }>;
	message: string;
}

export interface BaseResponeDetail<IData> {
	data?: IData;
	code: string;
	errors: Array<{ code: string; message: string }>;
	message: string;
}
