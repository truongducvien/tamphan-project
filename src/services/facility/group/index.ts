import http from '@/services/http';
import { BaseResponseAction, BaseResponseDetail } from '@/services/type';

import { IFacilityGroup, IFacilityGroupParams, IFacilityGroupPayload, IFacilityGroupResponse } from './type';

export const getFacilityGroup = async (payload: IFacilityGroupParams) => {
	const { data } = await http.get<IFacilityGroupResponse>('/v1/facility-groups/search', {
		params: payload,
	});
	return data?.data ? { ...data?.data, nextPage: (data?.data?.pageNum || 0) + 1 } : null;
};

export const createFacilityGroup = async (payload: IFacilityGroupPayload) => {
	const { data } = await http.post<BaseResponseAction>('/v1/facility-groups', {
		...payload,
	});
	return data || null;
};

export const deleteFacilityGroup = async (id: string) => {
	const { data } = await http.delete<BaseResponseAction>(`/v1/facility-groups/${id}`);
	return data || null;
};

export const getFacilityGroupById = async (id: string) => {
	const { data } = await http.get<BaseResponseDetail<IFacilityGroup>>(`/v1/facility-groups/${id}`);
	return data || null;
};

export const updateFacilityGroup = async (payload: IFacilityGroupPayload) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/facility-groups/${payload.id || ''}`, payload);
	return data || null;
};
