// Chakra imports
import React, { Suspense, useState } from 'react';

import { ChevronRightIcon } from '@chakra-ui/icons';
import {
	Portal,
	Box,
	useDisclosure,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	useColorModeValue,
} from '@chakra-ui/react';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import Footer from 'src/components/footer/FooterAdmin';
// Layout components
import { Loading } from 'src/components/form/Loading';
import Navbar from 'src/components/navbar/NavbarAdmin';
import Sidebar from 'src/components/sidebar/Sidebar';
import { SidebarContext } from 'src/contexts/SidebarContext';
import { withPermission } from 'src/hocs/withPermission';
import routes, { Route as RootRoute } from 'src/routes';

const Dashboard: React.FC = props => {
	const {
		location: { pathname },
	} = useHistory();
	const { ...rest } = props;
	const [fixed] = useState(false);
	const [toggleSidebar, setToggleSidebar] = useState(true);
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

	const getActiveRoute2 = (
		r: RootRoute[],
		activeRoute: { title: string; path: string }[] = [],
	): { title: string; path: string }[] => {
		let parent: { title: string; path: string } | null = null;
		for (const element of r) {
			if (element.collapse) {
				const collapseActiveRoute = getActiveRoute2(element?.items || []);
				if (collapseActiveRoute !== activeRoute) {
					return collapseActiveRoute;
				}
			} else if (element?.category) {
				const categoryActiveRoute = getActiveRoute2(element?.items || []);
				if (categoryActiveRoute !== activeRoute) {
					return categoryActiveRoute;
				}
			} else if (pathname === element.layout + element.path) {
				return [{ title: element.name, path: element.path }];
			} else if (element.items) {
				const name = getActiveRoute2(element?.items);
				if (name.length > 0) {
					parent = { title: element.name, path: element.path };
					activeRoute = [{ title: parent.title, path: parent.path }, ...name];
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
										// eslint-disable-next-line react/no-unstable-nested-components
										component={() => (
											<Suspense fallback={<Loading />}>
												{withPermission(prop.component)({ request: prop.requirePermission, action: prop.action })}
											</Suspense>
										)}
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
						// eslint-disable-next-line react/no-unstable-nested-components
						component={() => (
							<Suspense fallback={<Loading />}>
								{withPermission(prop.component)({ request: prop.requirePermission, action: prop.action })}
							</Suspense>
						)}
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
	const breadcrumb = getActiveRoute2(routes);

	return (
		<Box>
			<SidebarContext.Provider
				// eslint-disable-next-line react/jsx-no-constructed-context-values
				value={{
					toggleSidebar,
					setToggleSidebar,
				}}
			>
				<Sidebar {...rest} routes={routes} display={toggleSidebar ? 'block' : 'none'} />
				<Box
					float="right"
					overflow="auto"
					minH="100vh"
					position="relative"
					display="flex"
					flexDirection="column"
					justifyContent="space-between"
					w={{ base: '100%', xl: toggleSidebar ? 'calc( 100% - 290px )' : '100%' }}
					transitionDuration=".6s"
					transitionProperty="width"
					transitionTimingFunction="ease-in-out"
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
							<Box mb={{ sm: '8px', xl: '0px' }} pt="50px">
								{/* Here we create navbar brand, based on route name */}
								<Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
									<BreadcrumbItem color={secondaryText} fontSize="sm">
										<BreadcrumbLink href="#" color={secondaryText}>
											Pages
										</BreadcrumbLink>
									</BreadcrumbItem>
									{breadcrumb &&
										breadcrumb.map((i, idx) => (
											<BreadcrumbItem key={idx} color={secondaryText} fontSize="sm">
												<BreadcrumbLink as={Link} to={`/admin${i.path}`} color={secondaryText}>
													{i.title}
												</BreadcrumbLink>
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
