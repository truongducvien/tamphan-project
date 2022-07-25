import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const sliderStyles = {
	components: {
		RangeSlider: {
			// baseStyle: {
			//   thumb: {
			//     fontWeight: 400,
			//   },
			//   track: {
			//     display: "flex",
			//   },
			// },

			variants: {
				main: (props: StyleFunctionProps | Dict<string>) => ({
					thumb: {
						bg: mode('brand.500', 'brand.400')(props),
					},
				}),
			},
		},
	},
};
