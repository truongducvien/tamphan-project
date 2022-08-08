import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import Table, { IColumn } from 'components/table';
import { MdDelete, MdLibraryAdd } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { getUtilsGroup } from 'services/utils/group';
import { IUtilsGroup } from 'services/utils/group/type';
import { patchs } from 'variables/patch';
import { PermistionAction } from 'variables/permission';

const TypeUtilitiesManagement: React.FC = () => {
	const keywordRef = useRef<HTMLInputElement>(null);
	const [keyword, setKeyword] = useState('');
	const { data, isLoading } = useQuery(['list', keyword], () => getUtilsGroup(keyword));

	const COLUMNS: Array<IColumn<IUtilsGroup>> = [
		{ key: 'name', label: 'Tên loại tiện ích' },
		{ key: 'description', label: 'Mô tả' },
		{ key: 'imageLink', label: 'hình ảnh' },
		{ key: 'state', label: 'Trạng thái hoạt động' },
		{ key: 'updatedDate', label: 'Ngày cập nhật' },
	];

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<Stack
						spacing={5}
						align="end"
						justify={{ base: 'center', md: 'left', xl: 'left' }}
						direction={{ base: 'column', md: 'row' }}
					>
						<FormControl flex={0.5}>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Tên loại tiện ích</Text>
							</FormLabel>
							<Input
								ref={keywordRef}
								variant="admin"
								fontSize="sm"
								ms={{ base: '0px', md: '0px' }}
								type="text"
								placeholder="Nhập ..."
								size="md"
							/>
						</FormControl>
						<Flex flex={1} justifyContent="end">
							<Button
								variant="lightBrand"
								onClick={() => setKeyword(keywordRef.current?.value || '')}
								leftIcon={<SearchIcon />}
							>
								Tìm kiếm
							</Button>
							<Link to={`${patchs.TypeUtilities}/${patchs.Create}`} as={RouterLink}>
								<Button marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
									Thêm mới
								</Button>
							</Link>
							<Button marginLeft={1} variant="delete" leftIcon={<MdDelete />}>
								Xoá
							</Button>
						</Flex>
					</Stack>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách cư dân
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					loading={isLoading}
					keyField="name"
					columns={COLUMNS}
					data={data?.items || []}
					action={[PermistionAction.EDIT, PermistionAction.DETETE]}
				/>
			</Card>
		</Box>
	);
};

export default TypeUtilitiesManagement;
