import { FormControl, FormErrorMessage, FormLabel, Textarea, TextareaProps } from '@chakra-ui/react';
import { FieldError } from 'react-hook-form';

import { ConnectForm, UseFormConnectProps } from '.';

interface TextAreaFieldHookFormProps extends TextareaProps {
	name: string;
	label: string;
}

export const TextAreaFieldHookForm: React.FC<TextAreaFieldHookFormProps> = ({ name, label, ...innerProps }) => (
	<ConnectForm>
		{({ register, formState: { errors } }: UseFormConnectProps) => (
			<FormControl isRequired={innerProps.isRequired} isInvalid={!!errors?.[name]}>
				<FormLabel htmlFor={name}>{label}</FormLabel>
				<Textarea borderColor={errors?.[name] ? '#FC8181' : undefined} {...innerProps} {...register(name)} />
				<FormErrorMessage>{(errors?.[name] as unknown as FieldError)?.message as unknown as string}</FormErrorMessage>
			</FormControl>
		)}
	</ConnectForm>
);
