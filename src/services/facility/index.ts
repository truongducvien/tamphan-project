import http from '@/services/http';
import { BaseResponseAction, BaseResponseDetail } from '@/services/type';

import { IFacility, IFacilitySearchPayload, IFacilityCreatePayload, IFacilityGroupResponse } from './type';

export const getFacility = async (payload: IFacilitySearchPayload) => {
	const { data } = await http.get<IFacilityGroupResponse>('/v1/facilities/search', {
		params: {
			...payload,
		},
	});
	return data?.data || null;
};

export const createFacility = async (payload: IFacilityCreatePayload) => {
	const { data } = await http.post<BaseResponseAction>('/v1/facilities', {
		...payload,
	});
	return data || null;
};

export const deleteFacility = async (id: string) => {
	const { data } = await http.delete<BaseResponseAction>(`/v1/facilities/${id}`);
	return data || null;
};

export const getFacilityById = async (id: string) => {
	const { data } = await http.get<BaseResponseDetail<IFacility>>(`/v1/facilities/${id}`);
	return data || null;
};

export const updateFacility = async (payload: IFacilityCreatePayload) => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { id, ..._payload } = payload;
	const { data } = await http.put<BaseResponseAction>(`/v1/facilities/${id || ''}`, _payload);
	return data || null;
};
