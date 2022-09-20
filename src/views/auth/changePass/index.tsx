import React, { useRef, useState } from 'react';

// Chakra imports
import {
	Box,
	Button,
	Flex,
	Menu,
	MenuList,
	MenuItem,
	FormControl,
	FormLabel,
	Heading,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	MenuButton,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FaChevronLeft } from 'react-icons/fa';
import { MdOutlineRemoveRedEye, MdSettings } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { Redirect, useHistory } from 'react-router-dom';
import { alert } from 'src/components/alertDialog/hook';
import { Loading } from 'src/components/form/Loading';
import { HSeparator } from 'src/components/separator/Separator';
import DefaultAuth from 'src/layouts/auth/Default';
import { BaseResponseAction } from 'src/services/type';
import { userChangePass } from 'src/services/user';
import { useAppSelector, useAppDispatch } from 'src/store';
import { logout } from 'src/store/actionCreators';

const ChangePass: React.FC = () => {
	const history = useHistory();
	const textColor = useColorModeValue('navy.700', 'white');
	const textColorSecondary = 'gray.400';
	const brandStars = useColorModeValue('brand.500', 'brand.400');
	const { info, logined, loading } = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const passRef = useRef<HTMLInputElement>(null);
	const olPassRef = useRef<HTMLInputElement>(null);
	const rePassRef = useRef<HTMLInputElement>(null);

	const [errorMessage, setError] = useState('');

	const { mutateAsync: mutationResetPass, isLoading: reseting } = useMutation(userChangePass);

	const handleResetpass = async () => {
		const password = passRef.current?.value;
		const oldPassword = olPassRef.current?.value;

		const rePassword = rePassRef.current?.value;
		const reg = /^(?=.*\d)(?=(.*\W){1})(?=.*[a-zA-Z])(?!.*\s).{8,}$/;
		if (!reg.test(password || '')) {
			setError('Mật khẩu tối thiểu 8 kí tự, ít nhất 1 chữ in và 1 chữ thường và 1 kí tự đặc biệt');
			return;
		}
		if (password !== rePassword) {
			setError('Mật khẩu chưa giống nhau');
			return;
		}

		setError('');
		try {
			await mutationResetPass({
				newPassword: password || '',
				oldPassword: oldPassword || '',
				username: info?.username || '',
			});
			await alert({ title: 'Đổi mật khẩu thành công!', type: 'message' });
			dispatch(logout());
			history.replace('/auth/sign-in');
		} catch (err) {
			const errResponse = err as AxiosError<BaseResponseAction>;
			if (errResponse?.response?.data?.code === 'INVALID_USERNAME_OR_PASSWORD') setError('Mật khẩu chưa chính xác');
			else setError('Có lỗi xảy ra, thử lại sau');
		}
	};

	const [show, setShow] = React.useState(false);
	const handleClick = () => setShow(!show);

	if (loading) return <Loading />;

	if (!logined) return <Redirect to="/auth/sign-in" />;

	return (
		<DefaultAuth
			header={
				info?.isFirstTimeLogin ? (
					<Flex justify="end" flex={1}>
						<Menu>
							<MenuButton>
								<IconButton
									margin={2}
									aria-label="setting"
									color="blue.500"
									variant="unstyled"
									cursor="pointer"
									as={MdSettings}
									size="xs"
								/>
							</MenuButton>
							<MenuList>
								<MenuItem onClick={() => dispatch(logout())}>Đăng xuất</MenuItem>
							</MenuList>
						</Menu>
					</Flex>
				) : (
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
				)
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
						<Input
							ref={olPassRef}
							isRequired
							fontSize="sm"
							placeholder="Nhập lại mật khẩu"
							mb="24px"
							size="lg"
							type={show ? 'text' : 'password'}
							variant="auth"
						/>
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
							{errorMessage}
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
			</Flex>
		</DefaultAuth>
	);
};
export default ChangePass;
