import React from 'react';

import { Box, BoxProps, useStyleConfig } from '@chakra-ui/react';

export interface Props extends BoxProps {
	variant?: string;
}

const Card: React.FC<Props> = props => {
	const { variant, children, ...rest } = props;
	const styles = useStyleConfig('Card', { variant });

	return (
		<Box __css={styles} {...rest}>
			{children}
		</Box>
	);
};

export default Card;
