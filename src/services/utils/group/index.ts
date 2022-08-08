import http from 'services/http';

import { IUtilsGroupResponse } from './type';

export const getUtilsGroup = async (name?: string) => {
	const { data } = await http.get<IUtilsGroupResponse>('/v1/amenities-group/search', {
		params: {
			name,
		},
	});
	return data?.data || null;
};
