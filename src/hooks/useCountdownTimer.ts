import { useState, useEffect } from 'react';

export const useCountdownTimer = ({ initialMinute = 0, initialSeconds = 0, pause = false }) => {
	const [minutes, setMinutes] = useState(initialMinute);
	const [seconds, setSeconds] = useState(initialSeconds);

	useEffect(() => {
		if (pause) return;
		const myInterval = setInterval(() => {
			if (seconds > 0) {
				setSeconds(seconds - 1);
			}
			if (seconds === 0) {
				if (minutes === 0) {
					clearInterval(myInterval);
				} else {
					setMinutes(minutes - 1);
					setSeconds(59);
				}
			}
		}, 1000);
		// eslint-disable-next-line consistent-return
		return () => {
			clearInterval(myInterval);
		};
	}, [pause, minutes, seconds]);

	return {
		minutes: `${minutes < 10 ? '0' : ''}${minutes}`,
		seconds: `${seconds < 10 ? '0' : ''}${seconds}`,
		isDown: minutes === 0 && seconds === 0,
		setMinutes,
		setSeconds,
	};
};
