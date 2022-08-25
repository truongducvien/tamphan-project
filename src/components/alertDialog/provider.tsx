import React, { useCallback, useState } from 'react';

import AlertDialog from '.';

interface PromiseRef {
	resolve: () => void;
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

// eslint-disable-next-line @typescript-eslint/unbound-method
export const DialogContext = React.createContext<(options: DialogServiceOption) => Promise<void>>(Promise.reject);

const DialogServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [dialogService, setDialogService] = useState<DialogServiceState>({
		title: '',
		open: false,
	});

	const promiseRef = React.useRef<PromiseRef>();

	const handleOpenDialog = useCallback((options: DialogServiceOption) => {
		setDialogService({ open: true, ...options });

		return new Promise<void>((resolve, reject) => {
			promiseRef.current = { resolve, reject };
		});
	}, []);

	const handleCloseDialog = useCallback(() => {
		setDialogService(prev => ({ ...prev, open: false }));
	}, []);

	const handleOk = useCallback(() => {
		if (promiseRef.current) {
			promiseRef.current.resolve();
		}
		handleCloseDialog();
	}, [handleCloseDialog]);

	const handleCancel = useCallback(() => {
		if (promiseRef.current) {
			promiseRef.current.reject();
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
