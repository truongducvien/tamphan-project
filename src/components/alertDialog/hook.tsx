import { useContext, useEffect } from 'react';

import { DialogServiceOption, DialogContext } from './provider';

let confirmContext: (options: DialogServiceOption) => Promise<void>;
let alertContext: (options: Omit<DialogServiceOption, 'cancelLabel'>) => Promise<void>;

export const UseConfirm: React.FC = () => {
	const useDialog = useContext(DialogContext);

	if (useDialog === undefined) {
		throw new Error('useDialog must be used within DialogContext');
	}

	useEffect(() => {
		confirmContext = useDialog;
	}, [useDialog]);

	return null;
};

export const UseAlert: React.FC = () => {
	const useDialog = useContext(DialogContext);

	if (useDialog === undefined) {
		throw new Error('useDialog must be used within DialogContext');
	}

	useEffect(() => {
		alertContext = useDialog;
	}, [useDialog]);

	return null;
};

export const confirm = (options: DialogServiceOption) => confirmContext(options);
export const alert = (options: Omit<DialogServiceOption, 'cancelLabel'>) => alertContext(options);
