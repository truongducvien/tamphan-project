import { extendTheme } from '@chakra-ui/react';

import { CardComponent } from './additions/card/card';
import { badgeStyles } from './components/badge';
import { buttonStyles } from './components/button';
import { headingStyles } from './components/heading';
import { inputStyles } from './components/input';
import { linkStyles } from './components/link';
import { progressStyles } from './components/progress';
import { sliderStyles } from './components/slider';
import { switchStyles } from './components/switch';
import { textareaStyles } from './components/textarea';
import { breakpoints } from './foundations/breakpoints';
import { globalStyles } from './styles';

const theme = extendTheme(
	{ breakpoints },
	globalStyles,
	badgeStyles,
	buttonStyles,
	linkStyles,
	headingStyles,
	progressStyles,
	sliderStyles,
	inputStyles,
	textareaStyles,
	switchStyles,
	CardComponent,
);

export default theme;
