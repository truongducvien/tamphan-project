import { BoxProps, Flex, Spinner } from '@chakra-ui/react';

export interface Props extends BoxProps {
	color?: string;
	emptyColor?: string;
	speed?: string;
}

export const Loading: React.FC<Props> = ({ color, emptyColor, speed, ...inerProps }) => {
	return (
		<Flex
			height={{ sm: 'calc( 100vh - 200px)', md: 'calc( 100vh - 120px)' }}
			justifyContent="center"
			alignItems="center"
			width="100%"
			{...inerProps}
		>
			<Spinner color={color || 'blue.500'} speed={speed || '0.6s'} emptyColor={emptyColor || 'gray.200'} />
		</Flex>
	);
};
