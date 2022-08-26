import http from 'services/http';

import { IResidentCardReqDetail, IResidentCardReqParams, IResidentCardReqResponse } from './type';

export const getResidentCardReq = async (params: IResidentCardReqParams) => {
	const { data } = await http.get<IResidentCardReqResponse>('/v1/card-requests/search', {
		params,
	});
	return data?.data || null;
};

export const getResidentCardReqById = async (id: string) => {
	const { data } = await http.get<IResidentCardReqDetail>(`/v1/card-requests/${id}`);
	return data?.data || null;
};

export const getResidentCardAcept = async (payload: { id: string; approvalNote: string; cardNumber?: string }) => {
	const { id, approvalNote, cardNumber } = payload;
	const { data } = await http.put<IResidentCardReqDetail>(`/v1/card-request-processes/${id}/accept`, {
		approvalNote,
		cardNumber,
	});
	return data?.data || null;
};

export const getResidentCardReject = async (payload: { id: string; approvalNote: string }) => {
	const { id, approvalNote } = payload;
	const { data } = await http.put<IResidentCardReqDetail>(`/v1/card-request-processes/${id}/reject`, { approvalNote });
	return data?.data || null;
};
