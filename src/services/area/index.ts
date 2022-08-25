import http from 'services/http';
import { BaseResponeAction, BaseResponeDetail } from 'services/type';

import { IArea, IAreaParams, IAreaPayload, IAreaResponse } from './type';

export const getArea = async ({ name = '', page = 0, size = 10 }: IAreaParams) => {
	const { data } = await http.get<IAreaParams, { data: IAreaResponse }>('/v1/areas/search', {
		params: {
			name,
			page,
			size,
		},
	});
	return data?.data || null;
};

export const createArea = async (payload: IAreaPayload) => {
	const { data } = await http.post<BaseResponeAction>('/v1/areas', {
		...payload,
	});
	return data || null;
};

export const deleteArea = async (id: string) => {
	const { data } = await http.delete<BaseResponeAction>(`/v1/areas/${id}`);
	return data || null;
};

export const getAreaById = async (id: string) => {
	const { data } = await http.get<BaseResponeDetail<IArea>>(`/v1/areas/${id}`);
	return data || null;
};

export const updateArea = async (payload: IAreaPayload) => {
	const { data } = await http.put<BaseResponeAction>(`/v1/areas/${payload.id || ''}`, payload);
	return data || null;
};
