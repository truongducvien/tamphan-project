import React, { useRef } from 'react';

import { ButtonProps, Button, Input } from '@chakra-ui/react';
import { useToastInstance } from 'components/toast';

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
			<Input hidden type="file" ref={inputRef} onChange={handleChangeFile} accept=".xlsx,.xls,.csv" />
			<Button
				iconName={isLoading ? 'white-loading-rotation' : 'plus-circle'}
				onClick={() => inputRef.current?.click()}
				colorScheme="cyan"
				textColor="white"
				{...innerProps}
			>
				Import
			</Button>
		</>
	);
};
