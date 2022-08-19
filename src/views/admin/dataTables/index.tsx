import React, { useEffect, useMemo, useState } from 'react';

import { Box, SimpleGrid } from '@chakra-ui/react';
import Card from 'components/card/Card';
import Table, { IColumn } from 'components/table';
import { Column } from 'react-table';
import CheckTable from 'views/admin/dataTables/components/CheckTable';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import ComplexTable from 'views/admin/dataTables/components/ComplexTable';
import { columnsDataCheck, columnsDataColumns, columnsDataComplex } from 'views/admin/dataTables/variables/columnsData';
import tableDataCheck from 'views/admin/dataTables/variables/tableDataCheck.json';
import tableDataColumns from 'views/admin/dataTables/variables/tableDataColumns.json';
import tableDataComplex from 'views/admin/dataTables/variables/tableDataComplex.json';

const fetchPokemons = async (pageSize: number, offset: number): Promise<Record<string, string>> => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const a = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`).then(res => res.json());
	return a as unknown as Record<string, string>;
};

const Settings: React.FC = () => {
	const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);

	const [pokemons, setPokemons] = useState<{ name: string; url: string }[]>([]);
	const [pageInfo, setPageInfo] = useState<{ total: string; hasNextPage: boolean; hasPreviousPage: boolean } | null>(
		null,
	);

	const handleSelectionChange = (s: string[]) => {
		setSelectedKeys(s);
	};

	useEffect(() => {
		fetchPokemons(currentPageSize, currentPage)
			.then(p => {
				setPageInfo({
					total: p.count,
					hasNextPage: p.next !== null,
					hasPreviousPage: p.previous !== null,
				});
				setPokemons(p.results as unknown as { name: string; url: string }[]);
			})
			.catch(error => console.error('App =>', error));
	}, [currentPage, currentPageSize]);
	const COLUMNS: Array<IColumn<{ name: string; url: string }>> = [
		{ key: 'name', label: 'Name' },
		{ key: 'url', label: 'url' },
	];

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<SimpleGrid mb="20px" columns={{ sm: 1, md: 1 }} spacing={{ base: '20px', xl: '20px' }}>
				<CheckTable columns={columnsDataCheck as Column[]} data={tableDataCheck} />
				<ColumnsTable columns={columnsDataColumns as Column[]} data={tableDataColumns} />
				<ComplexTable columns={columnsDataComplex as Column[]} data={tableDataComplex} />
				<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
					<Table
						testId="consignments-dashboard"
						keyField="name"
						columns={COLUMNS}
						data={pokemons}
						pagination={{
							total: Number(pageInfo?.total || 0),
							pageSize: currentPageSize,
							value: currentPage,
							hasNextPage: pageInfo?.hasNextPage,
							hasPreviousPage: pageInfo?.hasPreviousPage,
							onPageChange: page => setCurrentPage(page),
							onPageSizeChange: pageSize => setCurrentPageSize(pageSize),
						}}
					/>
				</Card>
			</SimpleGrid>
		</Box>
	);
};

export default Settings;
