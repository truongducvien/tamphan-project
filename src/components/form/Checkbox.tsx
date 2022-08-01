import React from 'react';

import { Checkbox, CheckboxProps, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { FieldError } from 'react-hook-form';

import { ConnectForm, UseFormConnectProps } from '.';

export interface TextFieldHookFormProps extends CheckboxProps {
	name: string;
	label: string;
}

export const CheckboxHookForm: React.FC<TextFieldHookFormProps> = ({ name, label, ...innerProps }) => (
	<ConnectForm>
		{({ register, formState: { errors } }: UseFormConnectProps) => (
			<FormControl isRequired={innerProps.isRequired} isInvalid={!!errors?.[name]}>
				<Checkbox borderColor={errors?.[name] ? '#FC8181' : undefined} {...innerProps} {...register(name)}>
					{label}
				</Checkbox>
				<FormErrorMessage>{(errors?.[name] as unknown as FieldError)?.message as unknown as string}</FormErrorMessage>
			</FormControl>
		)}
	</ConnectForm>
);
