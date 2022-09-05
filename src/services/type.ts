export interface BaseResponseList<IData> extends BaseResponseAction {
	data?: {
		items: Array<IData>;
		pageNum: number;
		pageSize: number;
		totalItems: number;
		totalPages: number;
	};
}

export interface BaseResponseAction {
	code: string;
	errors: Array<{ code: string; message: string }>;
	message: string;
}

export interface BaseResponseDetail<IData> {
	data?: IData;
	code: string;
	errors: Array<{ code: string; message: string }>;
	message: string;
}

export interface BaseParams {
	page?: number;
	size?: number;
}
