import http from 'services/http';
import { BaseResponseAction, BaseResponseDetail } from 'services/type';

import { IArea, IAreaParams, IAreaPayload, IAreaResponse } from './type';

export const getArea = async ({ code = '', page = 0, size = 10 }: IAreaParams) => {
	const { data } = await http.get<IAreaParams, { data: IAreaResponse }>('/v1/areas/search', {
		params: {
			code,
			page,
			size,
		},
	});
	return data?.data || null;
};

export const createArea = async (payload: IAreaPayload) => {
	const { data } = await http.post<BaseResponseAction>('/v1/areas', {
		...payload,
	});
	return data || null;
};

export const deleteArea = async (id: string) => {
	const { data } = await http.delete<BaseResponseAction>(`/v1/areas/${id}`);
	return data || null;
};

export const getAreaById = async (id: string) => {
	const { data } = await http.get<BaseResponseDetail<IArea>>(`/v1/areas/${id}`);
	return data || null;
};

export const updateArea = async (payload: IAreaPayload) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/areas/${payload.id || ''}`, payload);
	return data || null;
};
