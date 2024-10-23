import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { PAGE_TITLES } from 'src/constants/page';
import incomeService from 'src/services/company/incomeService';
import transactionService from 'src/services/company/transactionService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import DataTableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import TableToolbar from 'src/components/table/table-toolbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

import NewIncome from '../income-new';
import DataTableRow from '../datatable-row';

export default function IncomeView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [noData, setNoData] = useState(false);

  const [incomes, setIncomes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    fetchIncomes();
    fetchTransactions();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await incomeService.getIncomes();
      if (response.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }
      setIncomes(response);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getTransactions();
      setTransactions(response);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const createIncome = async (incomeData) => {
    try {
      await incomeService.createIncome(incomeData);
      setOpenCreateDialog(false)
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
        <Typography variant="h4">{PAGE_TITLES.INCOME}</Typography>
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
        {!noData && (
          <TableToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            filterFor={PAGE_TITLES.INCOME}
          />)}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              {!noData && (
                <DataTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'application', label: 'Application No', flex: 1 },
                    { id: 'profit', label: 'Income', type: 'number', },
                    { id: 'sharedProfit', label: 'Share Amount', type: 'number', flex: 1 },
                    { id: 'finalAmount', label: 'Final Amount', type: 'number', flex: 1 },
                    { id: 'createdAt', label: 'Date', type: 'date', flex: 1 },
                    { id: '', label: 'Action' },
                  ]}
                />)}
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <DataTableRow
                      key={row._id}
                      income={{
                        _id: row._id,
                        application: row.transactionId,
                        profit: row.profit,
                        sharedProfit: row.sharedProfit,
                        finalAmount: row.finalAmount,
                        createdAt: row.createdAt,
                      }}
                      fetchIncomes={fetchIncomes}
                      transactions={transactions}
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, incomes.length)}
                />
                {(notFound || noData) && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {!noData && (
          <TablePagination
            page={page}
            component="div"
            count={incomes.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Card>

      <NewIncome
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        transactions={transactions}
        onSubmit={createIncome}
      />
    </Container>
  );
}