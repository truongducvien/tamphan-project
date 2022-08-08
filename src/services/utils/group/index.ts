import http from 'services/http';
import { BaseResponeAction, BaseResponeDetail } from 'services/type';

import { IUtilsGroup, IUtilsGroupPayload, IUtilsGroupResponse } from './type';

export const getUtilsGroup = async (name?: string) => {
	const { data } = await http.get<IUtilsGroupResponse>('/v1/amenities-group/search', {
		params: {
			name,
		},
	});
	return data?.data || null;
};

export const createUtilsGroup = async (payload: IUtilsGroupPayload) => {
	const { data } = await http.post<BaseResponeAction>('/v1/amenities-group', {
		...payload,
	});
	return data || null;
};

export const deleteUtilsGroup = async (id: string) => {
	const { data } = await http.delete<BaseResponeAction>(`/v1/amenities-group/${id}`);
	return data || null;
};

export const getUtilsGroupById = async (id: string) => {
	const { data } = await http.get<BaseResponeDetail<IUtilsGroup>>(`/v1/amenities-group/${id}`);
	return data || null;
};

export const updateUtilsGroup = async (payload: IUtilsGroupPayload) => {
	const { data } = await http.put<BaseResponeAction>(`/v1/amenities-group/${payload.id || ''}`, payload);
	return data || null;
};
