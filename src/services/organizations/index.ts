import http from 'services/http';
import { BaseResponseAction, BaseResponseDetail } from 'services/type';

import { IOrganization, IOrganizationPayload, IOrganizationResponse } from './type';

export const getOrganization = async (name?: string) => {
	const { data } = await http.get<IOrganizationResponse>('/v1/organizations/search', {
		params: {
			name,
		},
	});
	return data?.data || null;
};

export const getAllOrganization = async () => {
	const { data } = await http.get<IOrganizationResponse>('/v1/organizations/all');
	return data?.data || null;
};

export const createOrganization = async (payload: IOrganizationPayload) => {
	const { data } = await http.post<BaseResponseAction>('/v1/organizations', {
		...payload,
	});
	return data || null;
};

export const deleteOrganization = async (id: string) => {
	const { data } = await http.delete<BaseResponseAction>(`/v1/organizations/${id}`);
	return data || null;
};

export const getOrganizationById = async (id: string) => {
	const { data } = await http.get<BaseResponseDetail<IOrganization>>(`/v1/organizations/${id}`);
	return data || null;
};

export const updateOrganization = async (payload: IOrganizationPayload) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/organizations/${payload.id || ''}`, payload);
	return data || null;
};
