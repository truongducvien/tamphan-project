import React from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { IconButton, Input, InputGroup, InputGroupProps, InputLeftElement, useColorModeValue } from '@chakra-ui/react';

export interface Props extends InputGroupProps {
	variant?: string;
	background?: string;
	children?: React.ReactNode;
	placeholder?: string;
	borderRadius?: string;
}

const SearchBar: React.FC<Props> = props => {
	// Pass the computed styles into the `__css` prop
	const { variant, background, children, placeholder, borderRadius, ...rest } = props;
	// Chakra Color Mode
	const searchIconColor = useColorModeValue('gray.700', 'white');
	const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
	const inputText = useColorModeValue('gray.700', 'gray.100');
	return (
		<InputGroup w={{ base: '100%', md: '200px' }} {...rest}>
			<InputLeftElement>
				<IconButton
					bg={inputBg}
					aria-label="Seacrch"
					_active={{
						bg: 'inherit',
						transform: 'none',
						borderColor: 'transparent',
					}}
					_focus={{
						boxShadow: 'none',
					}}
					icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
				/>
			</InputLeftElement>
			<Input
				variant="search"
				fontSize="sm"
				bg={background || inputBg}
				color={inputText}
				fontWeight="500"
				_placeholder={{ color: 'gray.400', fontSize: '14px' }}
				borderRadius={borderRadius || '30px'}
				placeholder={placeholder || 'Tìm kiếm...'}
			/>
		</InputGroup>
	);
};

export default SearchBar;
