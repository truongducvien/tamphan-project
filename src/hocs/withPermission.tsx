import React from 'react';

import { Flex, Heading, Image } from '@chakra-ui/react';

import { FeatureModule } from '@/services/role/type';
import { useAppSelector } from '@/store';
import { PermistionAction } from '@/variables/permission';

import notFound from '../assets/img/layout/404.png';

interface WithPermissionProps {
	request?: FeatureModule;
	action?: PermistionAction;
}

export type BaseComponentProps = WithPermissionProps;

const NotFound: React.FC = () => (
	<Flex
		height={{ sm: 'calc( 100vh - 200px)', md: 'calc( 100vh - 120px)' }}
		flexDirection="column"
		justifyContent="center"
		alignItems="center"
	>
		<Image src={notFound} width={200} />
		<Heading as="h6" mt={5} fontSize={{ sm: 'sm', md: '2xl' }}>
			Ah, dang. We didn&apos;t find that page.
		</Heading>
	</Flex>
);

export const withPermission =
	<P extends object>(Component: React.ComponentType<P>): React.FC<P & WithPermissionProps> =>
	({ request, action, ...props }: WithPermissionProps) => {
		const { info } = useAppSelector(state => state.user);
		const permission = info?.role?.privileges;
		if (permission && request && action) {
			const hasPermission = permission?.[request]?.includes(action);
			return hasPermission ? <Component {...(props as P)} request={request} action={action} /> : <NotFound />;
		}
		return <NotFound />;
	};
