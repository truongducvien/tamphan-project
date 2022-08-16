import { FeatureModule } from 'services/role/type';
import { useAppSelector } from 'store';
import { PermistionAction } from 'variables/permission';

export const withPermission1 =
	<P,>(
		WrappedComponent: React.ComponentType<P>,
	): React.ComponentType<
		P & {
			request: FeatureModule;
		}
	> =>
	props => {
		const { info } = useAppSelector(state => state.user);
		const permission = info?.role?.privileges;
		// eslint-disable-next-line react/jsx-no-useless-fragment
		if (permission) {
			const arrayPermission = Object.keys(permission) as Array<PermistionAction>;
			console.log(arrayPermission);
		}

		return <WrappedComponent {...(props as P)} />;
	};

interface WithLoadingProps {
	request: FeatureModule;
}

const withPermission =
	<P extends object>(Component: React.ComponentType<P>): React.FC<P & WithLoadingProps> =>
	({ request, ...props }: WithLoadingProps) =>
		<Component {...(props as P)} />;
