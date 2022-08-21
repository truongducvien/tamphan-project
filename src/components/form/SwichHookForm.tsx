import React, { useRef } from 'react';

import {
	Checkbox,
	CheckboxProps,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Switch,
	SwitchProps,
} from '@chakra-ui/react';
import useEffectWithoutMounted from 'hooks/useEffectWithoutMounted';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

export interface SwichHookFormProp extends SwitchProps {
	name: string;
	label: string;
}

export const SwichHookForm: React.FC<SwichHookFormProp> = ({ name, label, ...innerProps }) => {
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
						<FormLabel htmlFor={name}>{label}</FormLabel>
						<Switch
							borderColor={errors?.[name] ? '#FC8181' : undefined}
							{...innerProps}
							{...innerField}
							isChecked={{ ...innerField }.value as unknown as boolean}
							ref={refs}
						/>
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
