import React, { useState } from 'react';

import { Box, useColorModeValue } from '@chakra-ui/react';
import { SidebarContext } from 'contexts/SidebarContext';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes, { Route as RootRoute } from 'routes';

// Chakra imports

// Layout components

// Custom Chakra theme
const Auth: React.FC = () => {
	// states and functions
	const [toggleSidebar, setToggleSidebar] = useState(false);
	// functions for changing the states from components
	const getRoute = () => {
		return window.location.pathname !== '/auth/full-screen-maps';
	};

	const getRoutes = (r: RootRoute[]): React.ReactNode => {
		return r.map((prop, key) => {
			if (prop.layout === '/auth') {
				return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
			}
			if (prop.collapse) {
				return getRoutes(prop?.items || []);
			}
			if (prop.category) {
				return getRoutes(prop?.items || []);
			}
			return null;
		});
	};

	const authBg = useColorModeValue('white', 'navy.900');

	return (
		<Box>
			<SidebarContext.Provider
				// eslint-disable-next-line react/jsx-no-constructed-context-values
				value={{
					toggleSidebar,
					setToggleSidebar,
				}}
			>
				<Box
					bg={authBg}
					float="right"
					minHeight="100vh"
					height="100%"
					position="relative"
					w="100%"
					transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
					transitionDuration=".2s, .2s, .35s"
					transitionProperty="top, bottom, width"
					transitionTimingFunction="linear, linear, ease"
				>
					{getRoute() ? (
						<Box mx="auto" minH="100vh">
							<Switch>{getRoutes(routes)}</Switch>
							<Redirect from="auth/*" to="/auth/sign-in" />
						</Box>
					) : null}
				</Box>
			</SidebarContext.Provider>
		</Box>
	);
};

export default Auth;
