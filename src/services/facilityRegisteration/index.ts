import http from '@/services/http';
import { BaseResponseDetail } from '@/services/type';

import { IFacilityRe, IFacilityReSearchPayload, IFacilityGroupResponse } from './type';

export const getFacilityRe = async (payload: IFacilityReSearchPayload) => {
	const { data } = await http.get<IFacilityGroupResponse>('/v1/facility-bookings/search', {
		params: {
			...payload,
		},
	});
	return data?.data || null;
};

export const getFacilityReById = async (id: string) => {
	const { data } = await http.get<BaseResponseDetail<IFacilityRe>>(`/v1/facility-bookings/${id}`);
	return data || null;
};

export const confirmFacilityReById = async (payload: { id: string; paymentMethod: string }) => {
	const { data } = await http.put<BaseResponseDetail<IFacilityRe>>(`/v1/facility-bookings/${payload.id}/confirm`, {
		paymentMethod: payload.paymentMethod,
	});
	return data || null;
};
