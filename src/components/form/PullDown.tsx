import React, { useEffect, useRef } from 'react';

import { FormControl, FormErrorMessage, FormLabel, useColorModeValue } from '@chakra-ui/react';
import { Select, GroupBase } from 'chakra-react-select';
import useDerivedProps from 'hooks/useDerivedProps';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

export interface PullDownReference {
	reset: () => void;
	getSelectedOption: () => Option | undefined;
}

type OptionBase = {
	variant?: string;
	colorScheme?: string;
	isFixed?: boolean;
	isDisabled?: boolean;
	isMulti?: boolean;
	onChange?: (value: Option) => void;
};

export interface Option {
	label: string;
	value: string | number;
}
type TagVariant = 'subtle' | 'solid' | 'outline';
export interface PullDownHookFormProps extends OptionBase {
	name: string;
	options: Array<Option>;
	defaultValue?: Array<Option> | Option;
	isSearchable?: boolean;
	tagVariant?: TagVariant;
	label: string;
	isRequired?: boolean;
	placeholder?: string;
	onInputChange?: (e: string) => void;
	isClearable?: boolean;
}

export const PullDowndHookForm: React.FC<PullDownHookFormProps> = ({
	name,
	defaultValue,
	isRequired,
	placeholder = 'Chọn ...',
	label,
	...innerProps
}) => {
	const dropdownRef = useRef<PullDownReference | null>(null);
	const {
		control,
		formState: { errors },
		getValues,
		clearErrors,
		setValue,
	} = useFormContext();

	useEffect(() => {
		if (defaultValue) setValue(name, defaultValue);
		else setValue(name, getValues(name));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultValue]);

	useDerivedProps((prevValue, currentValue) => {
		if (typeof currentValue === 'undefined' && prevValue !== null && currentValue !== prevValue) {
			setTimeout(() => {
				dropdownRef.current?.reset();
			}, 0);
			setTimeout(() => {
				clearErrors(name);
			}, 0);
		}
	}, getValues(name));

	const bg = useColorModeValue('white', 'navy.900');
	const border = '1px';
	const color = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
	const borderRadius = '16px';
	const fontSize = 'sm';
	const bgMenu = useColorModeValue('white', 'navy.900');
	const placeholderSt = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
	const forcusBorder = useColorModeValue('blue.300', 'blue.700');
	return (
		<Controller
			control={control}
			render={({ field: { ref, ...innerField } }) => {
				return (
					<FormControl minH="70px" isRequired={isRequired} isInvalid={!!errors?.[name]}>
						<FormLabel htmlFor={name}>{label}</FormLabel>
						<Select<Option, boolean, GroupBase<Option>>
							{...innerProps}
							{...innerField}
							chakraStyles={{
								singleValue: provided => ({
									...provided,
									color,
								}),
								control: provided => ({
									...provided,
									bg,
									border,
									borderColor,
									borderRadius,
									fontSize,
									_placeholder: placeholderSt,
									'&:focus-within': {
										borderWidth: 1,
										borderColor: forcusBorder,
										boxShadow: '0 0 0 0px',
									},
								}),
								menuList: provided => ({
									...provided,
									padding: '4px 0',
									bg: bgMenu,
								}),
							}}
							defaultValue={defaultValue}
							placeholder={placeholder}
							menuPortalTarget={document.body}
						/>
						<FormErrorMessage>
							{(errors?.[name] as unknown as { value: FieldError })?.value?.message as unknown as string}
						</FormErrorMessage>
					</FormControl>
				);
			}}
			name={name}
		/>
	);
};
