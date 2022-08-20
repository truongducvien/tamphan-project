import React from 'react';

import { Badge, BadgeProps } from '@chakra-ui/react';

export interface Props extends BadgeProps {
	children?: React.ReactNode;
}

export const Tag: React.FC<Props> = ({ children, variant = 'solid', ...innerProps }) => {
	return (
		<Badge {...innerProps} variant={variant}>
			{children}
		</Badge>
	);
};
