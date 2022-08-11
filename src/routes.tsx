import React from 'react';

import { Icon } from '@chakra-ui/react';
import { FaBuffer, FaBuilding, FaClipboardList, FaMicrosoft, FaRegistered, FaTh, FaUserAlt } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';
import { Admin } from 'views/admin';
import ApartMentManagement from 'views/admin/apartment';
import AparmentForm from 'views/admin/apartment/form';
import OfficeManagement from 'views/admin/office';
import OfficeForm from 'views/admin/office/form';
import PositionManagement from 'views/admin/position';
import PositionForm from 'views/admin/position/form';
import ResidentManagement from 'views/admin/resident';
import ResidentForm from 'views/admin/resident/form';
import SubdivisionManagement from 'views/admin/subdivision';
import DetailSubdivision from 'views/admin/subdivision/form';
import UserManagement from 'views/admin/userManangement';
import UserManagementForm from 'views/admin/userManangement/form';
import UtilitiesManagement from 'views/admin/utilities';
import UtilitiesForm from 'views/admin/utilities/form';
import TypeUtilitiesForm from 'views/admin/utilities/typeUti/form';
import TypeUtilitiesManagement from 'views/admin/utilities/typeUti/typeUtilities';
import UtilsReManagement from 'views/admin/utisRegisteration';
import UtilsReForm from 'views/admin/utisRegisteration/form';
import SignInCentered from 'views/auth/signIn';

export interface Route {
	name: string;
	layout: string;
	path: string;
	icon?: React.ReactNode;
	component: React.ComponentType;
	secondary?: boolean;
	items?: Route[];
	collapse?: boolean;
	authIcon?: string;
	category?: boolean;
	messageNavbar?: boolean;
	isShow?: boolean;
}

const routes: Route[] = [
	{
		name: 'Quản lý người dùng',
		layout: '/admin',
		path: `/users`,
		icon: <Icon as={FaUserAlt} width="20px" height="20px" color="inherit" />,
		component: UserManagement,
		items: [
			{
				name: 'người dùng',
				layout: '/admin',
				path: `/users/form`,
				component: UserManagementForm,
			},
		],
	},
	{
		name: 'Quản lý Đơn vị',
		layout: '/admin',
		path: `/office`,
		icon: <Icon as={FaBuilding} width="20px" height="20px" color="inherit" />,
		component: OfficeManagement,
		items: [
			{
				name: 'đơn vị',
				layout: '/admin',
				path: `/office/form`,
				component: OfficeForm,
			},
		],
	},
	{
		name: 'Quản lý chức vụ',
		layout: '/admin',
		path: `/position`,
		icon: <Icon as={FaBuffer} width="20px" height="20px" color="inherit" />,
		component: PositionManagement,
		items: [
			{
				name: 'chức vụ',
				layout: '/admin',
				path: `/position/form`,
				component: PositionForm,
			},
		],
	},
	{
		name: 'Quản lý phân khu',
		layout: '/admin',
		path: `/subdivision`,
		icon: <Icon as={FaMicrosoft} width="20px" height="20px" color="inherit" />,
		component: SubdivisionManagement,
		items: [
			{
				name: 'phân khu',
				layout: '/admin',
				path: `/subdivision/form`,
				component: DetailSubdivision,
			},
		],
	},
	{
		name: 'Quản lý căn hộ',
		layout: '/admin',
		path: `/apartment`,
		icon: <Icon as={FaMicrosoft} width="20px" height="20px" color="inherit" />,
		component: ApartMentManagement,
		items: [
			{
				name: 'căn hộ',
				layout: '/admin',
				path: `/apartment/form`,
				component: AparmentForm,
			},
		],
	},
	{
		name: 'Quản lý cư dân',
		layout: '/admin',
		path: `/resident`,
		icon: <Icon as={FaMicrosoft} width="20px" height="20px" color="inherit" />,
		component: ResidentManagement,
		items: [
			{
				name: 'cư dân',
				layout: '/admin',
				path: `/resident/form`,
				component: ResidentForm,
			},
		],
	},
	{
		name: 'Tiện ích',
		layout: '/admin',
		path: `/`,
		category: true,
		component: Admin,
	},
	{
		name: 'Quản lý loại tiện ích',
		layout: '/admin',
		path: `/type-utilities`,
		icon: <Icon as={FaClipboardList} width="20px" height="20px" color="inherit" />,
		component: TypeUtilitiesManagement,
		items: [
			{
				name: 'loại tiện ích',
				layout: '/admin',
				path: `/type-utilities/form`,
				component: TypeUtilitiesForm,
			},
		],
	},
	{
		name: 'Quản lý tiện ích',
		layout: '/admin',
		path: `/utilities`,
		icon: <Icon as={FaTh} width="20px" height="20px" color="inherit" />,
		component: UtilitiesManagement,
		items: [
			{
				name: 'tiện ích',
				layout: '/admin',
				path: `/utilities/form`,
				component: UtilitiesForm,
			},
		],
	},
	{
		name: 'Quản lý đăng ký tiện ích',
		layout: '/admin',
		path: `/utils-registeration`,
		icon: <Icon as={FaRegistered} width="20px" height="20px" color="inherit" />,
		component: UtilsReManagement,
		items: [
			{
				name: 'đăng ký tiện ích',
				layout: '/admin',
				path: '/utils-registeration/form',
				component: UtilsReForm,
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
