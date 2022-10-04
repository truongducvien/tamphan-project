import http from 'src/services/http';
import { BaseImportPayload, BaseResponseAction } from 'src/services/type';

import { IHandoverParams, IHandoverResponse, IHandoverBookingParams, IHandoverBookingResponse } from './type';

export const getHandover = async ({ code = '', page = 0, size = 10 }: IHandoverParams) => {
	const { data } = await http.get<IHandoverParams, { data: IHandoverResponse }>('/v1/properties-handover/search', {
		params: {
			code,
			page,
			size,
		},
	});
	return data?.data ? { ...data?.data, nextPage: (data?.data?.pageNum || 0) + 1 } : null;
};

export const importHandover = async (d: FormData) => {
	const { data } = await http.post<BaseResponseAction>('/v1/properties-handover/import', d);
	return data || null;
};

export const removeHandover = async (id: string) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/properties/${id}/pending-handover`);
	return data || null;
};

export const getHandoverBooking = async (payload: IHandoverBookingParams) => {
	const { data } = await http.get<IHandoverBookingParams, { data: IHandoverBookingResponse }>(
		'/v1/booking-handover/search',
		{
			params: { ...payload },
		},
	);
	return data?.data ? { ...data?.data, nextPage: (data?.data?.pageNum || 0) + 1 } : null;
};

export const acceptHandover = async (id: string) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/booking-handover/${id}/accept`);
	return data || null;
};

export const completedHandover = async (id: string) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/booking-handover/${id}/completed`);
	return data || null;
};
