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
	IconButton,
} from '@chakra-ui/react';
// Custom components
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FaChevronLeft } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useHistory } from 'react-router-dom';
import illustration from 'src/assets/img/auth/auth.png';
import { alert } from 'src/components/alertDialog/hook';
import { HSeparator } from 'src/components/separator/Separator';
import { useCountdownTimer } from 'src/hooks/useCountdownTimer';
import DefaultAuth from 'src/layouts/auth/Default';
import { BaseResponseAction } from 'src/services/type';
import { userForgotPass, userResetPass, userVerifyToken } from 'src/services/user';

const ResetPassword: React.FC = () => {
	const [step, setStep] = useState(0);
	const [otpToken, setOtp] = useState('');
	const { minutes, seconds, setMinutes, setSeconds, isDown } = useCountdownTimer({});

	const history = useHistory();
	const textColor = useColorModeValue('navy.700', 'white');
	const textColorSecondary = 'gray.400';
	const brandStars = useColorModeValue('brand.500', 'brand.400');

	const usernameRef = useRef<HTMLInputElement>(null);
	const passRef = useRef<HTMLInputElement>(null);
	const rePassRef = useRef<HTMLInputElement>(null);
	const otpRef = useRef<HTMLInputElement>(null);

	const [errorMessage, setError] = useState({ username: '', password: '', otp: '' });

	const { mutateAsync: mutationSentMail, isLoading: sendingMail } = useMutation(userForgotPass);
	const { mutateAsync: mutationVerify, isLoading: sendingToken } = useMutation(userVerifyToken);
	const { mutateAsync: mutationResetPass, isLoading: reseting } = useMutation(userResetPass);

	const handleSendmail = async () => {
		setMinutes(0);
		setSeconds(0);
		const email = usernameRef.current?.value;
		const reg = /^\S+@\S+\.\S+$/;
		if (!email || !reg.test(email)) {
			setError({ username: 'Sai ?????nh d???ng email!', password: '', otp: '' });
			return;
		}
		setError({ username: '', password: '', otp: '' });
		try {
			const { data } = await mutationSentMail(email);
			const m = data?.durationInSeconds ? Math.floor((data.durationInSeconds % 3600) / 60) : 0;
			const s = data?.durationInSeconds ? Math.floor(data.durationInSeconds % 60) : 0;
			setMinutes(m);
			setSeconds(s);
			setStep(1);
		} catch (err) {
			const errResponse = err as AxiosError<BaseResponseAction>;
			if (errResponse?.response?.data?.code === 'INVALID_EMAIL')
				setError({ username: 'Email kh??ng t???n t???i, th??? l???i sau', password: '', otp: '' });
			else setError({ username: 'C?? l???i x???y ra, th??? l???i sau', password: '', otp: '' });
		}
	};

	const handleVerifyToken = async () => {
		const token = otpRef.current?.value;
		if (!token || token?.length < 4) {
			setError({
				username: '',
				otp: 'Sai m?? x??c th???c',
				password: '',
			});
			return;
		}
		setError({
			username: '',
			otp: '',
			password: '',
		});
		try {
			const { data } = await mutationVerify(token);
			setStep(2);
			setOtp(data?.confirmToken || '');
		} catch (err) {
			const errResponse = err as AxiosError<BaseResponseAction>;
			if (errResponse?.response?.data?.code === 'INVALID_OTP')
				setError({ password: '', username: '', otp: 'Sai m?? x??c nh???n, th??? l???i sau' });
			else setError({ password: '', username: '', otp: 'C?? l???i x???y ra, th??? l???i sau' });
		}
	};

	const handleResetpass = async () => {
		const password = passRef.current?.value;
		const rePassword = rePassRef.current?.value;
		const reg = /^(?=.*\d)(?=(.*\W){1})(?=.*[a-zA-Z])(?!.*\s).{8,}$/;
		if (!reg.test(password || '')) {
			setError({
				username: '',
				password:
					'M???t kh???u t???i thi???u 8 k?? t???, bao g???m ??t nh???t 1 ch??? in hoa, 1 ch??? th?????ng, 1 ch??? s??? v?? 1 k?? t??? ?????c bi???t!',
				otp: '',
			});
			return;
		}
		if (password !== rePassword) {
			setError({
				username: '',
				password: 'M???t kh???u ch??a gi???ng nhau',
				otp: '',
			});
			return;
		}
		setError({ username: '', password: '', otp: '' });
		try {
			await mutationResetPass({ newPassword: password || '', confirmToken: otpToken });
			await alert({ title: '?????i m???t kh???u th??nh c??ng!', type: 'message' });
			history.replace('/auth/sign-in');
		} catch (err) {
			const errResponse = err as AxiosError<BaseResponseAction>;
			if (errResponse?.response?.data?.code === 'INVALID_OTP')
				setError({ password: 'Sai m?? x??c th???c, th??? l???i sau', username: '', otp: '' });
			else setError({ password: 'C?? l???i x???y ra, th??? l???i sau', username: '', otp: '' });
		}
	};

	const [show, setShow] = React.useState(false);
	const handleClick = () => setShow(!show);

	return (
		<DefaultAuth
			illustrationBackground={illustration}
			header={
				<IconButton
					margin={2}
					aria-label="setting"
					color="blue.500"
					variant="unstyled"
					as={FaChevronLeft}
					size="xs"
					onClick={() => history.goBack()}
					cursor="pointer"
				/>
			}
		>
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
							<Box me="auto">
								<Heading color={textColor} fontSize="36px" mb="10px">
									Qu??n m???t kh???u
								</Heading>
								<Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
									Nh???p Email c???a b???n ????? nh???n m?? x??c th???c!
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
									<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
										Email<Text color={brandStars}>*</Text>
									</FormLabel>
									<Input
										ref={usernameRef}
										isRequired
										name="email"
										variant="auth"
										borderColor={errorMessage.username ? '#FC8181' : undefined}
										fontSize="sm"
										ms={{ base: '0px', md: '0px' }}
										type="text"
										placeholder="mail@simmmple.com"
										mb="24px"
										fontWeight="500"
										size="lg"
									/>
									<Text pb={3} textAlign="center" fontWeight="bold" fontSize="sm" color="red.600">
										{errorMessage.username}
									</Text>
									<Button
										// eslint-disable-next-line @typescript-eslint/no-misused-promises
										onClick={handleSendmail}
										isLoading={sendingMail}
										loadingText="Loading"
										fontSize="sm"
										variant="brand"
										fontWeight="500"
										w="100%"
										h="50"
										mb="24px"
									>
										Ti???p t???c
									</Button>
								</FormControl>
							</Flex>
						</TabPanel>
						<TabPanel>
							<Box me="auto">
								<Heading color={textColor} fontSize="36px" mb="10px">
									Qu??n m???t kh???u
								</Heading>
								<Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
									Nh???p m?? x??c th???c t??? email c???a b???n!
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
										M?? x??c th???c<Text color={brandStars}>*</Text>
									</FormLabel>
									<Input
										ref={otpRef}
										isRequired
										fontSize="sm"
										placeholder="Nh???p m?? x??c th???c"
										mb="24px"
										size="lg"
										type="text"
										variant="auth"
									/>
									{isDown ? (
										<Flex justify="center" pb={3} textAlign="center" fontWeight="bold" fontSize="sm" color="red.600">
											<Text>M?? x??c nh???n ???? h???t hi???u l???c, vui l??ng</Text>
											{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
											<Text color="blue.600" cursor="pointer" onClick={handleSendmail}>
												&nbsp;G???i l???i m??&nbsp;
											</Text>
											<Text>????? ti???p t???c</Text>
										</Flex>
									) : (
										<>
											<Text pb={3} textAlign="center" fontWeight="bold" fontSize="sm" color="red.600">
												{errorMessage.otp}
											</Text>
											<Text pb={3} textAlign="center" fontWeight="bold" fontSize="sm" color="red.600">
												{minutes}: {seconds}
											</Text>
										</>
									)}

									<Button
										// eslint-disable-next-line @typescript-eslint/no-misused-promises
										onClick={handleVerifyToken}
										isLoading={sendingToken}
										disabled={isDown}
										loadingText="Loading"
										fontSize="sm"
										variant="brand"
										fontWeight="500"
										w="100%"
										h="50"
										mb="24px"
									>
										Ti???p t???c
									</Button>
								</FormControl>
							</Flex>
						</TabPanel>
						<TabPanel>
							<Box me="auto">
								<Heading color={textColor} fontSize="36px" mb="10px">
									Qu??n m???t kh???u
								</Heading>
								<Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
									Nh???p m???t kh???u m???i!
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
									<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
										M???t kh???u m???i<Text color={brandStars}>*</Text>
									</FormLabel>
									<InputGroup size="md">
										<Input
											ref={passRef}
											isRequired
											fontSize="sm"
											placeholder="Nh???p l???i m???t kh???u"
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
										Nh???p l???i m???t kh???u<Text color={brandStars}>*</Text>
									</FormLabel>
									<Input
										ref={rePassRef}
										isRequired
										fontSize="sm"
										placeholder="Nh???p l???i m???t kh???u"
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
										?????i m???t kh???u
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

export default ResetPassword;
