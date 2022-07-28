import React from 'react';

import { Icon } from '@chakra-ui/react';
import { FaBuffer, FaBuilding, FaMicrosoft, FaUserAlt } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';
import OfficeManagement from 'views/admin/office';
import OfficeForm from 'views/admin/office/form';
import PositionManagement from 'views/admin/position';
import PositionForm from 'views/admin/position/form';
import SubdivisionManagement from 'views/admin/subdivision';
import UserManagement from 'views/admin/userManangement';
import UserManagementForm from 'views/admin/userManangement/form';
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
				component: UserManagementForm,
			},
		],
	},
	{
		name: 'Quản lí Đơn vị',
		layout: '/admin',
		path: `/office`,
		icon: <Icon as={FaBuilding} width="20px" height="20px" color="inherit" />,
		component: OfficeManagement,
		items: [
			{
				name: 'Thêm mới đơn vị',
				layout: '/admin',
				path: `/office/create`,
				icon: <Icon as={FaUserAlt} width="20px" height="20px" color="inherit" />,
				component: OfficeForm,
			},
		],
	},
	{
		name: 'Quản lí chức vụ',
		layout: '/admin',
		path: `/position`,
		icon: <Icon as={FaBuffer} width="20px" height="20px" color="inherit" />,
		component: PositionManagement,
		items: [
			{
				name: 'Thêm mới chức vụ',
				layout: '/admin',
				path: `/position/create`,
				icon: <Icon as={FaBuffer} width="20px" height="20px" color="inherit" />,
				component: PositionForm,
			},
		],
	},
	{
		name: 'Quản lí phân khu',
		layout: '/admin',
		path: `/subdivision`,
		icon: <Icon as={FaMicrosoft} width="20px" height="20px" color="inherit" />,
		component: SubdivisionManagement,
		items: [
			{
				name: 'Thêm mới phân khu',
				layout: '/admin',
				path: `/subdivision/create`,
				icon: <Icon as={FaMicrosoft} width="20px" height="20px" color="inherit" />,
				component: PositionForm,
			},
		],
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
