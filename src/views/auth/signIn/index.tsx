import React, { useRef, useState } from 'react';

// Chakra imports
import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormErrorMessage,
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
import illustration from 'assets/img/auth/auth.png';
import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/Default';
// Assets
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { userLogin } from 'store/actionCreators';

const SignIn: React.FC = () => {
	const textColor = useColorModeValue('navy.700', 'white');
	const textColorSecondary = 'gray.400';
	const textColorBrand = useColorModeValue('brand.500', 'white');
	const brandStars = useColorModeValue('brand.500', 'brand.400');

	const usernameRef = useRef<HTMLInputElement>(null);
	const passRef = useRef<HTMLInputElement>(null);
	const checkboxRef = useRef<HTMLInputElement>(null);

	const dispatch = useAppDispatch();

	const [errorMessase, setError] = useState({ username: '', password: '' });

	const error = useAppSelector(state => state.error);
	const loading = useAppSelector(state => state.isLoading);

	const handleLogin = () => {
		if (!usernameRef.current?.value.length || usernameRef.current?.value.length < 4) {
			setError(prev => ({ ...prev, username: 'Username is incorrect' }));
			return;
		}

		if (!passRef.current?.value.length || passRef.current?.value.length < 6) {
			setError(prev => ({ ...prev, password: 'Password is incorrect' }));
			return;
		}
		setError({ username: '', password: '' });
		dispatch(userLogin(usernameRef.current?.value || '', passRef.current?.value || '', checkboxRef.current?.checked));
	};

	const [show, setShow] = React.useState(false);
	const handleClick = () => setShow(!show);

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
						Sign In
					</Heading>
					<Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
						Enter your email and password to sign in!
					</Text>
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
					{/* <Button
						fontSize="sm"
						me="0px"
						mb="26px"
						py="15px"
						h="50px"
						borderRadius="16px"
						bg={googleBg}
						color={googleText}
						fontWeight="500"
						_hover={googleHover}
						_active={googleActive}
						_focus={googleActive}
					>
						<Icon as={FcGoogle} w="20px" h="20px" me="10px" />
						Sign in with Google
					</Button> */}
					<Flex align="center" mb="25px">
						<HSeparator />
					</Flex>
					<FormControl>
						<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
							Username<Text color={brandStars}>*</Text>
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
							Password<Text color={brandStars}>*</Text>
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
						<Flex justifyContent="space-between" align="center" mb="24px">
							<FormControl display="flex" alignItems="center">
								<Checkbox ref={checkboxRef} id="remember-login" colorScheme="brandScheme" me="10px" />
								<FormLabel htmlFor="remember-login" mb="0" fontWeight="normal" color={textColor} fontSize="sm">
									Keep me logged in
								</FormLabel>
							</FormControl>
							<NavLink to="/auth/forgot-password">
								<Text color={textColorBrand} fontSize="sm" w="124px" fontWeight="500">
									Forgot password?
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
							Sign In
						</Button>
					</FormControl>
					{/* <Flex flexDirection="column" justifyContent="center" alignItems="start" maxW="100%" mt="0px">
						<Text color={textColorDetails} fontWeight="400" fontSize="14px">
							Not registered yet?
							<NavLink to="/auth/sign-up">
								<Text color={textColorBrand} as="span" ms="5px" fontWeight="500">
									Create an Account
								</Text>
							</NavLink>
						</Text>
					</Flex> */}
				</Flex>
			</Flex>
		</DefaultAuth>
	);
};

export default SignIn;
