import React, { useContext } from 'react';

import { Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { IoMenuOutline } from 'react-icons/io5';
import { HSeparator } from 'src/components/separator/Separator';
import { SidebarContext } from 'src/contexts/SidebarContext';

export const SidebarBrand: React.FC = () => {
	const logoColor = useColorModeValue('navy.700', 'white');
	const menuColor = useColorModeValue('gray.400', 'white');
	const { toggleSidebar, setToggleSidebar } = useContext(SidebarContext);
	return (
		<Flex align="center" flexDirection="column" justify="center">
			<Flex align="center" justify="center">
				<Text color={logoColor} fontWeight={700} fontSize={45}>
					Aqua City
				</Text>
				<Icon
					display={{ base: 'none', xl: 'block' }}
					onClick={() => setToggleSidebar?.(!toggleSidebar)}
					ml="30px"
					as={IoMenuOutline}
					color={menuColor}
					my="auto"
					w="30px"
					h="30px"
					me="10px"
					_hover={{ cursor: 'pointer' }}
				/>
			</Flex>

			<HSeparator mb="20px" />
		</Flex>
	);
};

export default SidebarBrand;
