import http from 'src/services/http';
import { BaseResponseAction } from 'src/services/type';

import { IRoleDetail, IRoleParams, IRolePayload, IRoleResponse } from './type';

export const getRole = async (params: IRoleParams) => {
	const { data } = await http.get<IRoleResponse>('/v1/roles/search', {
		params: {
			...params,
		},
	});
	return data?.data || null;
};

export const createRole = async (payload: Omit<IRolePayload, 'id'>) => {
	const { data } = await http.post<BaseResponseAction>('/v1/roles', {
		...payload,
	});
	return data || null;
};

export const deleteRole = async (id: string) => {
	const { data } = await http.delete<BaseResponseAction>(`/v1/roles/${id}`);
	return data || null;
};

export const getRoleById = async (id: string) => {
	const { data } = await http.get<IRoleDetail>(`/v1/roles/${id}`);
	return data || null;
};

export const updateRole = async (payload: IRolePayload) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/roles/${payload.id || ''}`, payload);
	return data || null;
};
