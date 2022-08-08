import { useHistory, useLocation } from 'react-router-dom';

export type ActionPages = 'create' | 'edit' | 'detail';

const useActionPage = () => {
	const location = useLocation();
	const history = useHistory();
	const query = new URLSearchParams(location.search);
	const action = query.get('action') as ActionPages;
	const id = query.get('id');
	const actionPage = {
		create: false,
		edit: false,
		detail: false,
	};

	const changeAction = (act: ActionPages, i?: string, navigate = true) => {
		if (act === action) return;
		query.set('action', act);

		history.push({
			pathname: navigate ? `${location.pathname}/form` : location.pathname,
			search: i ? `id=${i}&action=${query.get('action') || ''}` : `action=${query.get('action') || ''}`,
		});
	};

	return {
		actionPage: Object.keys(actionPage).reduce((accumulator, key) => {
			return { ...accumulator, [key]: key === action };
		}, actionPage),
		changeAction,
		id,
		action,
	};
};

export default useActionPage;
