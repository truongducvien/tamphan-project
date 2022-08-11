import http from 'services/http';
import { BaseResponeAction, BaseResponeDetail } from 'services/type';

import { IUtils, IUtilsSearchPayload, IUtilsCreatePayload, IUtilsGroupResponse } from './type';

export const getUtils = async (payload: IUtilsSearchPayload) => {
	const { data } = await http.get<IUtilsGroupResponse>('/v1/facilities/search', {
		params: {
			...payload,
		},
	});
	return data?.data || null;
};

export const createUtils = async (payload: IUtilsCreatePayload) => {
	const { data } = await http.post<BaseResponeAction>('/v1/facilities', {
		...payload,
	});
	return data || null;
};

export const deleteUtils = async (id: string) => {
	const { data } = await http.delete<BaseResponeAction>(`/v1/facilities/${id}`);
	return data || null;
};

export const getUtilsById = async (id: string) => {
	const { data } = await http.get<BaseResponeDetail<IUtils>>(`/v1/facilities/${id}`);
	return data || null;
};

export const updateUtils = async (payload: IUtilsCreatePayload) => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { id, ..._payload } = payload;
	const { data } = await http.put<BaseResponeAction>(`/v1/facilities/${id || ''}`, _payload);
	return data || null;
};
