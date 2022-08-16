import http from 'services/http';
import { BaseResponeAction, BaseResponeDetail } from 'services/type';

import { IResident, IResidentParams, IResidentPayload, IResidentResponse } from './type';

export const getResident = async (params: IResidentParams) => {
	const { data } = await http.get<IResidentResponse>('/v1/residents/search', {
		params,
	});
	return data?.data || null;
};

export const getAllResident = async () => {
	const { data } = await http.get<IResidentResponse>('/v1/residents/all');
	return data?.data || null;
};

export const getResidentOwner = async (flatId: string) => {
	const { data } = await http.get<BaseResponeDetail<IResident>>(`/v1/residents/owner/${flatId}`);
	return data?.data || null;
};

export const createResident = async (payload: Omit<IResidentPayload, 'id'>) => {
	const { data } = await http.post<BaseResponeAction>('/v1/residents', {
		...payload,
	});
	return data || null;
};

export const deleteResident = async (id: string) => {
	const { data } = await http.delete<BaseResponeAction>(`/v1/residents/${id}`);
	return data || null;
};

export const getResidentById = async (id: string) => {
	const { data } = await http.get<BaseResponeDetail<IResident>>(`/v1/residents/${id}`);
	return data || null;
};
export const getResidentByProperty = async (id: string) => {
	const { data } = await http.get<IResidentResponse>(`/v1/residents/property/${id}`);
	return data || null;
};

export const updateResident = async (payload: IResidentPayload) => {
	const { data } = await http.put<BaseResponeAction>(`/v1/residents/${payload.id || ''}`, payload);
	return data || null;
};
