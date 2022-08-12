import http from 'services/http';
import { BaseResponeAction } from 'services/type';

import { IRoleDetail, IRolePayload, IRoleResponse } from './type';

export const getRole = async (name?: string) => {
	const { data } = await http.get<IRoleResponse>('/v1/roles/search', {
		params: {
			name,
		},
	});
	return data?.data || null;
};

export const createRole = async (payload: IRolePayload) => {
	const { data } = await http.post<BaseResponeAction>('/v1/roles', {
		...payload,
	});
	return data || null;
};

export const deleteRole = async (id: string) => {
	const { data } = await http.delete<BaseResponeAction>(`/v1/roles/${id}`);
	return data || null;
};

export const getRoleById = async (id: string) => {
	const { data } = await http.get<IRoleDetail>(`/v1/roles/${id}`);
	return data || null;
};

export const updateRole = async (payload: IRolePayload) => {
	const { data } = await http.put<BaseResponeAction>(`/v1/roles/${payload.id || ''}`, payload);
	return data || null;
};
