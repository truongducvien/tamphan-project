import http from 'services/http';
import { BaseResponeAction, BaseResponeDetail } from 'services/type';

import { IArea, IAreaResponse } from './type';

export const getArea = async (name?: string) => {
	const { data } = await http.get<IAreaResponse>('/v1/areas/search', {
		params: {
			name,
		},
	});
	return data?.data || null;
};
