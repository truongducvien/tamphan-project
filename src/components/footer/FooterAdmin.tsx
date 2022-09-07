/*eslint-disable*/
import React from 'react';
import { Flex, Link, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react';

const Footer: React.FC = () => {
	const textColor = useColorModeValue('gray.400', 'white');
	return (
		<Flex
			zIndex="3"
			flexDirection={{
				base: 'column',
				md: 'row',
			}}
			alignItems={{
				base: 'center',
				md: 'end',
			}}
			justifyContent="flex-end"
			px={{ base: '30px', md: '50px' }}
			pb="30px"
		>
			<Text
				color={textColor}
				textAlign={{
					base: 'center',
					xl: 'start',
				}}
				mb={{ base: '20px', xl: '0px' }}
			>
				&copy; 2022
				<Text fontSize="sm" as="span" fontWeight="500" ms="4px">
					NovaID
				</Text>
			</Text>
		</Flex>
	);
};

export default Footer;
