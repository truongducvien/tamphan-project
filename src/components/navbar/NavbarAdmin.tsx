import React, { useState, useEffect } from 'react';

import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import AdminNavbarLinks from 'src/components/navbar/NavbarLinksAdmin';
import { SidebarResponsive } from 'src/components/sidebar/Sidebar';
import routes from 'src/routes';

export interface Props {
	secondary?: boolean;
	message?: boolean;
	brandText?: string;
	variant?: string;
	fixed?: boolean;
	logoText?: string;
	onOpen?(): void;
}

const AdminNavbar: React.FC<Props> = ({ secondary, message, fixed, logoText, onOpen }) => {
	const [scrolled, setScrolled] = useState(false);
	const navbarPosition = 'fixed';
	const navbarFilter = 'none';
	const navbarBackdrop = 'blur(20px)';
	const navbarBg = useColorModeValue('white', 'navy.800');
	const navbarBorder = 'transparent';
	const secondaryMargin = '0px';
	const paddingX = '15px';
	const gap = '7px';
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
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH="10px"
			justifyContent={{ xl: 'center' }}
			lineHeight="25.6px"
			mx="auto"
			mt={secondaryMargin}
			pb="8px"
			px={{
				sm: paddingX,
				md: '10px',
			}}
			pt="8px"
			top="0px"
			w="100vw"
		>
			<Flex pl="10px" w="100%" align="center" justify="center" mb={gap}>
				<SidebarResponsive routes={routes} display="none" />
				<Box ms="auto">
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
