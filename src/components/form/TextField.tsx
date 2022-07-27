import React from 'react';

import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { FieldError } from 'react-hook-form';

import { ConnectForm, UseFormConnectProps } from '.';

export interface TextFieldHookFormProps extends InputProps {
	name: string;
	label: string;
}

export const TextFieldHookForm: React.FC<TextFieldHookFormProps> = ({ name, label, ...innerProps }) => (
	<ConnectForm>
		{({ register, formState: { errors } }: UseFormConnectProps) => (
			<FormControl isRequired={innerProps.isRequired} isInvalid={!!errors?.[name]}>
				<FormLabel htmlFor={name}>{label}</FormLabel>
				<Input borderColor={errors?.[name] ? '#FC8181' : undefined} {...innerProps} {...register(name)} />
				<FormErrorMessage>{(errors?.[name] as unknown as FieldError)?.message as unknown as string}</FormErrorMessage>
			</FormControl>
		)}
	</ConnectForm>
);
