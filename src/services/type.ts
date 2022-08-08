export interface BaseResponeList<IData> {
	data?: {
		items: Array<IData>;
		pageNum: number;
		pageSize: number;
		totalItems: number;
		totalPages: number;
	};
}
