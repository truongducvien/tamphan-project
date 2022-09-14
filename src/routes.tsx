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
import AreaManagement from 'views/admin/area';
import DetailArea from 'views/admin/area/form';
import ArticleManagement from 'views/admin/article';
import DetailArticle from 'views/admin/article/form';
import FacilityManagement from 'views/admin/facility';
import FacilityForm from 'views/admin/facility/form';
import FacilityGroupManagement from 'views/admin/facilityGroup';
import FacilityGroupForm from 'views/admin/facilityGroup/form';
import FacilityReManagement from 'views/admin/facilityRegisteration';
import FacilityReForm from 'views/admin/facilityRegisteration/form';
import OrganizationManagement from 'views/admin/organization';
import OrganizationForm from 'views/admin/organization/form';
import PropertyManagement from 'views/admin/property';
import AparmentForm from 'views/admin/property/form';
import ResidentManagement from 'views/admin/resident';
import ResidentForm from 'views/admin/resident/form';
import ResdidentCardManagement from 'views/admin/residentCard';
import ResdidentCardReqManagement from 'views/admin/residentCardReq';
import ResdidentCardReqDetail from 'views/admin/residentCardReq/form';
import RoleManagement from 'views/admin/role';
import PositionForm from 'views/admin/role/form';
import UserManagement from 'views/admin/userManangement';
import UserManagementForm from 'views/admin/userManangement/form';
import { ChangePass } from 'views/auth/changePass';
import { ResetPassword } from 'views/auth/resetPass';
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
		path: `/organization`,
		icon: <Icon as={MdOutlineMarkunreadMailbox} width="20px" height="20px" color="inherit" />,
		component: OrganizationManagement,
		requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Quản lí đơn vị',
				layout: '/admin',
				path: `/organization/form`,
				requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
				action: PermistionAction.ADD,
				component: OrganizationForm,
			},
			{
				name: 'Chi tiết đơn vị',
				layout: '/admin',
				path: `/organization/detail`,
				requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
				action: PermistionAction.VIEW,
				component: OrganizationForm,
			},
			{
				name: 'Cập nhật đơn vị',
				layout: '/admin',
				path: `/organization/edit`,
				requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
				action: PermistionAction.UPDATE,
				component: OrganizationForm,
			},
		],
	},
	{
		name: 'Quản lý chức vụ',
		layout: '/admin',
		path: `/role`,
		icon: <Icon as={MdDomain} width="20px" height="20px" color="inherit" />,
		component: RoleManagement,
		requirePermission: FeatureModule.ROLE_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Thêm mới chức vụ',
				layout: '/admin',
				path: `/role/form`,
				requirePermission: FeatureModule.ROLE_MANAGEMENT,
				action: PermistionAction.ADD,
				component: PositionForm,
			},
			{
				name: 'Cập nhật chức vụ',
				layout: '/admin',
				path: `/role/edit`,
				requirePermission: FeatureModule.ROLE_MANAGEMENT,
				action: PermistionAction.UPDATE,
				component: PositionForm,
			},
			{
				name: 'Chi tiết chức vụ',
				layout: '/admin',
				path: `/role/detail`,
				requirePermission: FeatureModule.ROLE_MANAGEMENT,
				action: PermistionAction.VIEW,
				component: PositionForm,
			},
		],
	},
	{
		name: 'Quản lý phân khu',
		layout: '/admin',
		path: `/area`,
		icon: <Icon as={MdWindow} width="20px" height="20px" color="inherit" />,
		component: AreaManagement,
		requirePermission: FeatureModule.AREA_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Thêm mới phân khu',
				layout: '/admin',
				path: `/area/form`,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.AREA_MANAGEMENT,
				component: DetailArea,
			},
			{
				name: 'Chi tiết phân khu',
				layout: '/admin',
				path: `/area/detail`,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.AREA_MANAGEMENT,
				component: DetailArea,
			},
			{
				name: 'Cập nhật phân khu',
				layout: '/admin',
				path: `/area/edit`,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.AREA_MANAGEMENT,
				component: DetailArea,
			},
		],
	},
	{
		name: 'Quản lý căn hộ',
		layout: '/admin',
		path: `/property`,
		icon: <Icon as={MdHouse} width="20px" height="20px" color="inherit" />,
		component: PropertyManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
		items: [
			{
				name: 'Thêm mới căn hộ',
				layout: '/admin',
				path: `/property/form`,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
				component: AparmentForm,
			},
			{
				name: 'Chi tiết căn hộ',
				layout: '/admin',
				path: `/property/detail`,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
				component: AparmentForm,
			},
			{
				name: 'Cập nhật căn hộ',
				layout: '/admin',
				path: `/property/edit`,
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
		path: `/facility-group`,
		icon: <Icon as={MdFactCheck} width="20px" height="20px" color="inherit" />,
		component: FacilityGroupManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
		items: [
			{
				name: 'Thêm mới loại tiện ích',
				layout: '/admin',
				path: `/facility-group/form`,
				component: FacilityGroupForm,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
			},
			{
				name: 'Chi tiết loại tiện ích',
				layout: '/admin',
				path: `/facility-group/detail`,
				component: FacilityGroupForm,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
			},
			{
				name: 'Cập nhật loại tiện ích',
				layout: '/admin',
				path: `/facility-group/edit`,
				component: FacilityGroupForm,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
			},
		],
	},
	{
		name: 'Quản lý tiện ích',
		layout: '/admin',
		path: `/facility`,
		icon: <Icon as={MdDeck} width="20px" height="20px" color="inherit" />,
		component: FacilityManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.FACILITY_MANAGEMENT,
		items: [
			{
				name: 'Thêm mới tiện ích',
				layout: '/admin',
				path: `/facility/form`,
				component: FacilityForm,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.FACILITY_MANAGEMENT,
			},
			{
				name: 'Chi tiết tiện ích',
				layout: '/admin',
				path: `/facility/detail`,
				component: FacilityForm,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.FACILITY_MANAGEMENT,
			},
			{
				name: 'Cập nhật tiện ích',
				layout: '/admin',
				path: `/facility/edit`,
				component: FacilityForm,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.FACILITY_MANAGEMENT,
			},
		],
	},
	{
		name: 'Quản lý đăng ký tiện ích',
		layout: '/admin',
		path: `/facility-registeration`,
		icon: <Icon as={FaRegistered} width="20px" height="20px" color="inherit" />,
		component: FacilityReManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.FACILITY_BOOKING_MANAGEMENT,
		items: [
			{
				name: 'Chi tiết đăng ký tiện ích',
				layout: '/admin',
				path: '/facility-registeration/detail',
				component: FacilityReForm,
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
		requirePermission: FeatureModule.RESIDENT_CARD_REQUEST_MANAGEMENT,
		items: [
			{
				name: 'Chi tiết yêu cầu thẻ cư dân',
				layout: '/admin',
				path: '/resident-card-request/detail',
				component: ResdidentCardReqDetail,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.RESIDENT_CARD_REQUEST_MANAGEMENT,
			},
		],
	},
	{
		name: 'Đăng nhập',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
		component: SignInCentered,
		isShow: false,
	},
	{
		name: 'Quên mật khẩu',
		layout: '/auth',
		path: '/forgot-password',
		icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
		component: ResetPassword,
		isShow: false,
	},
	{
		name: 'Đổi mật khẩu',
		layout: '/auth',
		path: '/change-password',
		icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
		component: ChangePass,
		isShow: false,
	},
];

export default routes;
