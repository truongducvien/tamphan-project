import { useEffect, useRef } from 'react';

import useDidMount from './useDidMount';

const useEffectWithoutMounted = (cb: () => void, deps?: unknown[]) => {
	const firstRender = useRef<boolean>(true);

	useEffect(() => {
		if (firstRender.current) return;
		cb();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	useDidMount(() => {
		firstRender.current = false;
	});
};

export default useEffectWithoutMounted;
