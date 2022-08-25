import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FormControl, FormErrorMessage, FormLabel, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import { Select, GroupBase, SelectInstance } from 'chakra-react-select';
import useEffectWithoutMounted from 'hooks/useEffectWithoutMounted';
import { useForceUpdate } from 'hooks/useForceUpdate';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { Props as TagProps } from '../tag';

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
	tag?: TagProps['colorScheme'];
}

export interface BaseOption<D> {
	label: string;
	value: D;
	tag?: TagProps['colorScheme'];
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
	onLoadMore?: () => Promise<unknown>;
	isLoading?: boolean;
}

const renderLoading = () => (
	<div style={{ height: 25 }}>
		<Spinner />
	</div>
);

export const PullDowndHookForm: React.FC<PullDownHookFormProps> = ({
	name,
	defaultValue,
	isRequired,
	placeholder = 'Chọn ...',
	label,
	onLoadMore,
	isLoading,
	...innerProps
}) => {
	const refs = useRef<SelectInstance<Option, boolean, GroupBase<Option>>>(null);
	const loadingRef = useRef<boolean>(false);
	const [isExpanded, setExpanded] = useState<boolean>(false);

	const {
		control,
		formState: { errors, isSubmitted, isDirty },
	} = useFormContext();

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

	useEffectWithoutMounted(() => {
		if (!isSubmitted && !isDirty) {
			refs.current?.clearValue();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDirty]);

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
							ref={refs}
							loadingMessage={renderLoading}
							onMenuOpen={() => setExpanded(true)}
							onMenuClose={() => setExpanded(false)}
							classNamePrefix="select"
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
							isLoading={isLoading}
							// eslint-disable-next-line react/no-unstable-nested-components
							noOptionsMessage={() => <Text fontSize="xs">Không có dữ liệu</Text>}
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
