import React, { useRef } from 'react';

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

interface Option {
	label: string;
	value: string | number;
}
type TagVariant = 'subtle' | 'solid' | 'outline';
export interface PullDownHookFormProps extends OptionBase {
	name: string;
	options: Array<Option>;
	defaultValue?: Array<Option>;
	isSearchable?: boolean;
	tagVariant?: TagVariant;
	label: string;
	isRequired?: boolean;
}

export const PullDowndHookForm: React.FC<PullDownHookFormProps> = ({
	name,
	defaultValue,
	isRequired,
	label,
	...innerProps
}) => {
	const dropdownRef = useRef<PullDownReference | null>(null);
	const {
		control,
		formState: { errors },
		getValues,
		clearErrors,
	} = useFormContext();

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
	const placeholder = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
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
									_placeholder: placeholder,
									'&:focus-within': {
										borderWidth: 0,
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
