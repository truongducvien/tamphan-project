// Chakra imports
import React from 'react';

import { Flex, BackgroundProps, Icon, Text } from '@chakra-ui/react';
import FixedPlugin from 'src/components/fixedPlugin/FixedPlugin';
import Footer from 'src/components/footer/FooterAuth';

export interface Props {
	illustrationBackground?: BackgroundProps['bg'];
	children: React.ReactNode;
	header?: React.ReactNode;
}

const AuthIllustration: React.FC<Props> = props => {
	const { children, header } = props;
	// Chakra color mode
	return (
		<Flex position="relative" h="max-content" flexDirection="column">
			<Flex ps={{ base: '25px', lg: '0px' }} pt={{ lg: '0px', xl: '0px' }}>
				{header}
			</Flex>
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
				justifyContent="center"
				direction="column"
				align="center"
			>
				{children}
				<Footer />
			</Flex>
			<FixedPlugin />
		</Flex>
	);
};
// PROPS

export default AuthIllustration;
