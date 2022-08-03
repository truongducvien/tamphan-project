import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

const Card = {
	baseStyle: (props: StyleFunctionProps | Dict<string>) => ({
		p: '20px',
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		position: 'relative',
		borderRadius: '20px',
		minWidth: '0px',
		wordWrap: 'break-word',
		bg: mode('white', 'navy.800')(props),
		backgroundClip: 'border-box',
	}),
};

export const CardComponent = {
	components: {
		Card,
	},
};
