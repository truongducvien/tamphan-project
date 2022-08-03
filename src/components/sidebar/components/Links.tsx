/* eslint-disable */
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { Route as RootRoute } from 'routes';

export interface Route extends RootRoute {
	category?: boolean;
	items?: Route[];
}

export interface Props {
	routes: Route[];
}

export const SidebarLinks: React.FC<Props> = props => {
	//   Chakra color mode
	let location = useLocation();
	let activeColor = useColorModeValue('gray.700', 'white');
	let inactiveColor = useColorModeValue('secondaryGray.600', 'secondaryGray.600');
	let activeIcon = useColorModeValue('brand.500', 'white');
	let textColor = useColorModeValue('secondaryGray.500', 'white');
	let brandColor = useColorModeValue('brand.500', 'brand.400');

	const { routes } = props;

	// verifies if routeName is the one active (in browser input)
	const activeRoute = (routeName: string) => {
		return location.pathname.includes('/admin' + routeName);
	};

	// this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
	const createLinks = (r: Route[]) => {
		const element: React.ReactElement[] = r.map((route, index) => {
			if (route.category) {
				return (
					<>
						<Text
							fontSize={'md'}
							color={activeColor}
							fontWeight="bold"
							mx="auto"
							ps={{
								sm: '10px',
								xl: '16px',
							}}
							pt="18px"
							pb="12px"
							key={index.toString()}
						>
							{route.name}
						</Text>
						{route?.items && createLinks(route.items)}
					</>
				);
			} else if (route.icon) {
				return (
					<NavLink key={index.toString()} to={route.layout + route.path}>
						<Box>
							<HStack spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'} py="5px" ps="10px">
								<Flex w="100%" alignItems="center" justifyContent="center">
									<Box color={activeRoute(route.path.toLowerCase()) ? activeIcon : textColor} me="18px">
										{route.icon}
									</Box>
									<Text
										me="auto"
										color={activeRoute(route.path.toLowerCase()) ? activeColor : textColor}
										fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
									>
										{route.name}
									</Text>
								</Flex>
								<Box
									h="36px"
									w="4px"
									bg={activeRoute(route.path.toLowerCase()) ? brandColor : 'transparent'}
									borderRadius="5px"
								/>
							</HStack>
							{route?.items && createLinks(route.items)}
						</Box>
					</NavLink>
				);
			} else if (route.isShow) {
				return (
					<NavLink key={index.toString()} to={route.layout + route.path}>
						<Box ml={10}>
							<HStack spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'} py="5px" ps="10px">
								<Text
									me="auto"
									color={activeRoute(route.path.toLowerCase()) ? activeColor : inactiveColor}
									fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
								>
									{route.name}
								</Text>
								{activeRoute(route.path.toLowerCase()) && <Box h="22px" w="4px" bg="brand.400" borderRadius="5px" />}
							</HStack>
						</Box>
					</NavLink>
				);
			} else return <></>;
		});
		return element;
	};
	//  BRAND
	return <>{createLinks(routes)}</>;
};

export default SidebarLinks;
