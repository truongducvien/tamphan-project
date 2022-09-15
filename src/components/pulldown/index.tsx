import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Text, useColorModeValue } from '@chakra-ui/react';
import { Select, GroupBase, SelectInstance } from 'chakra-react-select';

import { useForceUpdate } from '@/hooks/useForceUpdate';

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
	onLoadMore?: () => Promise<void>;
	isLoading?: boolean;
	menuPortalTarget?: boolean;
	isClearable?: boolean;
	value?: Array<Option> | Option;
}

export const PullDown: React.FC<PullDownHookFormProps> = ({
	defaultValue,
	placeholder = 'Chọn ...',
	onChange,
	onLoadMore,
	isLoading,
	tagVariant = 'solid',
	menuPortalTarget = true,
	colorScheme = 'teal',
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

	const refs = useRef<SelectInstance<Option, boolean, GroupBase<Option>>>(null);
	const loadingRef = useRef<boolean>(false);
	const [isExpanded, setExpanded] = useState<boolean>(false);

	const forceUpdate = useForceUpdate();

	const detectLoadMore = useCallback(
		async (element: HTMLElement) => {
			if (loadingRef.current || !onLoadMore) return;

			const { scrollTop, clientHeight, scrollHeight } = element;
			const isTriggerDistance = Math.round(scrollTop + clientHeight + 38) >= scrollHeight;

			if (!isTriggerDistance) return;

			// @see https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559
			loadingRef.current = true;
			forceUpdate();

			await onLoadMore();

			loadingRef.current = false;
			forceUpdate();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[onLoadMore],
	);

	useEffect(() => {
		if (!onLoadMore) return undefined;
		const menuList = refs.current?.menuListRef;
		if (!menuList) return undefined;

		const onTriggerCallback = () => {
			detectLoadMore(menuList);
		};

		menuList.addEventListener('scroll', onTriggerCallback);

		return () => {
			menuList.removeEventListener('scroll', onTriggerCallback);
		};
	}, [detectLoadMore, onLoadMore, isExpanded]);

	return (
		<Select<Option, boolean, GroupBase<Option>>
			tagVariant={tagVariant}
			colorScheme={colorScheme}
			placeholder={placeholder}
			{...innerProps}
			ref={refs}
			onMenuOpen={() => setExpanded(true)}
			onMenuClose={() => setExpanded(false)}
			isLoading={isLoading}
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
				option: provided => ({
					...provided,
					opacity: 1,
				}),
			}}
			onChange={value => {
				const newvalue = value as Option;
				onChange?.(newvalue);
			}}
			menuPortalTarget={menuPortalTarget ? document.body : undefined}
			defaultValue={defaultValue}
			// eslint-disable-next-line react/no-unstable-nested-components
			noOptionsMessage={() => <Text>Không có dữ liệu</Text>}
		/>
	);
};
