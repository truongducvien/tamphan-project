import http from 'services/http';

export const uploadFile = async (files: File[] | FileList, service: string) => {
	const payload = new FormData();
	for (let index = 0; index < files.length; index += 1) {
		payload.append('files', files[index] as unknown as string);
	}
	payload.append('service', service);
	const { data } = await http.post<{ data: { items: { fileId: string }[] } }>('/v1/files/upload/public', payload);
	return data;
};

export const loadImage = async (fileName: string) => {
	const { data } = await http.get<Blob>(`/v1/files/download/${fileName}`, {
		responseType: 'blob',
	});
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = reject;
		reader.readAsDataURL(data);
	});
};
