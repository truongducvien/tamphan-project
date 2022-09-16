import http from 'src/services/http';

export interface IFile {
	data: { items: { fileId: string; link: string }[] };
}

export async function uploadFile(files: File[]) {
	try {
		const formData = new FormData();
		formData.append('service', 'ARTICLES');
		for (const iterator of files) {
			formData.append('files', iterator);
		}
		const resp = await http.post<IFile>('/v1/files/upload/public', formData);
		return resp?.data;
	} catch (error) {
		return { data: { items: [] } };
	}
}
