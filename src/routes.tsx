import React from 'react';

import { Icon } from '@chakra-ui/react';
import { FaRegistered } from 'react-icons/fa';
import {
	MdAccountBox,
	MdCreditCard,
	MdCreditCardOff,
	MdDeck,
	MdDomain,
	MdFactCheck,
	MdHouse,
	MdLock,
	MdManageAccounts,
	MdOutlineArticle,
	MdOutlineMarkunreadMailbox,
	MdWindow,
} from 'react-icons/md';
import { FeatureModule } from 'services/role/type';
import { PermistionAction } from 'variables/permission';
import ApartMentManagement from 'views/admin/apartment';
import AparmentForm from 'views/admin/apartment/form';
import ArticleManagement from 'views/admin/article';
import DetailArticle from 'views/admin/article/form';
import OfficeManagement from 'views/admin/office';
import OfficeForm from 'views/admin/office/form';
import PositionManagement from 'views/admin/position';
import PositionForm from 'views/admin/position/form';
import ResidentManagement from 'views/admin/resident';
import ResidentForm from 'views/admin/resident/form';
import ResdidentCardManagement from 'views/admin/residentCard';
import ResdidentCardReqManagement from 'views/admin/residentCardReq';
import ResdidentCardReqDetail from 'views/admin/residentCardReq/form';
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
	action?: PermistionAction;
	requirePermission?: FeatureModule;
}

const routes: Route[] = [
	{
		name: 'Quản lý người dùng',
		layout: '/admin',
		path: `/users`,
		icon: <Icon as={MdManageAccounts} width="20px" height="20px" color="inherit" />,
		component: UserManagement,
		requirePermission: FeatureModule.OPERATION_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Thêm mới người dùng',
				layout: '/admin',
				path: `/users/form`,
				component: UserManagementForm,
				requirePermission: FeatureModule.OPERATION_MANAGEMENT,
				action: PermistionAction.ADD,
			},
			{
				name: 'Chi tiết người dùng',
				layout: '/admin',
				path: `/users/detail`,
				component: UserManagementForm,
				requirePermission: FeatureModule.OPERATION_MANAGEMENT,
				action: PermistionAction.VIEW,
			},
			{
				name: 'Cập nhật người dùng',
				layout: '/admin',
				path: `/users/edit`,
				component: UserManagementForm,
				requirePermission: FeatureModule.OPERATION_MANAGEMENT,
				action: PermistionAction.UPDATE,
			},
		],
	},
	{
		name: 'Quản lý đơn vị',
		layout: '/admin',
		path: `/office`,
		icon: <Icon as={MdOutlineMarkunreadMailbox} width="20px" height="20px" color="inherit" />,
		component: OfficeManagement,
		requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Quản lí đơn vị',
				layout: '/admin',
				path: `/office/form`,
				requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
				action: PermistionAction.ADD,
				component: OfficeForm,
			},
			{
				name: 'Chi tiết đơn vị',
				layout: '/admin',
				path: `/office/detail`,
				requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
				action: PermistionAction.VIEW,
				component: OfficeForm,
			},
			{
				name: 'Cập nhật đơn vị',
				layout: '/admin',
				path: `/office/edit`,
				requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
				action: PermistionAction.UPDATE,
				component: OfficeForm,
			},
		],
	},
	{
		name: 'Quản lý chức vụ',
		layout: '/admin',
		path: `/position`,
		icon: <Icon as={MdDomain} width="20px" height="20px" color="inherit" />,
		component: PositionManagement,
		requirePermission: FeatureModule.ROLE_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Thêm mới chức vụ',
				layout: '/admin',
				path: `/position/form`,
				requirePermission: FeatureModule.ROLE_MANAGEMENT,
				action: PermistionAction.ADD,
				component: PositionForm,
			},
			{
				name: 'Cập nhật chức vụ',
				layout: '/admin',
				path: `/position/edit`,
				requirePermission: FeatureModule.ROLE_MANAGEMENT,
				action: PermistionAction.UPDATE,
				component: PositionForm,
			},
			{
				name: 'Chi tiết chức vụ',
				layout: '/admin',
				path: `/position/detail`,
				requirePermission: FeatureModule.ROLE_MANAGEMENT,
				action: PermistionAction.VIEW,
				component: PositionForm,
			},
		],
	},
	{
		name: 'Quản lý phân khu',
		layout: '/admin',
		path: `/subdivision`,
		icon: <Icon as={MdWindow} width="20px" height="20px" color="inherit" />,
		component: SubdivisionManagement,
		requirePermission: FeatureModule.AREA_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Thêm mới phân khu',
				layout: '/admin',
				path: `/subdivision/form`,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.AREA_MANAGEMENT,
				component: DetailSubdivision,
			},
			{
				name: 'Chi tiết phân khu',
				layout: '/admin',
				path: `/subdivision/detail`,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.AREA_MANAGEMENT,
				component: DetailSubdivision,
			},
			{
				name: 'Cập nhật phân khu',
				layout: '/admin',
				path: `/subdivision/edit`,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.AREA_MANAGEMENT,
				component: DetailSubdivision,
			},
		],
	},
	{
		name: 'Quản lý căn hộ',
		layout: '/admin',
		path: `/apartment`,
		icon: <Icon as={MdHouse} width="20px" height="20px" color="inherit" />,
		component: ApartMentManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
		items: [
			{
				name: 'Thêm mới căn hộ',
				layout: '/admin',
				path: `/apartment/form`,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
				component: AparmentForm,
			},
			{
				name: 'Chi tiết căn hộ',
				layout: '/admin',
				path: `/apartment/detail`,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
				component: AparmentForm,
			},
			{
				name: 'Cập nhật căn hộ',
				layout: '/admin',
				path: `/apartment/edit`,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
				component: AparmentForm,
			},
		],
	},
	{
		name: 'Quản lý cư dân',
		layout: '/admin',
		path: `/resident`,
		icon: <Icon as={MdAccountBox} width="20px" height="20px" color="inherit" />,
		component: ResidentManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.RESIDENT_MANAGEMENT,
		items: [
			{
				name: 'Thêm mới cư dân',
				layout: '/admin',
				path: `/resident/form`,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.RESIDENT_MANAGEMENT,
				component: ResidentForm,
			},
			{
				name: 'Chi tiết cư dân',
				layout: '/admin',
				path: `/resident/detail`,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.RESIDENT_MANAGEMENT,
				component: ResidentForm,
			},
			{
				name: 'Cập nhật cư dân',
				layout: '/admin',
				path: `/resident/edit`,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.RESIDENT_MANAGEMENT,
				component: ResidentForm,
			},
		],
	},

	{
		name: 'Quản lý loại tiện ích',
		layout: '/admin',
		path: `/type-utilities`,
		icon: <Icon as={MdFactCheck} width="20px" height="20px" color="inherit" />,
		component: TypeUtilitiesManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
		items: [
			{
				name: 'Thêm mới loại tiện ích',
				layout: '/admin',
				path: `/type-utilities/form`,
				component: TypeUtilitiesForm,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
			},
			{
				name: 'Chi tiết loại tiện ích',
				layout: '/admin',
				path: `/type-utilities/detail`,
				component: TypeUtilitiesForm,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
			},
			{
				name: 'Cập nhật loại tiện ích',
				layout: '/admin',
				path: `/type-utilities/edit`,
				component: TypeUtilitiesForm,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
			},
		],
	},
	{
		name: 'Quản lý tiện ích',
		layout: '/admin',
		path: `/utilities`,
		icon: <Icon as={MdDeck} width="20px" height="20px" color="inherit" />,
		component: UtilitiesManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.FACILITY_MANAGEMENT,
		items: [
			{
				name: 'Thêm mới tiện ích',
				layout: '/admin',
				path: `/utilities/form`,
				component: UtilitiesForm,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.FACILITY_MANAGEMENT,
			},
			{
				name: 'Chi tiết tiện ích',
				layout: '/admin',
				path: `/utilities/detail`,
				component: UtilitiesForm,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.FACILITY_MANAGEMENT,
			},
			{
				name: 'Cập nhật tiện ích',
				layout: '/admin',
				path: `/utilities/edit`,
				component: UtilitiesForm,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.FACILITY_MANAGEMENT,
			},
		],
	},
	{
		name: 'Quản lý đăng ký tiện ích',
		layout: '/admin',
		path: `/utils-registeration`,
		icon: <Icon as={FaRegistered} width="20px" height="20px" color="inherit" />,
		component: UtilsReManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.FACILITY_BOOKING_MANAGEMENT,
		items: [
			{
				name: 'Chi tiết đăng ký tiện ích',
				layout: '/admin',
				path: '/utils-registeration/detail',
				component: UtilsReForm,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.FACILITY_BOOKING_MANAGEMENT,
			},
		],
	},
	{
		name: 'Quản lý bài viết',
		layout: '/admin',
		path: `/article`,
		icon: <Icon as={MdOutlineArticle} width="20px" height="20px" color="inherit" />,
		component: ArticleManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.ARTICLE_MANAGEMENT,
		items: [
			{
				name: 'Thêm mới bài viết',
				layout: '/admin',
				path: '/article/form',
				component: DetailArticle,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.ARTICLE_MANAGEMENT,
			},
			{
				name: 'Chi tiết bài viết',
				layout: '/admin',
				path: '/article/detail',
				component: DetailArticle,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.ARTICLE_MANAGEMENT,
			},
			{
				name: 'Cập nhật bài viết',
				layout: '/admin',
				path: '/article/edit',
				component: DetailArticle,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.ARTICLE_MANAGEMENT,
			},
		],
	},
	{
		name: 'Quản lý thẻ cư dân',
		layout: '/admin',
		path: `/resident-card`,
		icon: <Icon as={MdCreditCard} width="20px" height="20px" color="inherit" />,
		component: ResdidentCardManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.RESIDENT_CARD_MANAGEMENT,
	},
	{
		name: 'Quản lý yêu cầu thẻ cư dân',
		layout: '/admin',
		path: `/resident-card-request`,
		icon: <Icon as={MdCreditCardOff} width="20px" height="20px" color="inherit" />,
		component: ResdidentCardReqManagement,
		action: PermistionAction.VIEW,
		// TODO: replace this permission
		requirePermission: FeatureModule.RESIDENT_CARD_MANAGEMENT,
		items: [
			{
				name: 'Chi tiết yêu cầu thẻ cư dân',
				layout: '/admin',
				path: '/resident-card-request/detail',
				component: ResdidentCardReqDetail,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.RESIDENT_CARD_MANAGEMENT,
			},
		],
	},
	{
		name: 'Sign In',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
		component: SignInCentered,
		isShow: false,
	},
];

export default routes;
