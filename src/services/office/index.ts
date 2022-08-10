import http from 'services/http';
import { BaseResponeAction, BaseResponeDetail } from 'services/type';

import { IOffice, IOfficePayload, IOfficeResponse } from './type';

export const getOffice = async (name?: string) => {
	const { data } = await http.get<IOfficeResponse>('/v1/units/search', {
		params: {
			name,
		},
	});
	return data?.data || null;
};

export const createOffice = async (payload: IOfficePayload) => {
	const { data } = await http.post<BaseResponeAction>('/v1/units', {
		...payload,
	});
	return data || null;
};

export const deleteOffice = async (id: string) => {
	const { data } = await http.delete<BaseResponeAction>(`/v1/units/${id}`);
	return data || null;
};

export const getOfficeById = async (id: string) => {
	const { data } = await http.get<BaseResponeDetail<IOffice>>(`/v1/units/${id}`);
	return data || null;
};

export const updateOffice = async (payload: IOfficePayload) => {
	const { data } = await http.put<BaseResponeAction>(`/v1/units/${payload.id || ''}`, payload);
	return data || null;
};
