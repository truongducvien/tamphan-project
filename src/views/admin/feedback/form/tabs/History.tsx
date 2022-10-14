import React from 'react';

import { Box, Center, Heading, Text } from '@chakra-ui/react';
import Table, { IColumn } from 'src/components/table';
import { FeedbackHistories, feedbackHistoryAction } from 'src/services/feedback/type';

import { useFeedbackState } from '../context';

const HistoryTab: React.FC = () => {
	const { feedbackData, loading } = useFeedbackState();
	const { feedbackHistories } = feedbackData || {};
	const COLUMNS: Array<IColumn<FeedbackHistories>> = [
		{ key: 'action', label: 'Thao tác', tag: ({ action }) => feedbackHistoryAction.find(i => i.value === action) },
		{ key: 'fullName', label: 'Người thao tác' },
		{ key: 'modifiedAt', label: 'Thời gian thao tác', dateFormat: 'DD/MM/YYYY' },
		{
			key: 'note',
			label: 'Nội dung',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ note }) => (
				<Text fontWeight={700} maxH={50} textOverflow="ellipsis">
					{note}
				</Text>
			),
		},
	];
	return (
		<Box pt="10px">
			<Center mb={5}>
				<Heading as="h6" variant="admin" size="md">
					Danh sách công việc
				</Heading>
			</Center>
			<Table loading={loading} testId="consignments-dashboard" columns={COLUMNS} data={feedbackHistories || []} />
		</Box>
	);
};

export default HistoryTab;
