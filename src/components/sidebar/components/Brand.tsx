import React from 'react';

// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';

export const SidebarBrand: React.FC = () => {
	//   Chakra color mode
	const logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex pl="35px" direction="column">
			{/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
			<Text color={logoColor} fontWeight={700} h="70px" fontSize={45}>
				NovaID
			</Text>
			<HSeparator mb="20px" />
		</Flex>
	);
};

export default SidebarBrand;
