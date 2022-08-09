import React from 'react';

import { useColorModeValue } from '@chakra-ui/react';
import { Select, GroupBase } from 'chakra-react-select';

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
	placeholder?: string;
	onChange?: (value: Option) => void;
	onInputChange?: (e: string) => void;
}

export const PullDown: React.FC<PullDownHookFormProps> = ({
	defaultValue,
	placeholder = 'Chọn ...',
	onChange,
	...innerProps
}) => {
	const bg = useColorModeValue('white', 'navy.900');
	const border = '1px';
	const color = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
	const borderColorFucus = useColorModeValue('blue.300', 'blue.700');
	const borderRadius = '16px';
	const fontSize = 'sm';
	const bgMenu = useColorModeValue('white', 'navy.900');
	const placeholderSt = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
	return (
		<Select<Option, boolean, GroupBase<Option>>
			{...innerProps}
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
						borderColor: borderColorFucus,
						boxShadow: '0 0 0 0px',
					},
				}),
				menuList: provided => ({
					...provided,
					padding: '4px 0',
					bg: bgMenu,
					zIndex: 9999,
				}),
			}}
			onChange={value => {
				const newvalue = value as Option;
				onChange?.(newvalue);
			}}
			placeholder={placeholder}
			defaultValue={defaultValue}
		/>
	);
};
