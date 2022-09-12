// Chakra imports
import React, { useState } from 'react';

import {
	Portal,
	Box,
	useDisclosure,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	useColorModeValue,
} from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import { withPermission } from 'hocs/withPermission';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import routes, { Route as RootRoute } from 'routes';

// Custom Chakra theme
const Dashboard: React.FC = props => {
	const {
		location: { pathname },
	} = useHistory();
	const { ...rest } = props;
	// states and functions
	const [fixed] = useState(false);
	const [toggleSidebar, setToggleSidebar] = useState(false);
	// functions for changing the states from components
	const getRoute = () => {
		return window.location.pathname !== '/admin/full-screen-maps';
	};
	const getActiveRoute = (r: RootRoute[]): string => {
		const activeRoute = '';
		let parent = '';
		for (const element of r) {
			if (element.collapse) {
				const collapseActiveRoute = getActiveRoute(element?.items || []);
				if (collapseActiveRoute !== activeRoute) {
					return collapseActiveRoute;
				}
			} else if (element?.category) {
				const categoryActiveRoute = getActiveRoute(element?.items || []);
				if (categoryActiveRoute !== activeRoute) {
					return categoryActiveRoute;
				}
			} else if (pathname === element.layout + element.path) {
				return element.name;
			} else if (element.items) {
				const name = getActiveRoute(element?.items);
				if (name) {
					parent = element.name;
					return `${parent}/${name}`;
				}
			}
		}
		return activeRoute;
	};
	const getActiveNavbar = (r: RootRoute[]): boolean => {
		const activeNavbar = false;
		for (const element of r) {
			if (element.collapse) {
				const collapseActiveNavbar = getActiveNavbar(element?.items || []);
				if (collapseActiveNavbar !== activeNavbar) {
					return collapseActiveNavbar;
				}
			} else if (element.category) {
				const categoryActiveNavbar = getActiveNavbar(element?.items || []);
				if (categoryActiveNavbar !== activeNavbar) {
					return categoryActiveNavbar;
				}
			} else if (window.location.href.indexOf(element.layout + element.path) !== -1) {
				return element?.secondary || false;
			}
		}
		return activeNavbar;
	};
	const getActiveNavbarText = (r: RootRoute[]): boolean => {
		const activeNavbar = false;
		for (const element of r) {
			if (element.collapse) {
				const collapseActiveNavbar = getActiveNavbarText(element?.items || []);
				if (collapseActiveNavbar !== activeNavbar) {
					return collapseActiveNavbar;
				}
			} else if (element.category) {
				const categoryActiveNavbar = getActiveNavbarText(element?.items || []);
				if (categoryActiveNavbar !== activeNavbar) {
					return categoryActiveNavbar;
				}
			} else if (window.location.href.indexOf(element.layout + element.path) !== -1) {
				return element?.messageNavbar || false;
			}
		}
		return activeNavbar;
	};
	const getRoutes = (r: RootRoute[]): React.ReactNode => {
		return r.map((prop, key) => {
			if (prop.layout === '/admin') {
				if (prop.items) {
					const routers = getRoutes(prop.items);
					return (
						<Route
							path={prop.layout + prop.path}
							render={({ match: { path } }) => (
								<Switch>
									<Route
										exact
										path={`${path}/`}
										component={() =>
											withPermission(prop.component)({ request: prop.requirePermission, action: prop.action })
										}
									/>
									{routers}
									<Redirect from={`${path}/*`} to={path} />
								</Switch>
							)}
							key={key}
						/>
					);
				}
				return (
					<Route
						exact
						path={prop.layout + prop.path}
						component={() => withPermission(prop.component)({ request: prop.requirePermission, action: prop.action })}
						key={key}
					/>
				);
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
	const { onOpen } = useDisclosure();
	const secondaryText = useColorModeValue('gray.700', 'white');
	const breadcrumb = getActiveRoute(routes)?.split('/');

	return (
		<Box>
			<SidebarContext.Provider
				// eslint-disable-next-line react/jsx-no-constructed-context-values
				value={{
					toggleSidebar,
					setToggleSidebar,
				}}
			>
				<Sidebar {...rest} routes={routes} display="none" />
				<Box
					float="right"
					overflow="auto"
					minH="100vh"
					position="relative"
					display=" flex"
					flexDirection="column"
					justifyContent="space-between"
					w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
					maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
					transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
					transitionDuration=".2s, .2s, .35s"
					transitionProperty="top, bottom, width"
					transitionTimingFunction="linear, linear, ease"
				>
					<Portal>
						<Box>
							<Navbar
								onOpen={onOpen}
								secondary={getActiveNavbar(routes)}
								message={getActiveNavbarText(routes)}
								fixed={fixed}
								{...rest}
							/>
						</Box>
					</Portal>

					{getRoute() ? (
						<Box p={{ base: '20px', md: '30px' }}>
							<Box mb={{ sm: '8px', xl: '0px' }} pt="70px">
								{/* Here we create navbar brand, based on route name */}
								<Breadcrumb>
									<BreadcrumbItem color={secondaryText} fontSize="sm">
										<BreadcrumbLink href="#" color={secondaryText}>
											Pages
										</BreadcrumbLink>
									</BreadcrumbItem>
									{breadcrumb &&
										breadcrumb.map((i, idx) => (
											<BreadcrumbItem key={idx} color={secondaryText} fontSize="sm">
												<BreadcrumbLink color={secondaryText}>{i}</BreadcrumbLink>
											</BreadcrumbItem>
										))}
								</Breadcrumb>
							</Box>
							<Switch>
								{getRoutes(routes)}
								<Redirect from="/*" to="/admin" />
							</Switch>
						</Box>
					) : null}
					<Box>
						<Footer />
					</Box>
				</Box>
			</SidebarContext.Provider>
		</Box>
	);
};

export default Dashboard;
