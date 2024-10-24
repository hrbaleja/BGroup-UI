import React, { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
// import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
// import TableCell from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { fCurrency } from 'src/utils/format-number';

import { PAGE_TITLES } from 'src/constants/page';
import userService from 'src/services/users/userService';
import companyService from 'src/services/company/companyService';
import transactionService from 'src/services/company/transactionService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import DataTableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import TableToolbar from 'src/components/table/table-toolbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

import DataTableRow from '../datatable-row';
import NewTransaction from '../transaction-new';
import SDataTableRow from '../datatable-summary';

export default function TransactionView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('appliedDate');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [noData, setNoData] = useState(false);
  const [sortOptions, setSortOptions] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openCompanyModal, setOpenCompanyModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [usersResponse, companiesResponse] = await Promise.all([
        userService.fetchUsers(),
        companyService.getCompanies(),
      ]);

      setUsers(usersResponse);
      setCompanies(companiesResponse);


      const dynamicSortOptions = companiesResponse.slice(0, 4).map(company => ({
        value: company._id,  // or whatever unique value represents the company
        label: company.name, // or whatever property you want to display
      }));

      setSortOptions(dynamicSortOptions);

      const transactionsSummary = await transactionService.getTransactions();
      setTransactions(transactionsSummary);
      setNoData(transactionsSummary.length === 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNoData(true);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchTransactionDetails = useCallback(async (transactionId) => {
    try {
      const details = await transactionService.getTransactionDetails(transactionId);
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === transactionId ? { ...transaction, ...details } : transaction
        )
      );
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  }, []);

  const createTransaction = async (newTransaction) => {
    try {
      await transactionService.createTransaction(newTransaction);
      setOpenCreateDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleSort = useCallback(
    (event, id) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (value) => {
    setFilterName(value);
    setPage(0);
  };

  const dataFiltered = applyFilter({
    inputData: transactions,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const totalRecords = transactions.length;
  const totalAmount = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  // const handleCompanySelect = useCallback(
  //   (companyId) => {
  //     const selectedCompanys = companies.find((company) => company._id === companyId);
  //     setSelectedCompany(selectedCompany);

  //     const filteredUsers = users.map((user) => ({
  //       ...user,
  //       isApplied: transactions.some(
  //         (transaction) =>
  //           transaction.user._id === user._id && transaction.company._id === selectedCompanys._id
  //       ),
  //     }));

  //     setUsers(filteredUsers);
  //   },
  //   [transactions, users, companies]
  // );

  const handleCompanySelect = useCallback(
    (companyId) => {
      setSelectedCompany((prevSelectedCompany) => {
        const selectedCompan = companies.find((company) => company._id === companyId);

        const filteredUsers = users.map((user) => ({
          ...user,
          isApplied: transactions.some(
            (transaction) =>
              transaction.user._id === user._id && transaction.company._id === selectedCompan._id
          ),
        }));

        setUsers(filteredUsers);

        return selectedCompan;
      });
    },
    [transactions, users, companies]
  );

  const handleSortChange = async (option) => {
    setTransactions([])
    try {
      const transactionsSummary = await transactionService.getTransactionsByCompany(option.value);
      setTransactions(transactionsSummary);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{PAGE_TITLES.TRANSACTIONS}</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="text"
            color="info"
            startIcon={<Iconify icon="grommet-icons:status-good" />}
            onClick={() => setOpenCompanyModal(true)}
          >
            Status
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpenCreateDialog(true)}
          >
            New
          </Button>
        </Stack>
      </Stack>
      <Card>
        {!noData && (
          <TableToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            filterFor={PAGE_TITLES.TRANSACTIONS}
            sort
            sortOptions={sortOptions}
            // onFilter={handleFilter}
            onSortChange={handleSortChange} // Pass the sorting handler here
          />
        )}

        {/* {!noData && (
          <TableToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            filterFor={PAGE_TITLES.TRANSACTIONS}
            sort
            sortOptions={sortOptions}
            onFilter={handleFilter}
          />
        )} */}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              {!noData && (
                <DataTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'company', label: 'Company', flex: 1 },
                    { id: 'name', label: 'Name' },
                    { id: 'lotSize', label: 'Lot Size', type: 'number', flex: 1 },
                    { id: 'appliedDate', label: 'Applied Date', type: 'date', flex: 1 },
                    { id: 'grantedBy', label: 'Granted By', flex: 1 },
                    { id: 'amount', label: 'Amount', type: 'number', flex: 1 },
                    { id: 'is_own', label: 'Is Own', type: 'boolean', flex: 1 },
                    { id: 'is_alloted', label: 'Is Alloted', type: 'boolean', flex: 1 },
                    { id: '', label: 'Action' },
                  ]}
                />
              )}

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <DataTableRow
                      key={row._id}
                      transaction={row}
                      fetchTransactionDetails={() => fetchTransactionDetails(row._id)}
                      users={users}
                      companies={companies}
                      fetchTransaction={fetchData}
                    />
                  ))}
                  
                <SDataTableRow
                  transaction={totalRecords}
                  transactionAmount={totalAmount} />

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, transactions.length)}
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
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Card>

      <NewTransaction
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        users={users}
        companies={companies}
        onSubmit={createTransaction}
      />

      <Dialog fullWidth maxWidth="xs" open={openCompanyModal} onClose={() => setOpenCompanyModal(false)}>
        <DialogTitle>Select a Company</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Company</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Company"
              value={selectedCompany?._id || ''}
              onChange={(e) => handleCompanySelect(e.target.value)}
            >
              {companies.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenCompanyModal(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
