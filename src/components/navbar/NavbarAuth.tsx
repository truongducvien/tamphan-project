import React from 'react';

// Chakra imports
import {
	Box,
	Button,
	Flex,
	Grid,
	HStack,
	Icon,
	Link,
	Menu,
	MenuList,
	Stack,
	Text,
	useColorModeValue,
	useColorMode,
	useDisclosure,
	SimpleGrid,
} from '@chakra-ui/react';
import { GoChevronDown, GoChevronRight } from 'react-icons/go';
import { NavLink } from 'react-router-dom';
import IconBox from 'src/components/icons/IconBox';
import { HorizonLogo } from 'src/components/icons/Icons';
import { SidebarResponsive, Props as SidebarResponsiveProps } from 'src/components/sidebar/Sidebar';
import { SidebarContext } from 'src/contexts/SidebarContext';
import routes, { Route } from 'src/routes';

export interface Props extends SidebarResponsiveProps {
	logo: string;
	logoText: string;
	secondary?: boolean;
	sidebarWidth: string;
}

export const AuthNavbar: React.FC<Props> = ({ logoText, secondary, sidebarWidth, ...rest }) => {
	const { colorMode } = useColorMode();
	// Menu States
	const { isOpen: isOpenAuth, onOpen: onOpenAuth, onClose: onCloseAuth } = useDisclosure();
	const { isOpen: isOpenDashboards, onOpen: onOpenDashboards, onClose: onCloseDashboards } = useDisclosure();
	const { isOpen: isOpenMain, onOpen: onOpenMain, onClose: onCloseMain } = useDisclosure();
	const { isOpen: isOpenNft, onOpen: onOpenNft, onClose: onCloseNft } = useDisclosure();
	// Menus
	function getLinks(routeName: string) {
		const foundRoute = routes.filter(route => {
			return route.items && route.name === routeName;
		});
		return foundRoute[0].items;
	}
	function getLinksCollapse(routeName: string) {
		const foundRoute = routes.filter(route => {
			return route.items && route.name === routeName;
		});

		const foundLinks = foundRoute?.[0]?.items?.filter(link => {
			return link.collapse === true;
		});

		return foundLinks;
	}
	const authObject = getLinksCollapse('Authentication');
	const mainObject = getLinksCollapse('Main Pages');
	const dashboardsObject = getLinks('Dashboards');
	const nftsObject = getLinks('NFTs');
	const logoColor = useColorModeValue('white', 'white');
	// Chakra color mode

	const textColor = useColorModeValue('navy.700', 'white');
	const menuBg = useColorModeValue('white', 'navy.900');
	const mainText = '#fff';
	const navbarBg = 'none';
	const navbarShadow = 'initial';
	const bgButton = 'white';
	const colorButton = 'brand.500';
	const navbarPosition = 'absolute';

	let brand = (
		<Link
			href={`${process.env.PUBLIC_URL}/#/`}
			target="_blank"
			display="flex"
			lineHeight="100%"
			fontWeight="bold"
			justifyContent="center"
			alignItems="center"
			color={mainText}
		>
			<Stack direction="row" spacing="12px" align="center" justify="center">
				<HorizonLogo h="26px" w="175px" color={logoColor} />
			</Stack>
			<Text fontSize="sm" mt="3px">
				{logoText}
			</Text>
		</Link>
	);
	if (secondary === true) {
		brand = (
			<Link
				minW="175px"
				href={`${process.env.PUBLIC_URL}/#/`}
				target="_blank"
				display="flex"
				lineHeight="100%"
				fontWeight="bold"
				justifyContent="center"
				alignItems="center"
				color={mainText}
			>
				<HorizonLogo h="26px" w="175px" my="32px" color={logoColor} />
			</Link>
		);
	}
	const createNftsLinks = (r: Route[]) => {
		return r.map((link, key) => {
			return (
				<NavLink key={key} to={link.layout + link.path} style={{ maxWidth: 'max-content', marginLeft: '40px' }}>
					<Text color="gray.400" fontSize="sm" fontWeight="normal">
						{link.name}
					</Text>
				</NavLink>
			);
		});
	};
	const createDashboardsLinks = (r: Route[]) => {
		return r.map((link, key) => {
			return (
				<NavLink key={key} to={link.layout + link.path} style={{ maxWidth: 'max-content', marginLeft: '40px' }}>
					<Text color="gray.400" fontSize="sm" fontWeight="normal">
						{link.name}
					</Text>
				</NavLink>
			);
		});
	};
	const createMainLinks = (r: Route[]) => {
		return r.map((link, key) => {
			if (link.collapse === true) {
				return (
					<Stack key={key} direction="column" maxW="max-content">
						<Stack direction="row" spacing="0px" align="center" cursor="default">
							<IconBox bg="brand.500" h="30px" w="30px" me="10px">
								{link.icon}
							</IconBox>
							<Text fontWeight="bold" fontSize="md" me="auto" color={textColor}>
								{link.name}
							</Text>
							<Icon as={GoChevronRight} color={mainText} w="14px" h="14px" fontWeight="2000" />
						</Stack>
						{link?.items && (
							<Stack direction="column" bg={menuBg}>
								{createMainLinks(link?.items)}
							</Stack>
						)}
					</Stack>
				);
			}
			return (
				<NavLink key={key} to={link.layout + link.path} style={{ maxWidth: 'max-content', marginLeft: '40px' }}>
					<Text color="gray.400" fontSize="sm" fontWeight="normal">
						{link.name}
					</Text>
				</NavLink>
			);
		});
	};
	const createAuthLinks = (r: Route[]) => {
		return r.map((link, key) => {
			if (link.collapse === true) {
				return (
					<Stack key={key} direction="column" my="auto" maxW="max-content">
						<Stack direction="row" spacing="0px" align="center" cursor="default" w="max-content">
							<IconBox bg="brand.500" h="30px" w="30px" me="10px">
								{link.icon}
							</IconBox>
							<Text fontWeight="bold" fontSize="md" me="auto" color={textColor}>
								{link.name}
							</Text>
							<Icon as={GoChevronRight} color={mainText} w="14px" h="14px" fontWeight="2000" />
						</Stack>
						{link?.items && (
							<Stack direction="column" bg={menuBg}>
								{createAuthLinks(link.items)}
							</Stack>
						)}
					</Stack>
				);
			}
			return (
				<NavLink key={key} to={link.layout + link.path} style={{ maxWidth: 'max-content', marginLeft: '40px' }}>
					<Text color="gray.400" fontSize="sm" fontWeight="normal">
						{link.name}
					</Text>
				</NavLink>
			);
		});
	};
	const linksAuth = (
		<HStack display={{ sm: 'none', lg: 'flex' }} spacing="12px">
			<Stack
				direction="row"
				spacing="4px"
				align="center"
				color="#fff"
				fontWeight="bold"
				onMouseEnter={onOpenDashboards}
				onMouseLeave={onCloseDashboards}
				cursor="pointer"
				position="relative"
			>
				<Text fontSize="sm" color={mainText}>
					Dashboards
				</Text>
				<Box>
					<Icon mt="8px" as={GoChevronDown} color={mainText} w="14px" h="14px" fontWeight="2000" />
				</Box>
				<Menu isOpen={isOpenDashboards}>
					<MenuList
						bg={menuBg}
						p="22px"
						cursor="default"
						borderRadius="15px"
						position="absolute"
						top="30px"
						left="-10px"
					>
						{dashboardsObject && (
							<Flex flexWrap="wrap" w="300px" gap="16px">
								{createDashboardsLinks(dashboardsObject)}
							</Flex>
						)}
					</MenuList>
				</Menu>
			</Stack>
			<Stack
				direction="row"
				spacing="4px"
				align="center"
				color="#fff"
				fontWeight="bold"
				onMouseEnter={onOpenAuth}
				onMouseLeave={onCloseAuth}
				cursor="pointer"
				position="relative"
			>
				<Text fontSize="sm" color={mainText}>
					Authentications
				</Text>
				<Box>
					<Icon mt="8px" as={GoChevronDown} color={mainText} w="14px" h="14px" fontWeight="2000" />
				</Box>
				<Menu isOpen={isOpenAuth}>
					<MenuList
						bg={menuBg}
						p="22px"
						cursor="default"
						borderRadius="15px"
						position="absolute"
						top="30px"
						left="-10px"
					>
						{authObject && (
							<Flex>
								<SimpleGrid column="3" gap="10px" minW="500px" me="20px">
									{createAuthLinks(authObject)}
								</SimpleGrid>
								{/* <Flex
                  bg='red'
                  direction='column'
                  justify='center'
                  align='center'
                  w='stretch'
                  minH='230px'
                  borderRadius='15px'>
                  <IconBox
                    bg='white'
                    color='white'
                    borderRadius='50%'
                    h='50px'
                    w='50px'
                    mb='12px'>
                    <Icon as={AiFillStar} w='25px' h='25px' color='blue.500' />
                  </IconBox>
                  <Text
                    fontSize='xl'
                    fontWeight='bold'
                    color='#fff'
                    maxW='80%'
                    textAlign='center'>
                    Explore our utilities pages
                  </Text>
                </Flex> */}
							</Flex>
						)}
					</MenuList>
				</Menu>
			</Stack>
			<Stack
				direction="row"
				spacing="4px"
				align="center"
				color="#fff"
				fontWeight="bold"
				onMouseEnter={onOpenMain}
				onMouseLeave={onCloseMain}
				cursor="pointer"
				position="relative"
			>
				<Text fontSize="sm" color={mainText}>
					Main Pages
				</Text>
				<Box>
					<Icon mt="8px" as={GoChevronDown} color={mainText} w="14px" h="14px" fontWeight="2000" />
				</Box>
				<Menu isOpen={isOpenMain}>
					<MenuList
						bg={menuBg}
						p="22px"
						cursor="default"
						borderRadius="15px"
						position="absolute"
						top="30px"
						left="-10px"
					>
						{mainObject && (
							<Flex flexWrap="wrap" align="start" w="500px" gap="16px">
								{createMainLinks(mainObject)}
							</Flex>
						)}
					</MenuList>
				</Menu>
			</Stack>
			<Stack
				direction="row"
				spacing="4px"
				align="center"
				color="#fff"
				fontWeight="bold"
				onMouseEnter={onOpenNft}
				onMouseLeave={onCloseNft}
				cursor="pointer"
				position="relative"
			>
				<Text fontSize="sm" color={mainText}>
					NFTs
				</Text>
				<Box>
					<Icon mt="8px" as={GoChevronDown} color={mainText} w="14px" h="14px" fontWeight="2000" />
				</Box>
				<Menu isOpen={isOpenNft}>
					<MenuList
						bg={menuBg}
						p="22px"
						minW="350px"
						cursor="default"
						borderRadius="15px"
						position="absolute"
						top="30px"
						left="-10px"
					>
						{nftsObject && (
							<Grid templateColumns="repeat(2, 1fr)" gap="16px">
								{createNftsLinks(nftsObject)}
							</Grid>
						)}
					</MenuList>
				</Menu>
			</Stack>
		</HStack>
	);

	return (
		// eslint-disable-next-line react/jsx-no-constructed-context-values
		<SidebarContext.Provider value={{ sidebarWidth }}>
			<Flex
				position={navbarPosition}
				top="16px"
				left="50%"
				transform="translate(-50%, 0px)"
				background={navbarBg}
				boxShadow={navbarShadow}
				borderRadius="15px"
				px="16px"
				py="22px"
				mx="auto"
				width="1044px"
				maxW="90%"
				alignItems="center"
				zIndex="3"
			>
				<Flex w="100%" justifyContent={{ sm: 'start', lg: 'space-between' }}>
					{brand}
					<Box
						ms={{ base: 'auto', lg: '0px' }}
						display={{ base: 'flex', lg: 'none' }}
						justifyContent="center"
						alignItems="center"
					>
						<SidebarResponsive
							logoText={logoText}
							secondary={secondary}
							{...rest}
							logo={
								<Stack direction="row" spacing="12px" align="center" justify="center">
									<Box w="1px" h="20px" bg={colorMode === 'dark' ? 'white' : 'gray.700'} />
								</Stack>
							}
							routes={routes}
						/>
					</Box>
					{linksAuth}
					<Link href="https://www.horizon-ui.com/pro">
						<Button
							bg={bgButton}
							color={colorButton}
							fontSize="xs"
							variant="no-effects"
							borderRadius="50px"
							px="45px"
							display={{
								sm: 'none',
								lg: 'flex',
							}}
						>
							Buy Now
						</Button>
					</Link>
				</Flex>
			</Flex>
		</SidebarContext.Provider>
	);
};
