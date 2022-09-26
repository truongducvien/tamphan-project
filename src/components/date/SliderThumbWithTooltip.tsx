import React from 'react';

import {
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
	Tooltip,
	SliderProps,
} from '@chakra-ui/react';

export interface Props extends SliderProps {
	mark?: Array<number>;
}

export const SliderThumbWithTooltip: React.FC<Props> = ({
	mark,
	onChange,
	onMouseEnter,
	onMouseLeave,
	colorScheme = 'teal',
	id = 'slider',

	...innerProps
}) => {
	const [sliderValue, setSliderValue] = React.useState(innerProps.defaultValue);
	const [showTooltip, setShowTooltip] = React.useState(false);
	return (
		<Slider
			id={id}
			colorScheme={colorScheme}
			onChange={v => {
				setSliderValue(v);
				onChange?.(v);
			}}
			onMouseEnter={e => {
				setShowTooltip(true);
				onMouseEnter?.(e);
			}}
			onMouseLeave={e => {
				setShowTooltip(false);
				onMouseLeave?.(e);
			}}
			{...innerProps}
		>
			{mark &&
				mark.map(i => (
					<SliderMark value={i} mt="1" ml="-2.5" fontSize="sm">
						{i}
					</SliderMark>
				))}
			<SliderTrack>
				<SliderFilledTrack />
			</SliderTrack>
			<Tooltip hasArrow bg="teal.500" color="white" placement="top" isOpen={showTooltip} label={sliderValue}>
				<SliderThumb />
			</Tooltip>
		</Slider>
	);
};
