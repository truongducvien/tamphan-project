import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const buttonStyles = {
	components: {
		Button: {
			baseStyle: {
				borderRadius: '16px',
				boxShadow: '45px 76px 113px 7px rgba(112, 144, 176, 0.08)',
				transition: '.25s all ease',
				boxSizing: 'border-box',
				_focus: {
					boxShadow: 'none',
				},
				_active: {
					boxShadow: 'none',
				},
			},
			variants: {
				outline: () => ({
					borderRadius: '16px',
				}),
				brand: (props: StyleFunctionProps | Dict<string>) => ({
					bg: mode('brand.500', 'brand.900')(props),
					color: 'whiteSmoke',
					_focus: {
						bg: mode('brand.500', 'brand.400')(props),
					},
					_active: {
						bg: mode('brand.500', 'brand.400')(props),
					},
					_hover: {
						bg: mode('brand.600', 'brand.400')(props),
					},
				}),
				DELETE: (props: StyleFunctionProps | Dict<string>) => ({
					bg: mode('red.500', 'red.800')(props),
					color: 'whiteSmoke',
					_focus: {
						bg: mode('brand.500', 'brand.400')(props),
					},
					_active: {
						bg: mode('brand.500', 'brand.400')(props),
					},
					_hover: {
						bg: mode('brand.600', 'brand.400')(props),
					},
				}),
				darkBrand: (props: StyleFunctionProps | Dict<string>) => ({
					bg: mode('brand.900', 'brand.400')(props),
					color: 'whiteSmoke',
					_focus: {
						bg: mode('brand.900', 'brand.400')(props),
					},
					_active: {
						bg: mode('brand.900', 'brand.400')(props),
					},
					_hover: {
						bg: mode('brand.800', 'brand.400')(props),
					},
				}),
				gray: (props: StyleFunctionProps | Dict<string>) => ({
					bg: mode('gray.400', 'gray.700')(props),
					color: 'whiteSmoke',
					_focus: {
						bg: mode('gray.500', 'gray.500')(props),
					},
					_active: {
						bg: mode('gray.500', 'gray.500')(props),
					},
					_hover: {
						bg: mode('gray.500', 'gray.500')(props),
					},
				}),
				lightBrand: (props: StyleFunctionProps | Dict<string>) => ({
					bg: mode('#F2EFFF', 'whiteAlpha.100')(props),
					color: mode('brand.500', 'white')(props),
					_focus: {
						bg: mode('#F2EFFF', 'whiteAlpha.100')(props),
					},
					_active: {
						bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
					},
					_hover: {
						bg: mode('secondaryGray.400', 'whiteAlpha.200')(props),
					},
				}),
				light: (props: StyleFunctionProps | Dict<string>) => ({
					bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
					color: mode('secondaryGray.900', 'white')(props),
					_focus: {
						bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
					},
					_active: {
						bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
					},
					_hover: {
						bg: mode('secondaryGray.400', 'whiteAlpha.200')(props),
					},
				}),
				action: (props: StyleFunctionProps | Dict<string>) => ({
					fontWeight: '500',
					borderRadius: '50px',
					bg: mode('secondaryGray.300', 'brand.400')(props),
					color: mode('brand.500', 'white')(props),
					_focus: {
						bg: mode('secondaryGray.300', 'brand.400')(props),
					},
					_active: { bg: mode('secondaryGray.300', 'brand.400')(props) },
					_hover: {
						bg: mode('secondaryGray.200', 'brand.400')(props),
					},
				}),
				setup: (props: StyleFunctionProps | Dict<string>) => ({
					fontWeight: '500',
					borderRadius: '50px',
					bg: mode('transparent', 'brand.400')(props),
					border: mode('1px solid', '0px solid')(props),
					borderColor: mode('secondaryGray.400', 'transparent')(props),
					color: mode('secondaryGray.900', 'white')(props),
					_focus: {
						bg: mode('transparent', 'brand.400')(props),
					},
					_active: { bg: mode('transparent', 'brand.400')(props) },
					_hover: {
						bg: mode('secondaryGray.100', 'brand.400')(props),
					},
				}),
			},
		},
	},
};
