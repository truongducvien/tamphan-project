import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, HStack, Input, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import Table, { IColumn } from 'components/table';
import { BaseComponentProps } from 'hocs/withPermission';
import useActionPage from 'hooks/useActionPage';
import { useActionPermission } from 'hooks/useActionPermission';
import { MdLibraryAdd } from 'react-icons/md';
import { getOffice } from 'services/office';
import { IOffice } from 'services/office/type';
import { PermistionAction } from 'variables/permission';

const OfficeManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);

	const keywordRef = useRef<HTMLInputElement>(null);
	const [keyword, setKeyword] = useState('');

	const { data, isLoading } = useQuery(['listOffice', keyword], () => getOffice(keyword));

	const COLUMNS: Array<IColumn<IOffice>> = [
		{ key: 'name', label: 'Tên đơn vị' },
		{ key: 'parentId', label: 'Đơn vị trực thuộc' },
		{ key: 'description', label: 'Mô tả' },
		{ key: 'createdDate', label: 'Ngày tạo', dateFormat: 'YYYY-MM-DD' },
	];

	const { changeAction } = useActionPage();

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<HStack spacing={5} align="flex-end">
						<FormControl>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Tên đơn vị</Text>
							</FormLabel>
							<Input
								ref={keywordRef}
								variant="admin"
								maxW={500}
								fontSize="sm"
								ms={{ base: '0px', md: '0px' }}
								type="email"
								placeholder="Nhập đơn vị"
								size="md"
							/>
						</FormControl>
						<Flex>
							<Button
								variant="lightBrand"
								onClick={() => setKeyword(keywordRef.current?.value || '')}
								leftIcon={<SearchIcon />}
							>
								Tìm kiếm
							</Button>
							<Button
								hidden={!permistionAction.ADD}
								onClick={() => changeAction('create')}
								marginLeft={1}
								variant="brand"
								leftIcon={<MdLibraryAdd />}
							>
								Thêm mới
							</Button>
						</Flex>
					</HStack>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách Đơn vị
					</Heading>
				</Center>
				<Table
					loading={isLoading}
					testId="consignments-dashboard"
					columns={COLUMNS}
					data={data?.items || []}
					action={actions.filter(i => [PermistionAction.UPDATE, PermistionAction.VIEW].some(ii => ii === i))}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default OfficeManagement;
