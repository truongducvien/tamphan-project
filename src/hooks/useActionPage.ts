import { useMemo } from 'react';

import { useHistory, useLocation } from 'react-router-dom';

export type ActionPages = 'create' | 'edit' | 'detail';

const useActionPage = () => {
	const location = useLocation();
	const history = useHistory();
	const query = new URLSearchParams(location.search);
	const { pathname } = location;

	const action: ActionPages | null = useMemo(() => {
		const isDetail = pathname.includes('/detail');
		const isCreate = pathname.includes('/form');
		const isEdit = pathname.includes('/edit');
		if (query.get('action') === 'edit' || isEdit) return 'edit';
		if (isDetail) return 'detail';
		if (isCreate) return 'create';
		return null;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const id = query.get('id');
	const actionPage = {
		create: false,
		edit: false,
		detail: false,
	};

	const changeAction = (act: ActionPages, i?: string) => {
		if (act === action) return;
		switch (act) {
			case 'create':
				history.push({
					pathname: `${location.pathname}/form`,
				});
				break;
			case 'detail':
				history.push({
					pathname: `${location.pathname}/detail`,
					search: i ? `id=${i}` : '',
				});
				break;
			case 'edit':
				if (action !== 'detail') {
					history.push({
						pathname: `${location.pathname}/edit`,
						search: i ? `id=${i}` : ``,
					});
				} else {
					history.replace({
						pathname: location.pathname,
						search: i ? `id=${i}&action=edit` : ``,
					});
				}
				break;
			default:
				break;
		}
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
