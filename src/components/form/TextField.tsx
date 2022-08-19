import React, { useRef } from 'react';

import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import useEffectWithoutMounted from 'hooks/useEffectWithoutMounted';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

export interface TextFieldHookFormProps extends InputProps {
	name: string;
	label: string;
	horial?: boolean;
}

export const TextFieldHookForm: React.FC<TextFieldHookFormProps> = ({
	name,
	label,
	horial,
	variant = 'admin',
	placeholder = 'Nhập ...',
	hidden,
	...innerProps
}) => {
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
	if (hidden) return null;
	return (
		<Controller
			control={control}
			render={({ field: { ref, ...innerField } }) => {
				return (
					<FormControl
						display="flex"
						flexDirection={horial ? 'row' : 'column'}
						isRequired={innerProps.isRequired}
						isInvalid={!!errors?.[name]}
					>
						<FormLabel htmlFor={name}>{label}</FormLabel>
						<Input
							borderColor={errors?.[name] ? '#FC8181' : undefined}
							{...innerProps}
							{...innerField}
							ref={refs}
							variant={variant}
							placeholder={placeholder}
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
