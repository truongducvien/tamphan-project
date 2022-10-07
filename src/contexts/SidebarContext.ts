import { createContext, Dispatch, SetStateAction } from 'react';

export const SidebarContext = createContext<{
	toggleSidebar: boolean;
	sidebarWidth?: string;
	setToggleSidebar?: Dispatch<SetStateAction<boolean>>;
}>({
	sidebarWidth: '100',
	toggleSidebar: true,
	setToggleSidebar: () => null,
});
