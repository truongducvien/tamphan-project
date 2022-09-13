import React, { useRef } from 'react';

import { ButtonProps, Button, Input } from '@chakra-ui/react';
import { useToastInstance } from 'components/toast';
import { MdDownload, MdImportExport } from 'react-icons/md';

export interface Props extends Omit<ButtonProps, 'onClick' | 'iconName'> {
	onChangeFile?: (file: File) => void;
	limitSize?: number;
	isLoading?: boolean;
}

export const ImportButton: React.FC<Props> = ({ onChangeFile, isLoading, limitSize = 5, ...innerProps }) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const { toast } = useToastInstance();
	const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const file = e.target.files![0];
		const fileSize = file.size / 1048576;

		if (fileSize <= limitSize) {
			const reader = new FileReader();

			reader.readAsDataURL(file);
			reader.onloadend = () => {
				onChangeFile?.(file);
				if (inputRef.current) inputRef.current.value = '';
			};
		} else {
			toast({
				status: 'error',
				title: 'Tệp',
				description: `Tệp không được lớn hơn ${limitSize}MB`,
			});
		}
	};
	return (
		<>
			<Input hidden type="file" ref={inputRef} onChange={handleChangeFile} accept=".csv" />
			<Button
				variant="lightBrand"
				leftIcon={<MdImportExport />}
				onClick={() => inputRef.current?.click()}
				{...innerProps}
			>
				Import
			</Button>
		</>
	);
};

export const DownloadTemplate: React.FC<{ url: string } & ButtonProps> = ({ url, ...innerProps }) => {
	const handleDownload = () => {
		const link = document.createElement('a');
		link.download = 'template.csv';
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return (
		<Button variant="lightBrand" leftIcon={<MdDownload />} {...innerProps} onClick={handleDownload}>
			Tải mẫu import
		</Button>
	);
};
