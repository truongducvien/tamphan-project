import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const headingStyles = {
	components: {
		Heading: {
			variants: {
				admin: (props: StyleFunctionProps | Dict<string>) => ({
					color: mode('gray.800', 'gray.200')(props),
				}),
			},
		},
	},
};
