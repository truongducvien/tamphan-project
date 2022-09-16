import React, { useEffect, useRef, useState } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import {
	InputGroup,
	Input,
	InputProps,
	Popover,
	PopoverTrigger,
	useDisclosure,
	InputRightElement,
	Icon,
	Portal,
	Box,
	Flex,
	PopoverContent,
	PopoverBody,
	PopoverCloseButton,
	PopoverFooter,
	Button,
} from '@chakra-ui/react';
import { MdClear } from 'react-icons/md';
import useEffectWithoutMounted from 'src/hooks/useEffectWithoutMounted';

export interface Props extends Omit<InputProps, 'onChange' | 'defaultValue'> {
	onChange?: (value: string) => void;
	fullMin?: boolean;
	defaultValue?: string;
	add?: boolean;
	rePlaceInput?: React.ReactNode;
}

const Data: React.FC<{
	data: Array<number>;
	selected?: string;
	onClick: (d: string) => void;
	defaultValue?: string;
}> = ({ data, selected, defaultValue, onClick }) => {
	const ref = useRef<Array<HTMLDivElement | null>>([]);

	useEffect(() => {
		if (defaultValue) {
			const currentHIdx = data.find(i => i === Number(defaultValue)) || 0;
			if (ref.current?.[currentHIdx])
				ref.current?.[currentHIdx]?.scrollIntoView({
					behavior: 'auto',
					block: 'center',
					inline: 'nearest',
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Box
			px={3}
			maxH={200}
			w="50%"
			overflow="scroll"
			sx={{
				'&::-webkit-scrollbar': {
					display: 'none',
				},
			}}
		>
			{data.map(m => {
				const isActive = !!selected && Number(selected) === m;
				return (
					<Box
						ref={r => {
							ref.current[m] = r;
						}}
						textAlign="center"
						color={!isActive ? 'telegram.400' : 'white'}
						fontWeight="bold"
						cursor="pointer"
						bg={isActive ? 'telegram.400' : 'inherit'}
						_hover={!isActive ? { bg: 'telegram.100' } : {}}
						onClick={() => {
							onClick(m < 10 ? `0${m}` : `${m}`);
						}}
					>
						{m < 10 ? `0${m}` : m}
					</Box>
				);
			})}
		</Box>
	);
};

export const TimePicker: React.FC<Props> = ({
	onChange,
	fullMin,
	//= '17:50'
	defaultValue,
	variant = 'admin',
	isDisabled,
	rePlaceInput,
	...innerProps
}) => {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const firstFieldRef = useRef(null);
	const hour = Array.from({ length: 24 }, (_, i) => i);
	const min = fullMin
		? Array.from({ length: 60 }, (_, i) => i)
		: Array.from({ length: 12 }, (_, i) => i).map(i => i * 5);

	const def = defaultValue ? defaultValue.split(':') : undefined;

	const [selectH, setH] = useState<string>(def?.[0] || '');
	const [selectM, setM] = useState<string>(def?.[1] || '');

	useEffectWithoutMounted(() => {
		if (selectH && selectM) {
			onChange?.(`${selectH}:${selectM}`);
		}
	}, [selectH, selectM]);

	return (
		<Popover
			isOpen={isOpen}
			initialFocusRef={firstFieldRef}
			onOpen={() => {
				if (isDisabled) return;
				onOpen();
			}}
			onClose={onClose}
			placement="bottom-start"
			closeOnBlur
			closeOnEsc
			{...innerProps}
		>
			<PopoverTrigger>
				<InputGroup>
					<Input value={`${selectH || `__`}:${selectM || `__`}`} {...innerProps} variant={variant} />
					<InputRightElement hidden={!selectH && !selectM}>
						<Icon
							as={MdClear}
							w={5}
							h={5}
							position="absolute"
							right={3}
							cursor="pointer"
							onClick={e => {
								e.stopPropagation();
								setH('');
								setM('');
							}}
						/>
					</InputRightElement>
				</InputGroup>
			</PopoverTrigger>
			<Portal>
				<PopoverContent>
					<PopoverCloseButton />
					<PopoverBody>
						<Flex my={3} justifyContent="space-evenly">
							<Data data={hour} selected={selectH} onClick={setH} defaultValue={def?.[0]} />
							<Data data={min} selected={selectM} onClick={setM} defaultValue={def?.[1]} />
						</Flex>
					</PopoverBody>
				</PopoverContent>
			</Portal>
		</Popover>
	);
};

export const RangTimePicker: React.FC<Props> = ({
	onChange,
	fullMin,
	//= 22:15 - 14:45
	defaultValue,
	variant = 'admin',
	isDisabled,
	add,
	rePlaceInput,
	...innerProps
}) => {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const firstFieldRef = useRef(null);
	const [isError, setIsError] = useState(false);
	const hour = Array.from({ length: 24 }, (_, i) => i);
	const min = fullMin
		? Array.from({ length: 60 }, (_, i) => i)
		: Array.from({ length: 12 }, (_, i) => i).map(i => i * 5);

	const def = defaultValue ? defaultValue.split('-') : undefined;
	const defFrom = def?.[0] ? def[0].split(':') : undefined;
	const defTo = def?.[0] ? def[1].split(':') : undefined;

	const [selectH, setH] = useState<string>(defFrom?.[0] || '');
	const [selectM, setM] = useState<string>(defFrom?.[1] || '');
	const [selectHTo, setHTo] = useState<string>(defTo?.[0] || '');
	const [selectMTo, setMTo] = useState<string>(defTo?.[1] || '');

	useEffectWithoutMounted(() => {
		if (selectH && selectM && selectHTo && selectMTo && !add) {
			onChange?.(`${selectH}:${selectM}-${selectHTo}:${selectMTo}`);
		}
	}, [selectH, selectM, selectHTo, selectMTo]);

	useEffect(() => {
		if (!selectH || !selectM || !selectHTo || !selectMTo) {
			setIsError(true);
			return;
		}
		setIsError(false);
	}, [add, selectH, selectHTo, selectM, selectMTo]);

	return (
		<Popover
			isOpen={isOpen}
			initialFocusRef={firstFieldRef}
			onOpen={() => {
				if (isDisabled) return;
				onOpen();
			}}
			onClose={onClose}
			placement="bottom"
			closeOnBlur
			closeOnEsc
			{...innerProps}
		>
			<PopoverTrigger>
				{rePlaceInput || (
					<InputGroup>
						<Input
							value={`${selectH || `__`}:${selectM || `__`} - ${selectHTo || `__`}:${selectMTo || `__`}`}
							{...innerProps}
							variant={variant}
						/>
						<InputRightElement hidden={!selectH && !selectM && !selectHTo && !selectMTo}>
							<Icon
								as={MdClear}
								w={5}
								h={5}
								position="absolute"
								right={3}
								cursor="pointer"
								onClick={e => {
									e.stopPropagation();
									setH('');
									setM('');
									setHTo('');
									setMTo('');
								}}
							/>
						</InputRightElement>
					</InputGroup>
				)}
			</PopoverTrigger>
			<Portal>
				<PopoverContent>
					<PopoverCloseButton />
					<PopoverBody>
						<Flex>
							<Flex flex={1} alignItems="center" justifyContent="center" fontStyle="italic">
								Từ
							</Flex>
							<Flex flex={1} alignItems="center" justifyContent="center" fontStyle="italic">
								Đến
							</Flex>
						</Flex>
						<Flex my={3} flex={1} justifyContent="space-evenly">
							<Data data={hour} selected={selectH} onClick={setH} defaultValue={def?.[0]} />
							<Data data={min} selected={selectM} onClick={setM} defaultValue={def?.[1]} />
							<Flex flex={1} alignItems="center">
								-
							</Flex>
							<Data data={hour} selected={selectHTo} onClick={setHTo} defaultValue={def?.[0]} />
							<Data data={min} selected={selectMTo} onClick={setMTo} defaultValue={def?.[1]} />
						</Flex>
					</PopoverBody>
					{add && (
						<PopoverFooter border="0" display="flex" alignItems="center" justifyContent="center">
							<Button
								color="telegram.400"
								isDisabled={isError}
								onClick={() => {
									onChange?.(`${selectH}:${selectM}-${selectHTo}:${selectMTo}`);
									setH('');
									setM('');
									setHTo('');
									setMTo('');
								}}
							>
								<AddIcon />
							</Button>
						</PopoverFooter>
					)}
				</PopoverContent>
			</Portal>
		</Popover>
	);
};
