import http from 'services/http';

interface FileParams {
	saveOriginal?: boolean;
	targetClass?: string;
	targetId?: string;
	[k: string]: string | boolean | undefined;
}

export interface IFile extends File {
	objectId?: string;
	sizeLargeUrl?: string;
	thumbUrl?: string;
	url?: string;
	mimetype?: string;
	width?: number;
	height?: number;
}

export async function uploadFile(files: IFile[], params?: FileParams): Promise<File[]> {
	try {
		const resp = await http.post<{ files: IFile[]; params: FileParams }, IFile[]>('/file/upload', { files, params });
		return resp;
	} catch (error) {
		return [];
	}
}
