import React from 'react';

import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { DatePicker, IDatePickerProps } from 'components/date';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

export interface DatePickerdHookFormProps extends InputProps, Omit<IDatePickerProps, 'onChange'> {
	name: string;
	label: string;
}

export const DatePickerdHookForm: React.FC<DatePickerdHookFormProps> = ({
	name,
	label,
	placeholder = 'Chọn ngày ...',
	variant = 'admin',
	...innerProps
}) => {
	const {
		control,
		formState: { errors },
	} = useFormContext();
	return (
		<Controller
			control={control}
			render={({ field: { onChange } }) => (
				<FormControl isRequired={innerProps.isRequired} isInvalid={!!errors?.[name]}>
					<FormLabel htmlFor={name}>{label}</FormLabel>
					<DatePicker
						borderColor={errors?.[name] ? '#FC8181' : undefined}
						{...innerProps}
						onChange={onChange}
						variant={variant}
						placeholder={placeholder}
					/>
					<FormErrorMessage>{(errors?.[name] as unknown as FieldError)?.message as unknown as string}</FormErrorMessage>
				</FormControl>
			)}
			name={name}
		/>
	);
};
