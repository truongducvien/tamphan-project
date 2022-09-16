import React, { Suspense } from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { UseAlert } from 'src/components/alertDialog/hook';
import DialogServiceProvider from 'src/components/alertDialog/provider';
import { Toastify } from 'src/components/toast';
import { withAuth } from 'src/hocs/withAuth';
import { InitialApp } from 'src/layouts';
import './index.scss';
import queryClient from 'src/services/clientProvider';
import { store } from 'src/store';
import { NotFound } from 'src/views/NotFound';

import { Loading } from './components/form/Loading';
import theme from './theme/theme';

const container = document.getElementById('root');
const root = createRoot(container!);
const AdminLayout = React.lazy(() => import('src/layouts/admin'));
const AuthLayout = React.lazy(() => import('src/layouts/auth'));

root.render(
	<Provider store={store}>
		<QueryClientProvider client={queryClient}>
			<ChakraProvider theme={theme}>
				<DialogServiceProvider>
					<InitialApp />
					<BrowserRouter>
						<Suspense fallback={<Loading />}>
							<Switch>
								<Route path="/auth" component={AuthLayout} />
								{/* <Route path="/admin" component={AdminLayout} /> */}
								<Route path="/admin" component={withAuth(AdminLayout)} />
								<Route exact path="/" render={() => <Redirect to="/admin" />} />
								<Route path="*" component={NotFound} />
							</Switch>
						</Suspense>
						<Toastify />
						<UseAlert />
					</BrowserRouter>
				</DialogServiceProvider>
			</ChakraProvider>
		</QueryClientProvider>
	</Provider>,
);
