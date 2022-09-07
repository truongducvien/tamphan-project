/*eslint-disable*/
import React from 'react';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

const Footer: React.FC = () => {
	const textColor = useColorModeValue('gray.400', 'white');
	const linkColor = useColorModeValue({ base: 'gray.400', lg: 'white' }, 'white');
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
					md: 'start',
				}}
				mb={{ base: '20px', lg: '0px' }}
			>
				&copy; 2022
				<Text as="span" fontWeight="500" ms="4px">
					NOVAID
				</Text>
			</Text>
		</Flex>
	);
};

export default Footer;
