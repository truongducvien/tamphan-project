import http from 'src/services/http';

import { IFeedbackDetail, IFeedbackParams, IFeedbackResponse } from './type';

export const getFeedback = async (params: IFeedbackParams) => {
	const { data } = await http.get<IFeedbackResponse>('/v1/feedbacks/search', {
		params,
	});
	return data?.data || null;
};

export const getFeedbackById = async (id: string) => {
	const { data } = await http.get<IFeedbackDetail>(`/v1/feedbacks/${id}`);

	return data?.data || null;
};

export const feedbackAccept = async (id: string) => {
	const { data } = await http.put<IFeedbackDetail>(`/v1/feedbacks/${id}/accept`);
	return data?.data || null;
};

export const feedbackReject = async (id: string) => {
	const { data } = await http.put<IFeedbackDetail>(`/v1/feedbacks/${id}/reject`);
	return data?.data || null;
};
