import http from 'src/services/http';
import { BaseImportPayload, BaseResponseAction } from 'src/services/type';

import { IHandoverParams, IHandoverResponse } from './type';

export const getHandover = async ({ code = '', page = 0, size = 10 }: IHandoverParams) => {
	const { data } = await http.get<IHandoverParams, { data: IHandoverResponse }>('/v1/properties-handover/search', {
		params: {
			code,
			page,
			size,
		},
	});
	return data?.data ? { ...data?.data, nextPage: (data?.data?.pageNum || 0) + 1 } : null;
};

export const importHandover = async (payload: BaseImportPayload) => {
	const { data } = await http.post<BaseResponseAction>('/v1/properties-handover', {
		...payload,
	});
	return data || null;
};
