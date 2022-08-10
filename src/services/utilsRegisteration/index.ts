import http from 'services/http';
import { BaseResponeDetail } from 'services/type';

import { IUtilsRe, IUtilsReSearchPayload, IUtilsGroupResponse } from './type';

export const getUtilsRe = async (payload: IUtilsReSearchPayload) => {
	const { data } = await http.get<IUtilsGroupResponse>('/v1/amenities-booking/search', {
		params: {
			...payload,
		},
	});
	return data?.data || null;
};

export const getUtilsReById = async (id: string) => {
	const { data } = await http.get<BaseResponeDetail<IUtilsRe>>(`/v1/amenities-booking/${id}`);
	return data || null;
};

export const confirmUtilsReById = async (payload: { id: string; paymentMethod: string }) => {
	const { data } = await http.put<BaseResponeDetail<IUtilsRe>>(`/v1/amenities-booking/${payload.id}/confirm`, {
		paymentMethod: payload.paymentMethod,
	});
	return data || null;
};
