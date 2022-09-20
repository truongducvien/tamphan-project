// Chakra Imports
import React from 'react';

import {
	Avatar,
	Button,
	Flex,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorModeValue,
	useColorMode,
	Center,
} from '@chakra-ui/react';
import { FaEthereum } from 'react-icons/fa';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { MdNotificationsNone } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store';
import { logout } from 'src/store/actionCreators';

export interface Props {
	variant?: string;
	fixed?: boolean;
	secondary?: boolean;
	onOpen?(): void;
	logoText?: string;
	scrolled?: boolean;
}

const HeaderLinks: React.FC<Props> = props => {
	const dispatch = useAppDispatch();
	const { info } = useAppSelector(state => state.user);
	const { secondary } = props;
	const { colorMode, toggleColorMode } = useColorMode();
	// Chakra Color Mode
	const navbarIcon = useColorModeValue('gray.400', 'white');
	const menuBg = useColorModeValue('white', 'navy.800');
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorBrand = useColorModeValue('brand.700', 'brand.400');
	const ethColor = useColorModeValue('gray.700', 'white');
	const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
	const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
	const ethBox = useColorModeValue('white', 'navy.800');
	const shadow = useColorModeValue(
		'14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
		'14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
	);
	return (
		<Flex
			w={{ sm: '100%', md: 'auto' }}
			alignItems="center"
			flexDirection="row"
			flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
			p="5px"
		>
			{/* <SearchBar mb={secondary ? { base: '10px', md: 'unset' } : 'unset'} me="10px" /> */}
			<Flex
				bg={ethBg}
				display={secondary ? 'flex' : 'none'}
				borderRadius="30px"
				ms="auto"
				p="6px"
				align="center"
				me="6px"
			>
				<Flex align="center" justify="center" bg={ethBox} h="29px" w="29px" borderRadius="30px" me="7px">
					<Icon color={ethColor} w="9px" h="14px" as={FaEthereum} />
				</Flex>
				<Text w="max-content" color={ethColor} fontSize="sm" fontWeight="700" me="6px">
					1,924
					<Text as="span" display={{ base: 'none', md: 'unset' }}>
						{' '}
						ETH
					</Text>
				</Text>
			</Flex>
			<Menu>
				<MenuButton p="0px">
					<Icon mt="6px" as={MdNotificationsNone} color={navbarIcon} w="18px" h="18px" me="10px" />
				</MenuButton>
				<MenuList
					boxShadow={shadow}
					p="20px"
					borderRadius="20px"
					bg={menuBg}
					border="none"
					mt="22px"
					me={{ base: '30px', md: 'unset' }}
					minW={{ base: 'unset', md: '400px', xl: '450px' }}
					maxW={{ base: '360px', md: 'unset' }}
				>
					<Flex justifyItems="space-between" w="100%" mb="20px">
						<Text fontSize="md" fontWeight="600" color={textColor}>
							Thông báo
						</Text>
						<Text fontSize="sm" fontWeight="500" color={textColorBrand} ms="auto" cursor="pointer">
							Đọc tất cả
						</Text>
					</Flex>
					<Flex flexDirection="column">
						<MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} px="0" borderRadius="8px" mb="10px">
							<Center w="100%">
								<Text textAlign="center" fontSize="sm">
									Không có dữ liệu
								</Text>
							</Center>
						</MenuItem>
					</Flex>
				</MenuList>
			</Menu>
			<Button
				variant="no-hover"
				bg="transparent"
				p="0px"
				minW="unset"
				minH="unset"
				h="18px"
				w="max-content"
				onClick={toggleColorMode}
			>
				<Icon me="10px" h="18px" w="18px" color={navbarIcon} as={colorMode === 'light' ? IoMdMoon : IoMdSunny} />
			</Button>
			<Menu>
				<MenuButton p="0px">
					<Avatar
						_hover={{ cursor: 'pointer' }}
						color="white"
						name="Adela Parkson"
						bg="#11047A"
						size="sm"
						w="40px"
						h="40px"
					/>
				</MenuButton>
				<MenuList boxShadow={shadow} p="0px" mt="10px" borderRadius="20px" bg={menuBg} border="none">
					<Flex w="100%" mb="0px">
						<Text
							ps="20px"
							pt="16px"
							pb="10px"
							w="100%"
							borderBottom="1px solid"
							borderColor={borderColor}
							fontSize="sm"
							fontWeight="700"
							color={textColor}
						>
							👋&nbsp; {info?.fullName || 'Admin'}
						</Text>
					</Flex>
					<Flex flexDirection="column" p="10px">
						<MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} borderRadius="8px" px="14px">
							<Link to="/auth/change-password">
								<Text fontSize="sm">Đổi mật khẩu</Text>
							</Link>
						</MenuItem>
						{/* <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} borderRadius="8px" px="14px">
							<Text fontSize="sm">Cài đặt</Text>
						</MenuItem> */}
						<MenuItem
							_hover={{ bg: 'none' }}
							_focus={{ bg: 'none' }}
							color="red.400"
							onClick={() => dispatch(logout())}
							borderRadius="8px"
							px="14px"
						>
							<Text fontSize="sm">Đăng xuất</Text>
						</MenuItem>
					</Flex>
				</MenuList>
			</Menu>
		</Flex>
	);
};

export default HeaderLinks;
