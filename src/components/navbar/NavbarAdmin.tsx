import React, { useState, useEffect } from 'react';

import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import routes from 'routes';

export interface Props {
	secondary?: boolean;
	message?: boolean;
	brandText?: string;
	variant?: string;
	fixed?: boolean;
	logoText?: string;
	onOpen?(): void;
}

const AdminNavbar: React.FC<Props> = ({ secondary, message, brandText, fixed, logoText, onOpen }) => {
	const [scrolled, setScrolled] = useState(false);

	// Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
	const mainText = useColorModeValue('navy.700', 'white');
	const secondaryText = useColorModeValue('gray.700', 'white');
	const navbarPosition = 'fixed';
	const navbarFilter = 'none';
	const navbarBackdrop = 'blur(20px)';
	const navbarBg = useColorModeValue('white', 'navy.800');
	const navbarBorder = 'transparent';
	const secondaryMargin = '0px';
	const paddingX = '15px';
	const gap = '0px';
	const shadow = useColorModeValue(
		'0px 17px 40px -17px rgba(112, 144, 176, 0.18)',
		'14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
	);
	const changeNavbar = () => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};
	useEffect(() => {
		window.addEventListener('scroll', changeNavbar);

		return () => {
			window.removeEventListener('scroll', changeNavbar);
		};
	});

	const breadcrumb = brandText?.split('/');

	return (
		<Box
			position={navbarPosition}
			boxShadow={shadow}
			bg={navbarBg}
			borderColor={navbarBorder}
			filter={navbarFilter}
			backdropFilter={navbarBackdrop}
			backgroundPosition="center"
			backgroundSize="cover"
			borderWidth="1.5px"
			borderStyle="solid"
			transitionDelay="0s, 0s, 0s, 0s"
			transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
			transition-property="box-shadow, background-color, filter, border"
			transitionTimingFunction="linear, linear, linear, linear"
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH="75px"
			justifyContent={{ xl: 'center' }}
			lineHeight="25.6px"
			mx="auto"
			mt={secondaryMargin}
			pb="8px"
			right={0}
			px={{
				sm: paddingX,
				md: '10px',
			}}
			pt="8px"
			top="0px"
			w={{
				base: '100vw',
				xl: 'calc(100vw - 300px)',
				'2xl': 'calc(100vw - 300px)',
			}}
		>
			<Flex
				pl="10px"
				w="100%"
				flexDirection={{
					sm: 'column',
					md: 'row',
				}}
				alignItems="start"
				mb={gap}
			>
				<SidebarResponsive routes={routes} display="none" />
				<Box mb={{ sm: '8px', md: '0px' }}>
					{/* Here we create navbar brand, based on route name */}
					<Flex mb={{ sm: '8px', md: '0px' }}>
						{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
						<Link
							color={mainText}
							href="#"
							bg="inherit"
							borderRadius="inherit"
							fontWeight="bold"
							fontSize="25px"
							_hover={{ color: { mainText } }}
							_active={{
								bg: 'inherit',
								transform: 'none',
								borderColor: 'transparent',
							}}
							_focus={{
								boxShadow: 'none',
							}}
						>
							{breadcrumb?.length ? breadcrumb?.[breadcrumb.length - 1] : brandText}
						</Link>
					</Flex>
					<Breadcrumb ml="5px">
						<BreadcrumbItem color={secondaryText} fontSize="sm">
							<BreadcrumbLink href="#" color={secondaryText}>
								Pages
							</BreadcrumbLink>
						</BreadcrumbItem>
						{breadcrumb &&
							breadcrumb.map((i, idx) => (
								<BreadcrumbItem key={idx} color={secondaryText} fontSize="sm">
									<BreadcrumbLink color={secondaryText}>{i}</BreadcrumbLink>
								</BreadcrumbItem>
							))}
					</Breadcrumb>
				</Box>

				<Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
					<AdminNavbarLinks
						onOpen={onOpen}
						logoText={logoText}
						secondary={secondary}
						fixed={fixed}
						scrolled={scrolled}
					/>
				</Box>
			</Flex>
			{secondary ? <Text color="white">{message}</Text> : null}
		</Box>
	);
};

export default AdminNavbar;
