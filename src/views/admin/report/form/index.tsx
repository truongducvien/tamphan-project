import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Card from 'src/components/card/Card';
import { BaseComponentProps } from 'src/hocs/withPermission';

import HistoryTab from './tabs/History';
import ReportDetailTab from './tabs/ReportDetail';
import { TaskTab } from './tabs/Task';

const ReportDetail: React.FC<BaseComponentProps> = ({ request }) => {
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
export default ReportDetail;
