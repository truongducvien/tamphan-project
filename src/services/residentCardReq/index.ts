import http from 'services/http';

import { IResidentCardReqParams, IResidentCardReqResponse } from './type';

export const getResidentCardReq = async (params: IResidentCardReqParams) => {
	const { data } = await http.get<IResidentCardReqResponse>('/v1/card-requests/search', {
		params,
	});
	return data?.data || null;
};
