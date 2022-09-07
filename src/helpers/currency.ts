export const currency = (price: number, cur?: string) => {
	return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ${cur || ''}`;
};
