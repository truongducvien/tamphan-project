import http from 'services/http';
import { BaseResponeAction, BaseResponeDetail } from 'services/type';

import { IApartment, IApartmentPayload, IApartmentResponse, IApartmentParams } from './type';

export const getApartment = async (payload: IApartmentParams) => {
	const { data } = await http.get<IApartmentResponse>('/v1/properties/search', {
		params: payload,
	});
	return data?.data ? { ...data?.data, nextPage: (data?.data?.pageNum || 0) + 1 } : null;
};

export const createApartment = async (payload: IApartmentPayload) => {
	const { data } = await http.post<BaseResponeDetail<IApartment>>('/v1/properties', {
		...payload,
	});
	return data || null;
};

export const getApartmentById = async (id: string) => {
	const { data } = await http.get<BaseResponeDetail<IApartment>>(`/v1/properties/${id}`);
	return data || null;
};

export const updateApartment = async (payload: IApartmentPayload) => {
	const { data } = await http.put<BaseResponeAction>(`/v1/properties/${payload.id || ''}`, payload);
	return data || null;
};
