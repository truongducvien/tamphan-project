import http from 'src/services/http';

import { IResidentAuthReqDetail, IResidentAuthReqParams, IResidentAuthReqResponse } from './type';

export const getResidentAuthReq = async (params: IResidentAuthReqParams) => {
	const { data } = await http.get<IResidentAuthReqResponse>('/v1/authorization-requests/search', {
		params,
	});
	return data?.data || null;
};

export const getResidentAuthReqById = async (id: string) => {
	const { data } = await http.get<IResidentAuthReqDetail>(`/v1/authorizations-requests/${id}`);

	return data?.data || null;
};

export const residentAuthReqVoid = async (id: string) => {
	const { data } = await http.put<IResidentAuthReqDetail>(`/v1/authorizations-requests/${id}/void`);
	return data?.data || null;
};
