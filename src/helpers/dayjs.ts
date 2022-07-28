import * as dayjsModule from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import toObject from 'dayjs/plugin/toObject';

type DateFormatOptions = {
	type: 'export' | 'dateTime' | 'dateTimeFormat' | 'time' | 'birthDay' | 'timeToTime';
	emptySymbol?: string;
	use24h?: boolean;
};

const dayjs = dayjsModule.default;
dayjs.extend(toObject);
dayjs.extend(isSameOrAfter);

export const isDifferenceDateTimes = (one: Date, two: Date) => !!dayjs(one).diff(two);

export const createDateWithoutTime = (date: Date) => new Date(date).setHours(0, 0, 0, 0);

export const formatDate = (firstDate?: Date | string, options?: DateFormatOptions, secondDate?: Date | string) => {
	const { type, emptySymbol, use24h } = options || {};

	if (!firstDate) return emptySymbol;

	const timeFormat = use24h ? 'HH:mm' : 'hh:mm';

	switch (type) {
		case 'export':
			return dayjs(firstDate).format('YYYY-MM-DD');
		case 'dateTimeFormat':
			return dayjs(firstDate).format(`DD/MM/YYYY | ${timeFormat}`);
		case 'dateTime':
			return dayjs(firstDate).format(`DD/MM/YYYY`);
		case 'time':
			return dayjs(firstDate).format(`${timeFormat}`);
		case 'timeToTime':
			return `${dayjs(firstDate).format(timeFormat)} - ${dayjs(secondDate).format(timeFormat)}`;
		case 'birthDay':
			return dayjs().diff(dayjs(firstDate), 'y').toString();
		default:
			return dayjs(firstDate).format('DD/MM/YYYY');
	}
};

export default dayjs;
