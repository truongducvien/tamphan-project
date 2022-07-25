import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { Toastify } from 'components/toast';
import AdminLayout from 'layouts/admin';
import AuthLayout from 'layouts/auth';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import theme from './theme/theme';

ReactDOM.render(
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
	document.getElementById('root'),
);
