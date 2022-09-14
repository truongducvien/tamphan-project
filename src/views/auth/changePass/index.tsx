import React, { useRef, useState } from 'react';

// Chakra imports
import {
	Box,
	Button,
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
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
} from '@chakra-ui/react';
// Custom components
import { useMutation } from '@tanstack/react-query';
import illustration from 'assets/img/auth/auth.png';
import { AxiosError } from 'axios';
import { alert } from 'components/alertDialog/hook';
import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/Default';
// Assets
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useHistory } from 'react-router-dom';
import { BaseResponseAction } from 'services/type';
import { userForgotPass, userResetPass, userVerifyToken } from 'services/user';

export const ChangePass: React.FC = () => {
	const [step, setStep] = useState(0);
	const [otpToken, setOtp] = useState('');

	const history = useHistory();
	const textColor = useColorModeValue('navy.700', 'white');
	const textColorSecondary = 'gray.400';
	const brandStars = useColorModeValue('brand.500', 'brand.400');

	const usernameRef = useRef<HTMLInputElement>(null);
	const passRef = useRef<HTMLInputElement>(null);
	const rePassRef = useRef<HTMLInputElement>(null);
	const otpRef = useRef<HTMLInputElement>(null);

	const [errorMessage, setError] = useState({ username: '', password: '', otp: '' });

	const { mutateAsync: mutationVerify, isLoading: sendingToken } = useMutation(userVerifyToken);
	const { mutateAsync: mutationResetPass, isLoading: reseting } = useMutation(userResetPass);

	const handleVerifyToken = async () => {
		const token = otpRef.current?.value;
		if (!token || token?.length < 4) {
			setError({
				username: '',
				password: 'Sai mã xác thực',
				otp: '',
			});
			return;
		}
		try {
			const { data } = await mutationVerify(token);
			setStep(1);
			setOtp(data?.otpToken || '');
		} catch (err) {
			const errResponse = err as AxiosError<BaseResponseAction>;
			if (errResponse?.response?.data?.code === 'NOT_FOUND_OTP_TOKEN')
				setError({ password: 'Sai mã xác nhận, thử lại sau', username: '', otp: '' });
			else setError({ password: 'Có lỗi xảy ra, thử lại sau', username: '', otp: '' });
		}
	};

	const handleResetpass = async () => {
		const password = passRef.current?.value;
		const rePassword = rePassRef.current?.value;
		const reg = /^(?=.*\d)(?=(.*\W){2})(?=.*[a-zA-Z])(?!.*\s).{6,}$/;
		if (!reg.test(password || '')) {
			setError({
				username: '',
				password: 'Mật khẩu tối thiểu 7 kí tự, ít nhất 1 chữ in và 1 chữ thường và 1 kí tự đặc biệt',
				otp: '',
			});
			return;
		}
		if (password !== rePassword) {
			setError({
				username: '',
				password: 'Mật khẩu chưa giống nhau',
				otp: '',
			});
			return;
		}

		setError({ username: '', password: '', otp: '' });
		try {
			await mutationResetPass({ newPassword: password || '', otpToken });
			await alert({ title: 'Đổi mật khẩu thành công!', type: 'message' });
			history.replace('/auth/sign-in');
		} catch (err) {
			const errResponse = err as AxiosError<BaseResponseAction>;
			if (errResponse?.response?.data?.code === 'NOT_FOUND_OTP_TOKEN')
				setError({ password: 'Sai mã xác nhận, thử lại sau', username: '', otp: '' });
			else setError({ password: 'Có lỗi xảy ra, thử lại sau', username: '', otp: '' });
		}
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
				// justifyContent="center"
				mb={{ base: '30px', md: '60px' }}
				px={{ base: '25px', md: '0px' }}
				mt={{ base: '40px', md: '14vh' }}
				flexDirection="column"
			>
				<Tabs index={step}>
					<TabList hidden>
						<Tab>One</Tab>
						<Tab>Two</Tab>
						<Tab>Three</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
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
								<Box me="auto">
									<Heading color={textColor} fontSize="36px" mb="10px">
										Đổi mật khẩu
									</Heading>
									<Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
										Mật khẩu Tối thiểu 6 kí tự, bao gồm ít nhất 1 chữ in hoa, 1 chữ thường và 1 kí tự đặc biệt!
									</Text>
								</Box>
								<Flex align="center" mb="25px">
									<HSeparator />
								</Flex>
								<FormControl>
									<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
										Mật khẩu cũ<Text color={brandStars}>*</Text>
									</FormLabel>
									<InputGroup size="md">
										<Input
											ref={passRef}
											isRequired
											fontSize="sm"
											placeholder="Nhập lại mật khẩu"
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
									<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
										Mật khẩu mới<Text color={brandStars}>*</Text>
									</FormLabel>
									<InputGroup size="md">
										<Input
											ref={passRef}
											isRequired
											fontSize="sm"
											placeholder="Nhập lại mật khẩu"
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
									<FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
										Nhập lại mật khẩu<Text color={brandStars}>*</Text>
									</FormLabel>
									<Input
										ref={rePassRef}
										isRequired
										fontSize="sm"
										placeholder="Nhập lại mật khẩu"
										mb="24px"
										size="lg"
										type="password"
										variant="auth"
									/>
									<Text pb={3} textAlign="center" fontWeight="bold" fontSize="sm" color="red.600">
										{errorMessage.password}
									</Text>
									<Button
										// eslint-disable-next-line @typescript-eslint/no-misused-promises
										onClick={handleResetpass}
										isLoading={reseting}
										loadingText="Loading"
										fontSize="sm"
										variant="brand"
										fontWeight="500"
										w="100%"
										h="50"
										mb="24px"
									>
										Đổi mật khẩu
									</Button>
								</FormControl>
							</Flex>
						</TabPanel>
						<TabPanel>
							<Box me="auto">
								<Heading color={textColor} fontSize="36px" mb="10px">
									Quên mật khẩu
								</Heading>
								<Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
									Nhập mã xác thực từ email của bạn!
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
								<Flex align="center" mb="25px">
									<HSeparator />
								</Flex>
								<FormControl>
									<FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
										Mã xác thực<Text color={brandStars}>*</Text>
									</FormLabel>
									<Input
										ref={otpRef}
										isRequired
										fontSize="sm"
										placeholder="Nhập mã xác thực"
										mb="24px"
										size="lg"
										type="text"
										variant="auth"
									/>
									<Text pb={3} textAlign="center" fontWeight="bold" fontSize="sm" color="red.600">
										{errorMessage.otp}
									</Text>
									<Button
										// eslint-disable-next-line @typescript-eslint/no-misused-promises
										onClick={handleVerifyToken}
										isLoading={reseting}
										loadingText="Loading"
										fontSize="sm"
										variant="brand"
										fontWeight="500"
										w="100%"
										h="50"
										mb="24px"
									>
										Đổi mật khẩu
									</Button>
								</FormControl>
							</Flex>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Flex>
		</DefaultAuth>
	);
};
