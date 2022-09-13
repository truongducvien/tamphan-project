import http from 'services/http';

import { IResidentCardParams, IResidentCardResponse, IResidentCardImportpayload } from './type';

export const getResidentCard = async (params: IResidentCardParams) => {
	const { data } = await http.get<IResidentCardResponse>('/v1/resident-cards/search', {
		params,
	});
	return data?.data || null;
};

export const importResidentCard = async (params: FormData) => {
	const { data } = await http.post<IResidentCardResponse>('/v1/resident-cards/import', params);
	return data?.data || null;
};
