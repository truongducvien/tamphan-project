// chakra imports
import React from 'react';

import { Box, Flex, Stack } from '@chakra-ui/react';
//   Custom components
import Brand from 'components/sidebar/components/Brand';
import Links, { Props as LinkProps } from 'components/sidebar/components/Links';

// FUNCTIONS

export type Props = LinkProps;

export const SidebarContent: React.FC<Props> = props => {
	const { routes } = props;
	// SIDEBAR
	return (
		<Flex direction="column" height="100%" pt="10px" borderRadius="30px">
			<Brand />
			<Stack direction="column" mb="auto" mt="8px">
				<Box ps="20px" pe={{ md: '16px', '2xl': '1px' }}>
					<Links routes={routes} />
				</Box>
			</Stack>

			{/* <Box
        ps='20px'
        pe={{ md: "16px", "2xl": "0px" }}
        mt='60px'
        mb='40px'
        borderRadius='30px'>
        <SidebarCard />
      </Box> */}
		</Flex>
	);
};

export default SidebarContent;
