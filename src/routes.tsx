import React from 'react';

import { Icon } from '@chakra-ui/react';
import { FaUserAlt } from 'react-icons/fa';
import { MdBarChart, MdLock } from 'react-icons/md';
import DataTables from 'views/admin/dataTables';
import UserManagement from 'views/admin/userManangement';
import SignInCentered from 'views/auth/signIn';

export interface Route {
	name: string;
	layout: string;
	path: string;
	icon: React.ReactNode;
	component: React.ComponentType;
	secondary?: boolean;
	items?: Route[];
	collapse?: boolean;
	authIcon?: string;
	category?: boolean;
	messageNavbar?: boolean;
}

const routes: Route[] = [
	{
		name: 'Quản lí người dùng',
		layout: '/admin',
		path: '/user',
		icon: <Icon as={FaUserAlt} width="20px" height="20px" color="inherit" />,
		component: UserManagement,
		items: [
			{
				name: 'Thêm mới người dùng',
				layout: '/admin',
				path: '/user/create',
				icon: <Icon as={FaUserAlt} width="20px" height="20px" color="inherit" />,
				component: UserManagement,
			},
		],
	},
	{
		name: 'Data Tables',
		layout: '/admin',
		icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
		path: '/data-tables',
		component: DataTables,
	},
	{
		name: 'Sign In',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
		component: SignInCentered,
	},
];

export default routes;
