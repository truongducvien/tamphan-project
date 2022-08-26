import { useRef } from 'react';

import { FormControl, FormErrorMessage, FormLabel, Textarea, TextareaProps } from '@chakra-ui/react';
import useEffectWithoutMounted from 'hooks/useEffectWithoutMounted';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

interface TextAreaFieldHookFormProps extends TextareaProps {
	name: string;
	label: string;
}

export const TextAreaFieldHookForm: React.FC<TextAreaFieldHookFormProps> = ({
	name,
	label,
	visibility,
	...innerProps
}) => {
	const {
		control,
		formState: { errors, isSubmitted, isDirty },
	} = useFormContext();
	const refs = useRef<HTMLTextAreaElement>(null);

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
					<FormControl isRequired={innerProps.isRequired} isInvalid={!!errors?.[name]} visibility={visibility}>
						<FormLabel htmlFor={name}>{label}</FormLabel>
						<Textarea borderColor={errors?.[name] ? '#FC8181' : undefined} ref={refs} {...innerProps} {...innerField} />
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
