import http from 'services/http';

export interface IFile extends File {
	objectId?: string;
	sizeLargeUrl?: string;
	thumbUrl?: string;
	url?: string;
	mimetype?: string;
	width?: number;
	height?: number;
}

export async function uploadFile(files: IFile[]): Promise<File[]> {
	try {
		const formData = new FormData();
		formData.append('service', 'ARTICLES');
		for (const iterator of files) {
			formData.append('files', iterator);
		}
		const resp = await http.post<{ files: IFile[] }, IFile[]>('/v1/files/upload/public', formData);
		return resp;
	} catch (error) {
		return [];
	}
}
