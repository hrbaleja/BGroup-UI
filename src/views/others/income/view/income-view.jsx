import React, { useState, useEffect } from 'react';

import { Card, Stack, Table, Button, Container, TableBody, Typography, TableContainer, TablePagination, } from '@mui/material';

import { PAGE_TITLES } from 'src/constants/page';
import incomeService from 'src/services/others/IncomeService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import DataTableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import TableToolbar from 'src/components/table/table-toolbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

import NewIncome from '../income-new';
import DataTableRow from '../datatable-row';

const TABLE_HEAD = [
  { id: 'name', label: 'Work Name' },
  { id: 'amount', label: 'Amount', type: 'number' },
  { id: 'method', label: 'Method' },
  { id: 'description', label: 'Description' },
  { id: 'category', label: 'Category' },
  { id: 'date', label: 'Date', type: 'date' },
  { id: '', label: 'Action' },
];

export default function IncomeView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [incomes, setIncomes] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await incomeService.getAllIncomes();
      setIncomes(response);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  };

  const createIncome = async (incomeData) => {
    try {
      await incomeService.createIncome(incomeData);
      setOpenCreateDialog(false);
      fetchIncomes();
    } catch (error) {
      console.error('Error creating income:', error);
    }
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: incomes,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{PAGE_TITLES.OTHER_INCOME}</Typography>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => setOpenCreateDialog(true)}
        >
          New
        </Button>
      </Stack>

      <Card>
        <TableToolbar filterName={filterName} onFilterName={handleFilterByName} filterFor={PAGE_TITLES.OTHER_INCOME} />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <DataTableHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                onRequestSort={handleSort}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <DataTableRow key={row._id} income={row} fetchIncomes={fetchIncomes} />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, incomes.length)}
                />
                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={incomes.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <NewIncome
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSubmit={createIncome}
      />
    </Container>
  );
}
