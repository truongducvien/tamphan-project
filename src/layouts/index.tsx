import useDidMount from 'src/hooks/useDidMount';
import { useAppDispatch } from 'src/store';
import { initialUser } from 'src/store/actionCreators';

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
