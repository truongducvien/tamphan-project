import useDidMount from 'hooks/useDidMount';
import { useAppDispatch } from 'store';
import { initialUser } from 'store/actionCreators';

export const InitialApp: React.FC = () => {
	const dispatch = useAppDispatch();
	useDidMount(() => {
		dispatch(initialUser());
	});
	return null;
};
