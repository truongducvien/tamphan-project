import { useRef } from 'react';

import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Card from 'src/components/card/Card';
import { BaseComponentProps } from 'src/hocs/withPermission';

import ReportDetailTab from './tabs/ReportDetail';

const ReportDetail: React.FC<BaseComponentProps> = ({ request }) => {
	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Tabs>
					<TabList>
						<Tab>Thông tin phản ánh</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<ReportDetailTab />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Card>
		</Box>
	);
};
export default ReportDetail;
