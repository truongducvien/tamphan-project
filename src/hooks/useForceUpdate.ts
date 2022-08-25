import { useCallback, useState } from 'react';

export const useForceUpdate = () => {
	const [, setForceUpdate] = useState({});

	const update = useCallback(() => {
		setForceUpdate({});
	}, []);

	return update;
};
