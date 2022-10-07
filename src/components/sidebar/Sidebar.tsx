import React, { useContext } from 'react';

// chakra imports
import {
	Box,
	Flex,
	Drawer,
	DrawerBody,
	Icon,
	useColorModeValue,
	DrawerOverlay,
	useDisclosure,
	DrawerContent,
	DrawerCloseButton,
	keyframes,
} from '@chakra-ui/react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { IoMenuOutline } from 'react-icons/io5';
import { renderThumb, renderTrack, renderView } from 'src/components/scrollbar/Scrollbar';
import Content, { Props as ContentProps } from 'src/components/sidebar/components/Content';
import { SidebarContext } from 'src/contexts/SidebarContext';

export interface Props extends ContentProps {
	logo?: React.ReactNode;
	logoText?: string;
	secondary?: boolean;
	display?: string;
}

const Sidebar: React.FC<Props> = props => {
	const { routes } = props;

	const variantChange = '0.2s linear';
	const sidebarBg = useColorModeValue('white', 'navy.800');
	const sidebarMargins = '0px';
	const { toggleSidebar } = useContext(SidebarContext);

	// const animation = `${animationKey} 2s ease-in-out`;

	return (
		<Box
			position="fixed"
			minH="100%"
			zIndex="docked"
			width={{ base: '0px', xl: toggleSidebar ? '300px' : '0px' }}
			transitionDuration=".6s"
			transitionProperty="width"
			transitionTimingFunction="ease-in-out"
			overflowX="hidden"
		>
			<Box bg={sidebarBg} transition={variantChange} w="300px" h="100vh" m={sidebarMargins} minH="100%">
				<Scrollbars
					autoHide
					renderTrackVertical={renderTrack}
					renderThumbVertical={renderThumb}
					renderView={renderView}
				>
					<Content routes={routes} />
				</Scrollbars>
			</Box>
		</Box>
	);
};

// FUNCTIONS
export const SidebarResponsive: React.FC<Props> = props => {
	const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
	const menuColor = useColorModeValue('gray.400', 'white');
	// // SIDEBAR
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef<HTMLDivElement>(null);

	const { routes } = props;

	return (
		<Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
			<Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
				<Icon
					as={IoMenuOutline}
					color={menuColor}
					my="auto"
					w="30px"
					h="30px"
					me="10px"
					_hover={{ cursor: 'pointer' }}
				/>
			</Flex>
			<Drawer
				isOpen={isOpen}
				onClose={onClose}
				placement={document.documentElement.dir === 'rtl' ? 'right' : 'left'}
				finalFocusRef={btnRef}
			>
				<DrawerOverlay />
				<DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
					<DrawerCloseButton zIndex="3" _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
					<DrawerBody maxW="285px" px="0rem" pb="0">
						<Content routes={routes} />
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Flex>
	);
};
// PROPS

export default Sidebar;
