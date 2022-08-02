import React from 'react';

import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { FieldError } from 'react-hook-form';

import { ConnectForm, UseFormConnectProps } from '.';

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
	...innerProps
}) => (
	<ConnectForm>
		{({ register, formState: { errors } }: UseFormConnectProps) => (
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
					{...register(name)}
					variant={variant}
					placeholder={placeholder}
				/>
				<FormErrorMessage>{(errors?.[name] as unknown as FieldError)?.message as unknown as string}</FormErrorMessage>
			</FormControl>
		)}
	</ConnectForm>
);
