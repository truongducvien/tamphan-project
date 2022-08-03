import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { Toastify } from 'components/toast';
import AdminLayout from 'layouts/admin';
import AuthLayout from 'layouts/auth';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './index.scss';
import theme from './theme/theme';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<BrowserRouter>
				<Switch>
					<Route path="/auth" component={AuthLayout} />
					<Route path="/admin" component={AdminLayout} />
				</Switch>
				<Toastify />
			</BrowserRouter>
		</React.StrictMode>
	</ChakraProvider>,
);
