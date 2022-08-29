import React from 'react';

import { Center, Portal, Spinner } from '@chakra-ui/react';
import { Redirect } from 'react-router-dom';
import { useAppSelector } from 'store';

export const withAuth =
	<P extends object>(WrappedComponent: React.FC<P>): React.FC<P> =>
	props => {
		const { logined, loading } = useAppSelector(state => state.user);
		if (loading)
			return (
				<Portal>
					<Center height="100vh">
						<Spinner color="blue.500" emptyColor="gray.200" speed="0.65s" />
					</Center>
				</Portal>
			);
		if (!logined) return <Redirect to="/auth/sign-in" />;

		return (
			<WrappedComponent
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		);
	};
