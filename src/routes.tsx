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
		name: 'Quản lí người dùng',
		layout: '/admin',
		path: `/users`,
		icon: <Icon as={FaUserAlt} width="20px" height="20px" color="inherit" />,
		component: UserManagement,
		items: [
			{
				name: 'Thêm mới người dùng',
				layout: '/admin',
				path: `/users/form`,
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
				path: `/office/form`,
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
				path: `/position/form`,
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
				path: `/subdivision/form`,
				component: DetailSubdivision,
			},
		],
	},
	{
		name: 'Quản lí căn hộ',
		layout: '/admin',
		path: `/apartment`,
		icon: <Icon as={FaMicrosoft} width="20px" height="20px" color="inherit" />,
		component: ApartMentManagement,
		items: [
			{
				name: 'Thêm mới căn hộ',
				layout: '/admin',
				path: `/apartment/form`,
				component: AparmentForm,
			},
		],
	},
	{
		name: 'Quản lí cư dân',
		layout: '/admin',
		path: `/resident`,
		icon: <Icon as={FaMicrosoft} width="20px" height="20px" color="inherit" />,
		component: ResidentManagement,
		items: [
			{
				name: 'Thêm mới cư dân',
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
		name: 'Quản lí loại tiện ích',
		layout: '/admin',
		path: `/type-utilities`,
		icon: <Icon as={FaClipboardList} width="20px" height="20px" color="inherit" />,
		component: TypeUtilitiesManagement,
		items: [
			{
				name: 'Thêm mới loại tiện ích',
				layout: '/admin',
				path: `/type-utilities/form`,
				component: TypeUtilitiesForm,
			},
		],
	},
	{
		name: 'Quản lí tiện ích',
		layout: '/admin',
		path: `/utilities`,
		icon: <Icon as={FaTh} width="20px" height="20px" color="inherit" />,
		component: UtilitiesManagement,
		items: [
			{
				name: 'Thêm mới tiện ích',
				layout: '/admin',
				path: `/utilities/form`,
				component: UtilitiesForm,
			},
		],
	},
	{
		name: 'Quản lí đăng kí tiện ích',
		layout: '/admin',
		path: `/utils-registeration`,
		icon: <Icon as={FaRegistered} width="20px" height="20px" color="inherit" />,
		component: UtilsReManagement,
		items: [
			{
				name: 'Thông tin Đăng kí tiện ích',
				layout: '/admin',
				path: '/utils-registeration/:id',
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
