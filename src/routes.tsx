import React from 'react';

import { Icon } from '@chakra-ui/react';
import { FaBuilding, FaUserAlt } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';
import OfficeManagement from 'views/admin/office';
import UserManagement from 'views/admin/userManangement';
import UserManagementDetail from 'views/admin/userManangement/Detail';
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
		path: `/users`,
		icon: <Icon as={FaUserAlt} width="20px" height="20px" color="inherit" />,
		component: UserManagement,
		items: [
			{
				name: 'Thêm mới người dùng',
				layout: '/admin',
				path: `/users/create`,
				icon: <Icon as={FaUserAlt} width="20px" height="20px" color="inherit" />,
				component: UserManagementDetail,
			},
		],
	},
	{
		name: 'Quản lí Đơn vị',
		layout: '/admin',
		path: `/office`,
		icon: <Icon as={FaBuilding} width="20px" height="20px" color="inherit" />,
		component: OfficeManagement,
	},
	// {
	// 	name: 'Data Tables',
	// 	layout: '/admin',
	// 	icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
	// 	path: '/data-tables',
	// 	component: DataTables,
	// },
	{
		name: 'Sign In',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
		component: SignInCentered,
	},
];

export default routes;
