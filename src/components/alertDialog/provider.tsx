import React, { useCallback, useState } from 'react';

import AlertDialog from '.';

interface PromiseRef {
	resolve: (value: boolean) => void;
	reject: () => void;
}

export interface DialogServiceOption {
	title: string;
	description?: React.ReactNode;
	type?: 'error' | 'message';
}

export interface DialogServiceState extends DialogServiceOption {
	open: boolean;
}

export const DialogContext = React.createContext<(options: DialogServiceOption) => Promise<boolean | void>>(
	// eslint-disable-next-line @typescript-eslint/unbound-method
	Promise.reject,
);

const DialogServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [dialogService, setDialogService] = useState<DialogServiceState>({
		title: '',
		type: 'error',
		open: false,
	});

	const promiseRef = React.useRef<PromiseRef>();

	const handleOpenDialog = useCallback((options: DialogServiceOption) => {
		setDialogService({ open: true, ...options });

		return new Promise<boolean>((resolve, reject) => {
			promiseRef.current = { resolve, reject };
		});
	}, []);

	const handleCloseDialog = useCallback(() => {
		setDialogService(prev => ({ ...prev, open: false }));
	}, []);

	const handleOk = useCallback(() => {
		if (promiseRef.current) {
			promiseRef.current.resolve(true);
		}
		handleCloseDialog();
	}, [handleCloseDialog]);

	const handleCancel = useCallback(() => {
		if (promiseRef.current) {
			promiseRef.current.resolve(false);
		}
		handleCloseDialog();
	}, [handleCloseDialog]);

	const { open, title, description, type } = dialogService;

	return (
		<>
			<DialogContext.Provider value={handleOpenDialog}>{children}</DialogContext.Provider>
			<AlertDialog
				isCentered
				title={title}
				isOpen={open}
				type={type}
				onClose={handleCancel}
				body={description}
				onConfirm={handleOk}
			/>
		</>
	);
};

export default DialogServiceProvider;
