// Chakra imports
import React from 'react';

import { Box, Flex, Icon, Text, BackgroundProps } from '@chakra-ui/react';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';
import Footer from 'components/footer/FooterAuth';
import { FaChevronLeft } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
// Assets

export interface Props {
	illustrationBackground?: BackgroundProps['bg'];
	children: React.ReactNode;
}

const AuthIllustration: React.FC<Props> = props => {
	const { children, illustrationBackground } = props;
	// Chakra color mode
	return (
		<Flex position="relative" h="max-content">
			<Flex
				h={{
					sm: 'initial',
					md: 'unset',
					lg: '100vh',
					xl: '97vh',
				}}
				w="100%"
				maxW={{ md: '66%', lg: '1313px' }}
				mx="auto"
				pt={{ sm: '50px', md: '0px' }}
				px={{ lg: '30px', xl: '0px' }}
				ps={{ xl: '70px' }}
				justifyContent="start"
				direction="column"
			>
				<NavLink
					to="/admin"
					style={() => ({
						width: 'fit-content',
						marginTop: '40px',
					})}
				>
					<Flex align="center" ps={{ base: '25px', lg: '0px' }} pt={{ lg: '0px', xl: '0px' }} w="fit-content">
						<Icon as={FaChevronLeft} me="12px" h="13px" w="8px" color="secondaryGray.600" />
						<Text ms="0px" fontSize="sm" color="secondaryGray.600">
							Back to Simmmple
						</Text>
					</Flex>
				</NavLink>
				{children}
				<Box
					display={{ base: 'none', md: 'block' }}
					h="100%"
					minH="100vh"
					w={{ lg: '50vw', '2xl': '44vw' }}
					position="absolute"
					right="0px"
				>
					<Flex
						// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
						bg={`url(${illustrationBackground})`}
						justify="center"
						align="end"
						w="100%"
						h="100%"
						bgSize="cover"
						bgPosition="50%"
						position="absolute"
						borderBottomLeftRadius={{ lg: '120px', xl: '200px' }}
					/>
				</Box>
				<Footer />
			</Flex>
			<FixedPlugin />
		</Flex>
	);
};
// PROPS

export default AuthIllustration;
