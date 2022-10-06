import http from 'src/services/http';

import { IResidentAuthDetail, IResidentAuthParams, IResidentAuthResponse } from './type';

export const getResidentAuth = async (params: IResidentAuthParams) => {
	const { data } = await http.get<IResidentAuthResponse>('/v1/authorizations/search', {
		params,
	});
	return data?.data || null;
};

export const residentAuthVoid = async (id: string) => {
	const { data } = await http.put<IResidentAuthDetail>(`/v1/authorizations/${id}/void`);
	return data?.data || null;
};
