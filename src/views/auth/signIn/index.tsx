import React, { useRef, useState } from 'react';

// Chakra imports
import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Icon,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { NavLink, Redirect } from 'react-router-dom';
import illustration from 'src/assets/img/auth/auth.png';
import { HSeparator } from 'src/components/separator/Separator';
import DefaultAuth from 'src/layouts/auth/Default';
// Assets
import { useAppDispatch, useAppSelector } from 'src/store';
import { userLogin } from 'src/store/actionCreators';

const SignIn: React.FC = () => {
	const textColor = useColorModeValue('navy.700', 'white');
	const textColorSecondary = 'gray.400';
	const textColorBrand = useColorModeValue('brand.500', 'white');
	const brandStars = useColorModeValue('brand.500', 'brand.400');

	const usernameRef = useRef<HTMLInputElement>(null);
	const passRef = useRef<HTMLInputElement>(null);

	const dispatch = useAppDispatch();
	const { logined } = useAppSelector(state => state.user);

	const [errorMessase, setError] = useState({ username: '', password: '' });

	const error = useAppSelector(state => state.error);
	const loading = useAppSelector(state => state.isLoading);

	const handleLogin = () => {
		if (!usernameRef.current?.value.length || usernameRef.current?.value.length < 0) {
			setError(prev => ({ ...prev, username: 'Vui lòng nhập tài khoản' }));
			return;
		}

		if (!passRef.current?.value.length || passRef.current?.value.length < 0) {
			setError(prev => ({ ...prev, password: 'Vui lòng nhập mật khẩu' }));
			return;
		}
		setError({ username: '', password: '' });
		dispatch(userLogin(usernameRef.current?.value || '', passRef.current?.value || '', true));
	};

	const [show, setShow] = React.useState(false);
	const handleClick = () => setShow(!show);

	if (logined) return <Redirect to="/admin" />;
	return (
		<DefaultAuth illustrationBackground={illustration}>
			<Flex
				maxW={{ base: '100%', md: 'max-content' }}
				w="100%"
				mx={{ base: 'auto', lg: '0px' }}
				me="auto"
				h="100%"
				alignItems="center"
				justifyContent="center"
				mb={{ base: '30px', md: '60px' }}
				px={{ base: '25px', md: '0px' }}
				mt={{ base: '40px', md: '14vh' }}
				flexDirection="column"
			>
				<Box me="auto">
					<Heading color={textColor} fontSize="36px" mb="10px">
						Đăng nhập
					</Heading>
				</Box>
				<Flex
					zIndex="2"
					direction="column"
					w={{ base: '100%', md: '420px' }}
					maxW="100%"
					background="transparent"
					borderRadius="15px"
					mx={{ base: 'auto', lg: 'unset' }}
					me="auto"
					mb={{ base: '20px', md: 'auto' }}
				>
					<Flex align="center" mb="25px">
						<HSeparator />
					</Flex>
					<FormControl>
						<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
							Tên đăng nhập<Text color={brandStars}>*</Text>
						</FormLabel>
						<Input
							ref={usernameRef}
							isRequired
							variant="auth"
							borderColor={errorMessase.username ? '#FC8181' : undefined}
							fontSize="sm"
							ms={{ base: '0px', md: '0px' }}
							type="text"
							placeholder="mail@simmmple.com"
							mb="24px"
							fontWeight="500"
							size="lg"
						/>
						<FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
							Mật khẩu<Text color={brandStars}>*</Text>
						</FormLabel>
						<InputGroup size="md">
							<Input
								ref={passRef}
								borderColor={errorMessase.password ? '#FC8181' : undefined}
								isRequired
								fontSize="sm"
								placeholder="Min. 8 characters"
								mb="24px"
								size="lg"
								type={show ? 'text' : 'password'}
								variant="auth"
							/>
							<InputRightElement display="flex" alignItems="center" mt="4px">
								<Icon
									color={textColorSecondary}
									_hover={{ cursor: 'pointer' }}
									as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
									onClick={handleClick}
								/>
							</InputRightElement>
						</InputGroup>
						<Text pb={3} textAlign="center" fontWeight="bold" fontSize="sm" color="red.600">
							{errorMessase.password || errorMessase.username || (error['users/LOGIN'] as string)}
						</Text>
						<Flex justify="end" mb="24px">
							<NavLink to="/auth/forgot-password">
								<Text color={textColorBrand} fontSize="sm" w="124px" fontWeight="500">
									Quên mật khẩu?
								</Text>
							</NavLink>
						</Flex>
						<Button
							onClick={handleLogin}
							isLoading={loading['users/LOGIN']}
							loadingText="Loading"
							fontSize="sm"
							variant="brand"
							fontWeight="500"
							w="100%"
							h="50"
							mb="24px"
						>
							Đăng nhập
						</Button>
					</FormControl>
				</Flex>
			</Flex>
		</DefaultAuth>
	);
};

export default SignIn;
