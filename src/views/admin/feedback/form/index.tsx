import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Card from 'src/components/card/Card';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import useDidMount from 'src/hooks/useDidMount';

import { FeedbackContextProvider, useFeedbackAction } from './context';
import HistoryTab from './tabs/History';
import ReportDetailTab from './tabs/ReportDetail';
import { TaskTab } from './tabs/Task';

const FeedbackDetailForm: React.FC<BaseComponentProps> = ({ request }) => {
	const { id } = useActionPage();
	const { fetchFeedback } = useFeedbackAction(id || '');

	useDidMount(() => {
		if (id) fetchFeedback();
	});

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Tabs>
					<TabList>
						<Tab>Thông tin phản ánh</Tab>
						<Tab>Công việc</Tab>
						<Tab>Lịch sử thao tác</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<ReportDetailTab />
						</TabPanel>
						<TabPanel>
							<TaskTab />
						</TabPanel>
						<TabPanel>
							<HistoryTab />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Card>
		</Box>
	);
};

const FeedbackDetail: React.FC = () => (
	<FeedbackContextProvider>
		<FeedbackDetailForm />
	</FeedbackContextProvider>
);
export default FeedbackDetail;
