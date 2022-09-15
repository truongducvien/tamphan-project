import { FeatureModuleKey, PermistionActionKey } from '@/services/role/type';
import { useAppSelector } from '@/store';
import { PermistionAction } from '@/variables/permission';

export const useActionPermission = (request?: FeatureModuleKey) => {
	const permistionAction: Record<PermistionActionKey, boolean> = {
		ADD: false,
		UPDATE: false,
		DELETE: false,
		VIEW: false,
		IMPORT: false,
		APPROVE: false,
		REJECT: false,
		PUBLISH: false,
	};

	const { info } = useAppSelector(state => state.user);
	if (!info || !info.role?.privileges || !request) return { permistionAction, actions: [] };
	const currentPermissions = info.role.privileges[request];
	const actions: Array<PermistionAction> = [];
	for (const iterator of Object.values(PermistionAction)) {
		if (currentPermissions.includes(iterator)) {
			permistionAction[iterator] = true;
			actions.push(iterator);
		}
	}

	return { permistionAction, actions };
};
