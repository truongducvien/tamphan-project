import http from 'services/http';
import { BaseResponeAction, BaseResponeDetail } from 'services/type';

import { IUtilsGroup, IUtilsGroupPayload, IUtilsGroupResponse } from './type';

export const getUtilsGroup = async (name?: string) => {
	const { data } = await http.get<IUtilsGroupResponse>('/v1/facility-groups/search', {
		params: {
			name,
		},
	});
	return data?.data || null;
};

export const createUtilsGroup = async (payload: IUtilsGroupPayload) => {
	const { data } = await http.post<BaseResponeAction>('/v1/facility-groups', {
		...payload,
	});
	return data || null;
};

export const deleteUtilsGroup = async (id: string) => {
	const { data } = await http.delete<BaseResponeAction>(`/v1/facility-groups/${id}`);
	return data || null;
};

export const getUtilsGroupById = async (id: string) => {
	const { data } = await http.get<BaseResponeDetail<IUtilsGroup>>(`/v1/facility-groups/${id}`);
	return data || null;
};

export const updateUtilsGroup = async (payload: IUtilsGroupPayload) => {
	const { data } = await http.put<BaseResponeAction>(`/v1/facility-groups/${payload.id || ''}`, payload);
	return data || null;
};
