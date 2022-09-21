import http from 'src/services/http';
import { BaseResponseAction, BaseResponseDetail } from 'src/services/type';

import { IResident, IResidentParams, IResidentPayload, IResidentResponse, IResidentV2Response } from './type';

export const getResident = async (params: IResidentParams) => {
	const { data } = await http.get<IResidentResponse>('/v1/residents/search', {
		params,
	});
	return data?.data || null;
};
export const getResidentV2 = async (params: IResidentParams) => {
	const { data } = await http.get<IResidentV2Response>('/v1/residents/search/info', {
		params,
	});
	return data?.data || null;
};

export const getAllResident = async () => {
	const { data } = await http.get<IResidentResponse>('/v1/residents/all');
	return data?.data || null;
};

export const getResidentOwner = async (flatId: string) => {
	const { data } = await http.get<BaseResponseDetail<IResident>>(`/v1/residents/owner/${flatId}`);
	return data?.data || null;
};

export const createResident = async (payload: Omit<IResidentPayload, 'id'>) => {
	const { data } = await http.post<BaseResponseAction>('/v1/residents', {
		...payload,
	});
	return data || null;
};

export const deleteResident = async (id: string) => {
	const { data } = await http.delete<BaseResponseAction>(`/v1/residents/${id}`);
	return data || null;
};

export const getResidentById = async (id: string) => {
	const { data } = await http.get<BaseResponseDetail<IResident>>(`/v1/residents/${id}`);
	return data || null;
};
export const getResidentByProperty = async (id: string) => {
	const { data } = await http.get<IResidentResponse>(`/v1/residents/property/${id}`);
	return data?.data || null;
};

export const updateResident = async (payload: IResidentPayload) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/residents/${payload.id || ''}`, payload);
	return data || null;
};

export const getResidentOfProperty = async (payload: { id: string; propertyId: string }) => {
	const { data } = await http.get<BaseResponseDetail<IResident>>(
		`/v1/residents/${payload.id}/property/${payload.propertyId}`,
	);
	return data || null;
};

export const importResident = async (params: FormData) => {
	const { data } = await http.post<IResidentResponse>('/v1/residents/import', params);
	return data?.data || null;
};
