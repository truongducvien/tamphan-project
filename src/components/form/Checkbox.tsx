import React, { useRef } from 'react';

import { Checkbox, CheckboxProps, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import useEffectWithoutMounted from '@/hooks/useEffectWithoutMounted';

export interface CheckboxHookFormProps extends CheckboxProps {
	name: string;
	label: string;
}

export const CheckboxHookForm: React.FC<CheckboxHookFormProps> = ({ name, label, ...innerProps }) => {
	const {
		control,
		formState: { errors, isSubmitted, isDirty },
	} = useFormContext();
	const refs = useRef<HTMLInputElement>(null);

	useEffectWithoutMounted(() => {
		if (!isSubmitted && !isDirty) {
			if (refs.current?.value) refs.current.value = '';
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDirty]);
	return (
		<Controller
			control={control}
			render={({ field: { ref, ...innerField } }) => {
				return (
					<FormControl isRequired={innerProps.isRequired} isInvalid={!!errors?.[name]}>
						<Checkbox borderColor={errors?.[name] ? '#FC8181' : undefined} {...innerProps} {...innerField} ref={refs}>
							{label}
						</Checkbox>
						<FormErrorMessage>
							{(errors?.[name] as unknown as FieldError)?.message as unknown as string}
						</FormErrorMessage>
					</FormControl>
				);
			}}
			name={name}
		/>
	);
};
