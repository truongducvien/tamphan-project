import { useState, createRef } from 'react';

import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
	InputProps as ChakraInputProps,
	Menu,
	MenuButton,
	Button,
	MenuList,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	Box,
	Grid,
	Center,
	HStack,
	IconButton,
	VStack,
	Heading,
	useColorModeValue,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

import { daysMap, getMonthDetails, getMonthStr } from './utils';

const oneDay = 60 * 60 * 24 * 1000;
const todayTimestamp = Date.now() - (Date.now() % oneDay) + new Date().getTimezoneOffset() * 1000 * 60;

export interface IDatePickerProps extends Omit<ChakraInputProps, 'onChange'> {
	defaultDay?: Date;
	dateFormat?: string;
	onChange?: (date: string) => void;
}

export const DatePicker = ({ defaultDay, onChange, dateFormat = 'DD/MM/YYYY', ...rest }: IDatePickerProps) => {
	const date = new Date();
	const [year, setYear] = useState(date.getFullYear());
	const [month, setMonth] = useState(date.getMonth());
	const [monthDetails, setMonthDetails] = useState(getMonthDetails(year, month));
	const [selectedDay, setSelectedDay] = useState<number | undefined>(
		defaultDay ? defaultDay.setHours(0, 0, 0, 0) : undefined,
	);
	const inputRef = createRef<HTMLInputElement>();
	const isCurrentDay = (day: { timestamp: number; dayString: string }) => {
		const tooday = new Date().toLocaleTimeString('vi-VI', { weekday: 'short' });
		return day.timestamp === todayTimestamp && tooday.includes(day.dayString);
	};
	const isSelectedDay = (day: { timestamp: number }) => {
		return day.timestamp === selectedDay;
	};

	const getDateStringFromTimestamp = (timestamp: number) => {
		const dateObject = new Date(timestamp);
		const m = dateObject.getMonth() + 1;
		const d = dateObject.getDate();
		return dayjs(`${dateObject.getFullYear()}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`).format(dateFormat);
	};

	const onDateClick = (day: { timestamp: number }) => {
		setSelectedDay(day.timestamp);
		if (inputRef.current) {
			inputRef.current.value = getDateStringFromTimestamp(day.timestamp);
			onChange?.(inputRef.current.value);
		}
	};

	const setYearAction = (offset: number) => {
		setYear(year + offset);
		setMonthDetails(getMonthDetails(year + offset, month));
	};

	const setMonthAction = (offset: number) => {
		let y = year;
		let m = month + offset;
		if (m === -1) {
			m = 11;
			y -= 1;
		} else if (m === 12) {
			m = 0;
			y += 1;
		}
		setYear(y);
		setMonth(m);
		setMonthDetails(getMonthDetails(y, m));
	};
	const color = useColorModeValue('gray', 'white');
	const activeTextColor = useColorModeValue('white', 'white');
	const borderColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
	const curentDayColor = useColorModeValue('blue.200', 'blue.600');
	const activeBgColor = useColorModeValue('blue.500', 'blue.800');
	const forcusBorder = useColorModeValue('blue.300', 'blue.700');
	return (
		<Menu {...rest}>
			{({ isOpen }) => (
				<>
					<MenuButton w="100%" type="button">
						<InputGroup>
							<Input
								defaultValue={defaultDay ? getDateStringFromTimestamp(defaultDay.setHours(0, 0, 0, 0)) : undefined}
								color={color}
								ref={inputRef}
								{...rest}
								borderWidth={1}
								borderColor={isOpen ? forcusBorder : borderColor}
							/>
							<InputRightElement>
								<ChevronDownIcon w={5} h={5} />
							</InputRightElement>
						</InputGroup>
					</MenuButton>
					<MenuList>
						<Center p={3}>
							<HStack>
								<IconButton
									variant="ghost"
									aria-label="datepicker left button"
									onClick={() => setYearAction(-1)}
									icon={<ArrowLeftIcon color={color} />}
								/>
								<IconButton
									variant="ghost"
									aria-label="datepicker left button"
									onClick={() => setMonthAction(-1)}
									icon={<ChevronLeftIcon color={color} />}
								/>
								<VStack align="center">
									<Button variant="ghost" size="none">
										<Heading color={color} m={0} fontWeight={200} as="h5">
											{year}
										</Heading>
									</Button>
									<Button variant="ghost" size="none" py="0px" color={color} margin="0px !important">
										{getMonthStr(month).toUpperCase()}
									</Button>
								</VStack>
								<IconButton
									variant="ghost"
									aria-label="datepicker right button"
									color={color}
									onClick={() => setMonthAction(1)}
									icon={<ChevronRightIcon />}
								/>
								<IconButton
									variant="ghost"
									aria-label="datepicker right button"
									color={color}
									onClick={() => setYearAction(1)}
									icon={<ArrowRightIcon />}
								/>
							</HStack>
						</Center>
						<Box p={3}>
							<Grid alignItems="center" templateColumns="repeat(7, 1fr)" gap={3}>
								{daysMap.map((d, i) => (
									<Text color={color} key={i} w="100%">
										{d.substring(0, 3).toLocaleUpperCase()}
									</Text>
								))}
							</Grid>
						</Box>
						<Box p={3}>
							<Grid templateColumns="repeat(7, 1fr)" gap={3}>
								{monthDetails.map((day, index) => {
									return (
										<Button
											disabled={day.month !== 0}
											color={
												isCurrentDay(day)
													? activeTextColor
													: isSelectedDay(day) && day.month === 0
													? activeTextColor
													: color
											}
											backgroundColor={
												isSelectedDay(day) && day.month === 0 ? activeBgColor : isCurrentDay(day) ? curentDayColor : ''
											}
											variant="ghost"
											size="sm"
											key={index}
											onClick={() => onDateClick(day)}
										>
											{day.date}
										</Button>
									);
								})}
							</Grid>
						</Box>
					</MenuList>
				</>
			)}
		</Menu>
	);
};
