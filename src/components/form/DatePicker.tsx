import React, { useEffect } from 'react';

import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';
import { DatePicker, IDatePickerProps } from 'src/components/date';
import { RangTimePicker, TimePicker } from 'src/components/timepicker';

export interface DatePickerHookFormProps extends InputProps, Omit<IDatePickerProps, 'onChange'> {
	name: string;
	label: string;
}

export const DatePickerHookForm: React.FC<DatePickerHookFormProps> = ({
	name,
	label,
	placeholder = 'Chọn ngày ...',
	variant = 'admin',
	...innerProps
}) => {
	const {
		control,
		formState: { errors },
		getValues,
		setValue,
	} = useFormContext();
	useEffect(() => {
		setValue(name, getValues(name));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Controller
			control={control}
			render={({ field: { onChange, value } }) => (
				<FormControl isRequired={innerProps.isRequired} isInvalid={!!errors?.[name]}>
					<FormLabel htmlFor={name}>{label}</FormLabel>
					<DatePicker
						borderColor={errors?.[name] ? '#FC8181' : undefined}
						{...innerProps}
						onChange={onChange}
						defaultValue={value as string}
						defaultDay={value as string}
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

export const TimePickerHookForm: React.FC<DatePickerHookFormProps> = ({
	name,
	label,
	placeholder = 'Chọn giờ ...',
	variant = 'admin',
	...innerProps
}) => {
	const {
		control,
		formState: { errors },
		getValues,
		setValue,
	} = useFormContext();
	useEffect(() => {
		setValue(name, getValues(name));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Controller
			control={control}
			render={({ field: { onChange, value } }) => (
				<FormControl isRequired={innerProps.isRequired} isInvalid={!!errors?.[name]}>
					<FormLabel htmlFor={name}>{label}</FormLabel>
					<RangTimePicker
						borderColor={errors?.[name] ? '#FC8181' : undefined}
						{...innerProps}
						onChange={onChange}
						defaultValue={value as string}
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
