export const daysMap = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
export const monthMap = [
	'Tháng 1',
	'Tháng 2',
	'Tháng 3',
	'Tháng 4',
	'Tháng 5',
	'Tháng 6',
	'Tháng 7',
	'Tháng 8',
	'Tháng 9',
	'Tháng 10',
	'Tháng 11',
	'Tháng 12',
];

export const getNumberOfDays = (year: number, month: number) => {
	return 40 - new Date(year, month, 40).getDate();
};

export const getDayDetails = (args: {
	index: number;
	firstDay: number;
	month: number;
	year: number;
	numberOfDays: number;
}) => {
	const date = args.index - args.firstDay;
	const day = args.index % 7;
	let prevMonth = args.month - 1;
	let prevYear = args.year;
	if (prevMonth < 0) {
		prevMonth = 11;
		prevYear -= 1;
	}
	const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
	const d = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
	const month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
	const timestamp = new Date(args.year, args.month, d).getTime();
	return {
		date: d,
		day,
		month,
		timestamp,
		dayString: daysMap[day],
	};
};

export const getMonthDetails = (year: number, month: number) => {
	//
	const firstDay = new Date(year, month).getDay();
	const numberOfDays = getNumberOfDays(year, month);
	const monthArray = [];
	const rows = 6;
	let currentDay = null;
	let index = 0;
	const cols = 7;

	for (let row = 0; row < rows; row += 1) {
		for (let col = 0; col < cols; col += 1) {
			currentDay = getDayDetails({
				index,
				numberOfDays,
				firstDay,
				year,
				month,
			});
			monthArray.push(currentDay);
			index += 1;
		}
	}
	return monthArray;
};

export const getDateFromDateString = (dateValue: string) => {
	const dateData = dateValue.split('-').map(d => parseInt(d, 10));
	if (dateData.length < 3) return null;

	const year = dateData[0];
	const month = dateData[1];
	const date = dateData[2];
	return { year, month, date };
};

export const getMonthStr = (month: number) => monthMap[Math.max(Math.min(11, month), 0)] || 'Month';
