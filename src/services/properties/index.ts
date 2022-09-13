import http from 'services/http';
import { BaseResponseAction, BaseResponseDetail } from 'services/type';

import {
	IProperty,
	IPropertyPayload,
	IPropertyResponse,
	IPropertyParams,
	UpdateOwnerPayload,
	RelationshipWithOwner,
} from './type';

export const getProperty = async (payload: IPropertyParams) => {
	const { data } = await http.get<IPropertyResponse>('/v1/properties/search', {
		params: payload,
	});
	return data?.data ? { ...data?.data, nextPage: (data?.data?.pageNum || 0) + 1 } : null;
};

export const createProperty = async (payload: IPropertyPayload) => {
	const { data } = await http.post<BaseResponseDetail<IProperty>>('/v1/properties', {
		...payload,
	});
	return data || null;
};

export const getPropertyById = async (id: string) => {
	const { data } = await http.get<BaseResponseDetail<IProperty>>(`/v1/properties/${id}`);
	return data || null;
};

export const updateProperty = async (payload: IPropertyPayload) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/properties/${payload.id || ''}`, payload);
	return data || null;
};

export const updateOwner = async (payload: UpdateOwnerPayload) => {
	const { id, ...params } = payload;
	const { data } = await http.put<BaseResponseAction>(`/v1/properties/${id}/owner`, params);
	return data || null;
};

export const addResident = async (payload: {
	id: string;
	requests: { residentId: string; relationshipWithOwner: RelationshipWithOwner }[];
}) => {
	const { id, ...params } = payload;
	const { data } = await http.put<BaseResponseAction>(`/v1/properties/${id}/resident`, { ...params, propertyUuid: id });
	return data || null;
};

export const removeResident = async (payload: { id: string; residentIds: string[] }) => {
	const { id, ...params } = payload;
	const { data } = await http.delete<BaseResponseAction>(`/v1/properties/${id}/resident`, { data: { ...params } });
	return data || null;
};
