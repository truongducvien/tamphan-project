import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { UseAlert } from 'components/alertDialog/hook';
import DialogServiceProvider from 'components/alertDialog/provider';
import { Toastify } from 'components/toast';
import AdminLayout from 'layouts/admin';
import AuthLayout from 'layouts/auth';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './index.scss';
import queryClient from 'services/clientProvider';
import { NotFound } from 'views/NotFound';

import theme from './theme/theme';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
	<QueryClientProvider client={queryClient}>
		<ChakraProvider theme={theme}>
			<DialogServiceProvider>
				<React.StrictMode>
					<BrowserRouter>
						<Switch>
							<Route path="/auth" component={AuthLayout} />
							<Route path="/admin" component={AdminLayout} />
							<Route exact path="/" render={() => <Redirect to="/admin" />} />
							<Route path="*" component={NotFound} />
						</Switch>
						<Toastify />
						<UseAlert />
					</BrowserRouter>
				</React.StrictMode>
			</DialogServiceProvider>
		</ChakraProvider>
	</QueryClientProvider>,
);
