import React from 'react';

import { Icon } from '@chakra-ui/react';
import { FaRegistered } from 'react-icons/fa';
import {
	MdAccountBox,
	MdBrightnessAuto,
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
	MdOutlineReceiptLong,
	MdWindow,
} from 'react-icons/md';
import { FeatureModule } from 'src/services/role/type';
import { PermistionAction } from 'src/variables/permission';

const FeedbackManagement = React.lazy(() => import('./views/admin/feedback'));
const FeedbackDetail = React.lazy(() => import('./views/admin/feedback/form'));
const ResdidentAuthManagement = React.lazy(() => import('./views/admin/residentAuth'));
const ResdidentAuthReqManagement = React.lazy(() => import('./views/admin/residentAuthReq'));
const ResdidentAuthReqDetail = React.lazy(() => import('./views/admin/residentAuthReq/form'));
const HandoverBooing = React.lazy(() => import('./views/admin/handover/Booking'));
const AparmentForm = React.lazy(() => import('src/views/admin/property/form'));
const AreaManagement = React.lazy(() => import('src/views/admin/area'));
const ArticleManagement = React.lazy(() => import('src/views/admin/article'));
const ChangePass = React.lazy(() => import('src/views/auth/changePass'));
const DetailArea = React.lazy(() => import('src/views/admin/area/form'));
const DetailArticle = React.lazy(() => import('src/views/admin/article/form'));
const FacilityForm = React.lazy(() => import('src/views/admin/facility/form'));
const FacilityGroupForm = React.lazy(() => import('src/views/admin/facilityGroup/form'));
const FacilityGroupManagement = React.lazy(() => import('src/views/admin/facilityGroup'));
const FacilityManagement = React.lazy(() => import('src/views/admin/facility'));
const FacilityReForm = React.lazy(() => import('src/views/admin/facilityRegisteration/form'));
const FacilityReManagement = React.lazy(() => import('src/views/admin/facilityRegisteration'));
const OrganizationForm = React.lazy(() => import('src/views/admin/organization/form'));
const OrganizationManagement = React.lazy(() => import('src/views/admin/organization'));
const PositionForm = React.lazy(() => import('src/views/admin/role/form'));
const PropertyManagement = React.lazy(() => import('src/views/admin/property'));
const ResdidentCardManagement = React.lazy(() => import('src/views/admin/residentCard'));
const ResdidentCardReqDetail = React.lazy(() => import('src/views/admin/residentCardReq/form'));
const ResdidentCardReqManagement = React.lazy(() => import('src/views/admin/residentCardReq'));
const ResetPassword = React.lazy(() => import('src/views/auth/resetPass'));
const ResidentForm = React.lazy(() => import('src/views/admin/resident/form'));
const ResidentManagement = React.lazy(() => import('src/views/admin/resident'));
const RoleManagement = React.lazy(() => import('src/views/admin/role'));
const SignInCentered = React.lazy(() => import('src/views/auth/signIn'));
const UserManagement = React.lazy(() => import('src/views/admin/userManangement'));
const UserManagementForm = React.lazy(() => import('src/views/admin/userManangement/form'));
const HandoverManagement = React.lazy(() => import('src/views/admin/handover'));
export interface Route {
	action?: PermistionAction;
	authIcon?: string;
	category?: boolean;
	collapse?: boolean;
	component: React.ComponentType;
	icon?: React.ReactNode;
	isShow?: boolean;
	items?: Route[];
	layout: string;
	messageNavbar?: boolean;
	name: string;
	path: string;
	requirePermission?: FeatureModule;
	secondary?: boolean;
}

const routes: Route[] = [
	{
		name: 'Qu???n l?? ng?????i d??ng',
		layout: '/admin',
		path: `/users`,
		icon: <Icon as={MdManageAccounts} width="20px" height="20px" color="inherit" />,
		component: UserManagement,
		requirePermission: FeatureModule.OPERATION_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Th??m m???i ng?????i d??ng',
				layout: '/admin',
				path: `/users/form`,
				component: UserManagementForm,
				requirePermission: FeatureModule.OPERATION_MANAGEMENT,
				action: PermistionAction.ADD,
			},
			{
				name: 'Chi ti???t ng?????i d??ng',
				layout: '/admin',
				path: `/users/detail`,
				component: UserManagementForm,
				requirePermission: FeatureModule.OPERATION_MANAGEMENT,
				action: PermistionAction.VIEW,
			},
			{
				name: 'C???p nh???t ng?????i d??ng',
				layout: '/admin',
				path: `/users/edit`,
				component: UserManagementForm,
				requirePermission: FeatureModule.OPERATION_MANAGEMENT,
				action: PermistionAction.UPDATE,
			},
		],
	},
	{
		name: 'Qu???n l?? ????n v???',
		layout: '/admin',
		path: `/organization`,
		icon: <Icon as={MdOutlineMarkunreadMailbox} width="20px" height="20px" color="inherit" />,
		component: OrganizationManagement,
		requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Th??m m???i ????n v???',
				layout: '/admin',
				path: `/organization/form`,
				requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
				action: PermistionAction.ADD,
				component: OrganizationForm,
			},
			{
				name: 'Chi ti???t ????n v???',
				layout: '/admin',
				path: `/organization/detail`,
				requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
				action: PermistionAction.VIEW,
				component: OrganizationForm,
			},
			{
				name: 'C???p nh???t ????n v???',
				layout: '/admin',
				path: `/organization/edit`,
				requirePermission: FeatureModule.ORGANIZATIONS_MANAGEMENT,
				action: PermistionAction.UPDATE,
				component: OrganizationForm,
			},
		],
	},
	{
		name: 'Qu???n l?? ch???c v???',
		layout: '/admin',
		path: `/role`,
		icon: <Icon as={MdDomain} width="20px" height="20px" color="inherit" />,
		component: RoleManagement,
		requirePermission: FeatureModule.ROLE_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Th??m m???i ch???c v???',
				layout: '/admin',
				path: `/role/form`,
				requirePermission: FeatureModule.ROLE_MANAGEMENT,
				action: PermistionAction.ADD,
				component: PositionForm,
			},
			{
				name: 'C???p nh???t ch???c v???',
				layout: '/admin',
				path: `/role/edit`,
				requirePermission: FeatureModule.ROLE_MANAGEMENT,
				action: PermistionAction.UPDATE,
				component: PositionForm,
			},
			{
				name: 'Chi ti???t ch???c v???',
				layout: '/admin',
				path: `/role/detail`,
				requirePermission: FeatureModule.ROLE_MANAGEMENT,
				action: PermistionAction.VIEW,
				component: PositionForm,
			},
		],
	},
	{
		name: 'Qu???n l?? ph??n khu',
		layout: '/admin',
		path: `/area`,
		icon: <Icon as={MdWindow} width="20px" height="20px" color="inherit" />,
		component: AreaManagement,
		requirePermission: FeatureModule.AREA_MANAGEMENT,
		action: PermistionAction.VIEW,
		items: [
			{
				name: 'Th??m m???i ph??n khu',
				layout: '/admin',
				path: `/area/form`,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.AREA_MANAGEMENT,
				component: DetailArea,
			},
			{
				name: 'Chi ti???t ph??n khu',
				layout: '/admin',
				path: `/area/detail`,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.AREA_MANAGEMENT,
				component: DetailArea,
			},
			{
				name: 'C???p nh???t ph??n khu',
				layout: '/admin',
				path: `/area/edit`,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.AREA_MANAGEMENT,
				component: DetailArea,
			},
		],
	},
	{
		name: 'Qu???n l?? c??n h???',
		layout: '/admin',
		path: `/property`,
		icon: <Icon as={MdHouse} width="20px" height="20px" color="inherit" />,
		component: PropertyManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
		items: [
			{
				name: 'Th??m m???i c??n h???',
				layout: '/admin',
				path: `/property/form`,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
				component: AparmentForm,
			},
			{
				name: 'Chi ti???t c??n h???',
				layout: '/admin',
				path: `/property/detail`,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
				component: AparmentForm,
			},
			{
				name: 'C???p nh???t c??n h???',
				layout: '/admin',
				path: `/property/edit`,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.PROPERTIES_MANAGEMENT,
				component: AparmentForm,
			},
		],
	},
	{
		name: 'Qu???n l?? c?? d??n',
		layout: '/admin',
		path: `/resident`,
		icon: <Icon as={MdAccountBox} width="20px" height="20px" color="inherit" />,
		component: ResidentManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.RESIDENT_MANAGEMENT,
		items: [
			{
				name: 'Th??m m???i c?? d??n',
				layout: '/admin',
				path: `/resident/form`,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.RESIDENT_MANAGEMENT,
				component: ResidentForm,
			},
			{
				name: 'Chi ti???t c?? d??n',
				layout: '/admin',
				path: `/resident/detail`,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.RESIDENT_MANAGEMENT,
				component: ResidentForm,
			},
			{
				name: 'C???p nh???t c?? d??n',
				layout: '/admin',
				path: `/resident/edit`,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.RESIDENT_MANAGEMENT,
				component: ResidentForm,
			},
		],
	},

	{
		name: 'Qu???n l?? lo???i ti???n ??ch',
		layout: '/admin',
		path: `/facility-group`,
		icon: <Icon as={MdFactCheck} width="20px" height="20px" color="inherit" />,
		component: FacilityGroupManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
		items: [
			{
				name: 'Th??m m???i lo???i ti???n ??ch',
				layout: '/admin',
				path: `/facility-group/form`,
				component: FacilityGroupForm,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
			},
			{
				name: 'Chi ti???t lo???i ti???n ??ch',
				layout: '/admin',
				path: `/facility-group/detail`,
				component: FacilityGroupForm,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
			},
			{
				name: 'C???p nh???t lo???i ti???n ??ch',
				layout: '/admin',
				path: `/facility-group/edit`,
				component: FacilityGroupForm,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.FACILITY_GROUP_MANAGEMENT,
			},
		],
	},
	{
		name: 'Qu???n l?? ti???n ??ch',
		layout: '/admin',
		path: `/facility`,
		icon: <Icon as={MdDeck} width="20px" height="20px" color="inherit" />,
		component: FacilityManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.FACILITY_MANAGEMENT,
		items: [
			{
				name: 'Th??m m???i ti???n ??ch',
				layout: '/admin',
				path: `/facility/form`,
				component: FacilityForm,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.FACILITY_MANAGEMENT,
			},
			{
				name: 'Chi ti???t ti???n ??ch',
				layout: '/admin',
				path: `/facility/detail`,
				component: FacilityForm,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.FACILITY_MANAGEMENT,
			},
			{
				name: 'C???p nh???t ti???n ??ch',
				layout: '/admin',
				path: `/facility/edit`,
				component: FacilityForm,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.FACILITY_MANAGEMENT,
			},
		],
	},
	{
		name: 'Qu???n l?? ????ng k?? ti???n ??ch',
		layout: '/admin',
		path: `/facility-registeration`,
		icon: <Icon as={FaRegistered} width="20px" height="20px" color="inherit" />,
		component: FacilityReManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.FACILITY_BOOKING_MANAGEMENT,
		items: [
			{
				name: 'Chi ti???t ????ng k?? ti???n ??ch',
				layout: '/admin',
				path: '/facility-registeration/detail',
				component: FacilityReForm,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.FACILITY_BOOKING_MANAGEMENT,
			},
		],
	},
	{
		name: 'Qu???n l?? b??i vi???t',
		layout: '/admin',
		path: `/article`,
		icon: <Icon as={MdOutlineArticle} width="20px" height="20px" color="inherit" />,
		component: ArticleManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.ARTICLE_MANAGEMENT,
		items: [
			{
				name: 'Th??m m???i b??i vi???t',
				layout: '/admin',
				path: '/article/form',
				component: DetailArticle,
				action: PermistionAction.ADD,
				requirePermission: FeatureModule.ARTICLE_MANAGEMENT,
			},
			{
				name: 'Chi ti???t b??i vi???t',
				layout: '/admin',
				path: '/article/detail',
				component: DetailArticle,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.ARTICLE_MANAGEMENT,
			},
			{
				name: 'C???p nh???t b??i vi???t',
				layout: '/admin',
				path: '/article/edit',
				component: DetailArticle,
				action: PermistionAction.UPDATE,
				requirePermission: FeatureModule.ARTICLE_MANAGEMENT,
			},
		],
	},
	{
		name: 'Qu???n l?? th??? c?? d??n',
		layout: '/admin',
		path: `/resident-card`,
		icon: <Icon as={MdCreditCard} width="20px" height="20px" color="inherit" />,
		component: ResdidentCardManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.RESIDENT_CARD_MANAGEMENT,
	},
	{
		name: 'Qu???n l?? y??u c???u th??? c?? d??n',
		layout: '/admin',
		path: `/resident-card-request`,
		icon: <Icon as={MdCreditCardOff} width="20px" height="20px" color="inherit" />,
		component: ResdidentCardReqManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.RESIDENT_CARD_REQUEST_MANAGEMENT,
		items: [
			{
				name: 'Chi ti???t y??u c???u th??? c?? d??n',
				layout: '/admin',
				path: '/resident-card-request/detail',
				component: ResdidentCardReqDetail,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.RESIDENT_CARD_REQUEST_MANAGEMENT,
			},
		],
	},
	{
		name: 'Qu???n l?? t??i s???n b??n giao',
		layout: '/admin',
		path: `/handover`,
		icon: <Icon as={MdOutlineReceiptLong} width="20px" height="20px" color="inherit" />,
		component: HandoverManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.HANOVER_MANAGEMENT,
		items: [
			{
				name: 'Danh s??ch ?????t l???ch b??n giao',
				layout: '/admin',
				path: '/handover/booking',
				component: HandoverBooing,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.HANOVER_BOOKING_MANAGEMENT,
			},
		],
	},
	{
		name: 'Qu???n l?? u??? quy???n',
		layout: '/admin',
		path: `/resident-authorization-request`,
		icon: <Icon as={MdBrightnessAuto} width="20px" height="20px" color="inherit" />,
		component: ResdidentAuthReqManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.AUTHORIZATION_REQUEST_MANAGEMENT,
		items: [
			{
				name: 'Chi ti???t y??u c???u u??? quy???n',
				layout: '/admin',
				path: '/resident-authorization-request/detail',
				component: ResdidentAuthReqDetail,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.AUTHORIZATION_REQUEST_MANAGEMENT,
			},
			{
				name: 'Danh s??ch u??? quy???n',
				layout: '/admin',
				path: `/resident-authorization-request/authorization`,
				component: ResdidentAuthManagement,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.AUTHORIZATION_MANAGEMENT,
			},
		],
	},
	{
		name: 'Qu???n l?? ph???n ??nh',
		layout: '/admin',
		path: `/reports`,
		icon: <Icon as={MdBrightnessAuto} width="20px" height="20px" color="inherit" />,
		component: FeedbackManagement,
		action: PermistionAction.VIEW,
		requirePermission: FeatureModule.AUTHORIZATION_REQUEST_MANAGEMENT,
		items: [
			{
				name: 'Chi ti???t ph???n ??nh',
				layout: '/admin',
				path: '/reports/detail',
				component: FeedbackDetail,
				action: PermistionAction.VIEW,
				requirePermission: FeatureModule.AUTHORIZATION_REQUEST_MANAGEMENT,
			},
		],
	},
	{
		name: '????ng nh???p',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
		component: SignInCentered,
		isShow: false,
	},
	{
		name: 'Qu??n m???t kh???u',
		layout: '/auth',
		path: '/forgot-password',
		icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
		component: ResetPassword,
		isShow: false,
	},
	{
		name: '?????i m???t kh???u',
		layout: '/auth',
		path: '/change-password',
		icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
		component: ChangePass,
		isShow: false,
	},
];

export default routes;
