const config = {
	prefix: 'AQACITY_PORTAL',
	accessToken: 'ACCESS_TOKEN',
	refreshToken: 'REFRESH_TOKEN',
	roleId: 'ROLE',
} as const;

/**
 * Saving data to localStorage.
 */
const saveToLocalStorage = (name: string, value: unknown) => {
	if (typeof window === 'undefined' || !window.localStorage) return;
	localStorage.setItem(`${config.prefix}:${name}`, JSON.stringify(value));
};

/**
 * Load data from localStorage.
 */
const loadFromLocalStorage = (name: string) => {
	if (typeof window === 'undefined' || !window.localStorage) return null;
	const serialized = localStorage.getItem(`${config.prefix}:${name}`);
	if (serialized === null) return null;
	return JSON.parse(serialized) as string;
};

/**
 * Remove data from localStorage.
 */
const removeFromLocalStorage = (name: string) => {
	if (typeof window === 'undefined' || !window.localStorage) return;
	localStorage.removeItem(`${config.prefix}:${name}`);
};

export const saveRole = (role: string) => saveToLocalStorage(config.roleId, role);
export const loadRole = () => loadFromLocalStorage(config.roleId);
export const clearRole = () => removeFromLocalStorage(config.roleId);

export const saveAccessToken = (accessToken: string) => saveToLocalStorage(config.accessToken, accessToken);
export const loadAccessToken = () => loadFromLocalStorage(config.accessToken);
export const clearAccessToken = () => removeFromLocalStorage(config.accessToken);

export const saveRefreshToken = (refeshToken: string) => saveToLocalStorage(config.refreshToken, refeshToken);
export const loadRefreshToken = () => loadFromLocalStorage(config.refreshToken);
export const clearRefreshToken = () => removeFromLocalStorage(config.refreshToken);

/**
 * Load data from session.
 */

const saveToSessionStorage = (name: string, value: unknown) => {
	if (typeof window === 'undefined' || !window.sessionStorage) return;
	sessionStorage.setItem(`${config.prefix}:${name}`, JSON.stringify(value));
};

/**
 * Load data from localStorage.
 */
const loadFromSessionStorage = (name: string) => {
	if (typeof window === 'undefined' || !window.sessionStorage) return null;
	const serialized = sessionStorage.getItem(`${config.prefix}:${name}`);
	if (serialized === null) return null;
	return JSON.parse(serialized) as string;
};

/**
 * Remove data from localStorage.
 */
const removeFromSessionStorage = (name: string) => {
	if (typeof window === 'undefined' || !window.sessionStorage) return;
	sessionStorage.removeItem(`${config.prefix}:${name}`);
};

export const saveSessionAccessToken = (accessToken: string) => saveToSessionStorage(config.accessToken, accessToken);
export const loadSessionAccessToken = () => loadFromSessionStorage(config.accessToken);
export const clearSessionAccessToken = () => removeFromSessionStorage(config.accessToken);

export const saveSessionRole = (role: string) => saveToSessionStorage(config.roleId, role);
export const loadSessionRole = () => loadFromSessionStorage(config.roleId);
export const clearSessionRole = () => removeFromSessionStorage(config.roleId);

export const saveSessionRefreshToken = (refeshToken: string) => saveToSessionStorage(config.refreshToken, refeshToken);
export const loadSessionRefreshToken = () => loadFromSessionStorage(config.refreshToken);
export const clearSessionRefreshToken = () => removeFromSessionStorage(config.refreshToken);
