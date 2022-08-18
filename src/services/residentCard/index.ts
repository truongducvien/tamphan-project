import http from 'services/http';

import { IResidentCardParams, IResidentCardResponse } from './type';

export const getResidentCard = async (params: IResidentCardParams) => {
	const { data } = await http.get<IResidentCardResponse>('/v1/resident-cards/search', {
		params,
	});
	return data?.data || null;
};
