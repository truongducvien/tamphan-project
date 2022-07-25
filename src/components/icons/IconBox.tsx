import React from 'react';

import { Flex, FlexProps } from '@chakra-ui/react';

export interface Props extends FlexProps {
	icon?: React.ReactNode;
}

const IconBox: React.FC<Props> = props => {
	const { icon, ...rest } = props;

	return (
		<Flex alignItems="center" justifyContent="center" borderRadius="50%" {...rest}>
			{icon}
		</Flex>
	);
};

export default IconBox;
