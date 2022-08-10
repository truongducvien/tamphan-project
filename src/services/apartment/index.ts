import http from 'services/http';
import { BaseResponeAction, BaseResponeDetail } from 'services/type';

import { IApartment, IApartmentPayload, IApartmentResponse, IApartmentParams } from './type';

export const getApartment = async (payload: IApartmentParams) => {
	const { data } = await http.get<IApartmentResponse>('/v1/flats/search', {
		params: payload,
	});
	return data?.data || null;
};

export const createApartment = async (payload: IApartmentPayload) => {
	const { data } = await http.post<BaseResponeAction>('/v1/flats', {
		...payload,
	});
	return data || null;
};

export const getApartmentById = async (id: string) => {
	const { data } = await http.get<BaseResponeDetail<IApartment>>(`/v1/flats/${id}`);
	return data || null;
};

export const updateApartment = async (payload: IApartmentPayload) => {
	const { data } = await http.put<BaseResponeAction>(`/v1/flats/${payload.id || ''}`, payload);
	return data || null;
};
