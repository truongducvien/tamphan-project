import { useHistory, useLocation } from 'react-router-dom';

export type ActionPages = 'create' | 'edit' | 'detail';

const useActionPage = () => {
	const location = useLocation();
	const history = useHistory();
	const query = new URLSearchParams(location.search);
	const action = query.get('action');
	const actionPage = {
		create: false,
		edit: false,
		detail: false,
	};
	const changeAction = (act: ActionPages) => {
		if (act === action) return;
		query.set('action', act);
		history.push({
			pathname: !action ? `${location.pathname}/form` : location.pathname,
			search: `action=${query.get('action') || ''}`,
		});
	};

	return {
		actionPage: Object.keys(actionPage).reduce((accumulator, key) => {
			return { ...accumulator, [key]: key === action };
		}, actionPage),
		changeAction,
	};
};

export default useActionPage;
