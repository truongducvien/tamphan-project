import http from 'src/services/http';

import { IReportDetail, IReportParams, IReportResponse } from './type';

export const getReport = async (params: IReportParams) => {
	const { data } = await http.get<IReportResponse>('/v1/authorization-requests/search', {
		params,
	});
	return data?.data || null;
};

export const getReportById = async (id: string) => {
	const { data } = await http.get<IReportDetail>(`/v1/authorization-requests/${id}`);

	return data?.data || null;
};

export const ReportAccept = async (id: string) => {
	const { data } = await http.put<IReportDetail>(`/v1/authorization-requests/${id}/accept`);
	return data?.data || null;
};

export const reportReject = async (id: string) => {
	const { data } = await http.put<IReportDetail>(`/v1/authorization-requests/${id}/reject`);
	return data?.data || null;
};
