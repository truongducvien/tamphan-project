import { Flex, Heading, Image, Portal } from '@chakra-ui/react';

import notFound from '../assets/img/layout/404.png';

export const NotFound: React.FC = () => (
	<Portal>
		<Flex height="100vh" flexDirection="column" justifyContent="center" alignItems="center">
			<Image src={notFound} />
			<Heading>Ah, dang. We didn&apos;t find that page.</Heading>
		</Flex>
	</Portal>
);
