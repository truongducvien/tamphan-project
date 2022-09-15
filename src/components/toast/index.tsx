import React, { useRef } from 'react';

import { createStandaloneToast, ToastId, UseToastOptions } from '@chakra-ui/react';

const { ToastContainer, toast: toastInstance } = createStandaloneToast();

export const Toastify: React.FC = () => <ToastContainer />;
export const useToastInstance = (options?: UseToastOptions) => {
	const defaultToast: UseToastOptions = {
		position: 'top-right',
		...options,
	};
	const toastIdRef = useRef<ToastId>();
	let toastId = toastIdRef.current;

	const update = (props?: UseToastOptions) => {
		if (toastId) {
			toastInstance.update(toastId, { ...defaultToast, ...props });
		}
	};

	const addToast = (props?: UseToastOptions) => {
		toastId = toastInstance({ ...defaultToast, ...props });
	};

	const toastAsync = async (props?: UseToastOptions) =>
		new Promise<void>(rej => {
			toastId = toastInstance({ ...defaultToast, ...props });
			setTimeout(() => {
				rej();
			}, 1000);
		});

	return { toast: addToast, toastAsync, updateToast: update };
};
