import React from 'react';

import { Redirect } from 'react-router-dom';
import { useAppSelector } from 'store';

export const withAuth =
	<P extends object>(WrappedComponent: React.FC<P>): React.FC<P> =>
	props => {
		const { logined } = useAppSelector(state => state.user);

		if (!logined) return <Redirect to="/auth/sign-in" />;

		return (
			<WrappedComponent
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		);
	};
