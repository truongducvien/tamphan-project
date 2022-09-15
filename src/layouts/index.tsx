import useDidMount from '@/hooks/useDidMount';
import { useAppDispatch } from '@/store';
import { initialUser } from '@/store/actionCreators';

export const InitialApp: React.FC = () => {
	document.addEventListener('wheel', () => {
		const numberInput = document.activeElement as HTMLInputElement;
		if (numberInput?.type === 'number') {
			numberInput.blur();
		}
	});

	const dispatch = useAppDispatch();
	useDidMount(() => {
		dispatch(initialUser());
	});
	return null;
};
