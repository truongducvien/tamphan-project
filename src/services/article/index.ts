import http from 'src/services/http';
import { BaseResponseAction, BaseResponseDetail } from 'src/services/type';

import { IArticle, IArticleParams, IArticlePayload, IArticleResponse } from './type';

export const getArticle = async (params: IArticleParams) => {
	const { data } = await http.get<IArticleResponse>('/v1/articles/search', {
		params: {
			...params,
		},
	});
	return data?.data || null;
};

export const createArticle = async (payload: IArticlePayload) => {
	const { data } = await http.post<BaseResponseAction>('/v1/articles', {
		...payload,
	});
	return data || null;
};

export const deleteArticle = async (id: string) => {
	const { data } = await http.delete<BaseResponseAction>(`/v1/articles/${id}`);
	return data || null;
};

export const getArticleById = async (id: string) => {
	const { data } = await http.get<BaseResponseDetail<IArticle>>(`/v1/articles/${id}`);
	return data || null;
};

export const updateArticle = async (payload: IArticlePayload) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/articles/${payload.id || ''}`, payload);
	return data || null;
};
