import React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, useFormContext, UseFormProps, UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';

export interface FormContainerProps<F> {
	useFormFields?: UseFormProps;
	validationSchema?: Yup.AnyObjectSchema;
	children: React.ReactNode;
	defaultValues?: { [x: string]: string };
	onSubmit?: (data: F, reset: UseFormReturn['reset']) => void;
}

export function FormContainer<F>({ children, validationSchema, onSubmit, ...innerProps }: FormContainerProps<F>) {
	const methods = useForm({
		mode: 'all',
		...innerProps,
		criteriaMode: 'firstError',
		shouldFocusError: true,
		...(validationSchema ? { resolver: yupResolver(validationSchema) } : {}),
	});

	return (
		<FormProvider {...methods}>
			<form
				noValidate
				onSubmit={onSubmit ? methods.handleSubmit(data => onSubmit(data as unknown as F, methods.reset)) : undefined}
			>
				{children}
			</form>
		</FormProvider>
	);
}

export const ConnectForm: React.FC<{ children: React.PropsWithChildren }> = ({ children }) => {
	const methods = useFormContext();
	return (children as unknown as React.FC<typeof methods>)({ ...methods });
};

export type UseFormConnectProps = UseFormReturn;
