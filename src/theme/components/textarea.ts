import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const textareaStyles = {
	components: {
		Textarea: {
			baseStyle: {
				field: {
					fontWeight: 400,
					borderRadius: '8px',
				},
			},

			variants: {
				admin: (props: StyleFunctionProps | Dict<string>) => ({
					bg: mode('white', 'navy.900')(props),
					border: '1px solid',
					color: mode('secondaryGray.900', 'white')(props),
					borderColor: mode('secondaryGray.100', 'whiteAlpha.100')(props),
					borderRadius: '16px',
					fontSize: 'sm',
					p: '20px',
					_placeholder: mode('secondaryGray.100', 'whiteAlpha.100')(props),
					_focus: {
						borderColor: mode('blue.300', 'blue.700')(props),
						borderWith: 0,
					},
				}),
				main: (props: StyleFunctionProps | Dict<string>) => ({
					bg: mode('transparent', 'navy.800')(props),
					border: '1px solid !important',
					color: mode('secondaryGray.900', 'white')(props),
					borderColor: mode('secondaryGray.100', 'whiteAlpha.100')(props),
					borderRadius: '16px',
					fontSize: 'sm',
					p: '20px',
					_placeholder: { color: 'secondaryGray.400' },
				}),
				auth: () => ({
					bg: 'white',
					border: '1px solid',
					borderColor: 'secondaryGray.100',
					borderRadius: '16px',
					_placeholder: { color: 'secondaryGray.600' },
				}),
				authSecondary: () => ({
					bg: 'white',
					border: '1px solid',

					borderColor: 'secondaryGray.100',
					borderRadius: '16px',
					_placeholder: { color: 'secondaryGray.600' },
				}),
				search: () => ({
					border: 'none',
					py: '11px',
					borderRadius: 'inherit',
					_placeholder: { color: 'secondaryGray.600' },
				}),
			},
		},
	},
};
