import { Flex, FlexProps } from '@chakra-ui/react';

interface Props extends FlexProps {
	variant?: string;
}

const HSeparator = (props: Props) => {
	const { variant, children, ...rest } = props;
	return <Flex h="1px" w="100%" bg="rgba(135, 140, 189, 0.3)" {...rest} />;
};

const VSeparator = (props: Props) => {
	const { variant, children, ...rest } = props;
	return <Flex w="1px" bg="rgba(135, 140, 189, 0.3)" {...rest} />;
};

export { HSeparator, VSeparator };
