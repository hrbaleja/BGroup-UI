import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
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

import { fNumbers } from 'src/utils/format-number';

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

export default function TransactionView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('appliedDate');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [noData, setNoData] = useState(false);

  const [customer, setCustomer] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openCompanyModal, setOpenCompanyModal] = useState(false);



  useEffect(() => {
    fetchTransactions();
    fetchUsers();
    fetchCompanies();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getTransactions();
      if (response.length === 0) {
        setNoData(true);
      }
      setCustomer(response);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.fetchUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companyService.getCompanies();
      setCompanies(response);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const createTransaction = async (newTransaction) => {
    try {
      await transactionService.createTransaction(newTransaction);
      setOpenCreateDialog(false)
      fetchTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
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
    inputData: customer,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;


  const handleOpenCompanyModal = () => {
    setOpenCompanyModal(true);
    setSelectedCompany(null);
  };
  const handleCompanySelect = (company) => {
    setSelectedCompany(company);

    // Filter users based on the selected company
    const filteredUsers = users.map((user) => {
      const hasApplied = customer.some(
        (transaction) =>
          transaction.user._id === user._id &&
          transaction.company._id === company._id
      );

      return {
        ...user,
        isApplied: hasApplied,
      };
    });

    setUsers(filteredUsers);
  };

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Transactions</Typography>
        <Stack direction="row" spacing={2} >
          <Button
            variant="text"
            color="info"
            startIcon={<Iconify icon="grommet-icons:status-good" />}
            onClick={handleOpenCompanyModal}
          >Status</Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpenCreateDialog(true)}
          >New</Button>
        </Stack>
      </Stack>
      <Card>

        {!noData && (
          <TableToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
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
                />)}

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <DataTableRow
                      key={row._id}
                      company={row.company?.name}
                      name={row.user.name}
                      lotSize={row.lotSize}
                      appliedDate={row.appliedDate}
                      grantedBy={row.grantedBy.name}
                      amount={fNumbers(row.amount)}
                      is_own={row.is_own ? 'Yes' : 'No'}
                      is_alloted={row.is_alloted ? 'Yes' : 'No'}
                      id={row._id}
                      companyid={row.company._id}
                      userid={row.user._id}
                      granterid={row.grantedBy._id}
                      users={users}
                      companies={companies}
                      fetchTransaction={fetchTransactions}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, customer.length)}
                />
                {(notFound || noData) && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        {!noData && (<TablePagination
          page={page}
          component="div"
          count={customer.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />)}
      </Card>

      <NewTransaction
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        users={users}
        companies={companies}
        onSubmit={createTransaction}
      />

      <Dialog open={openCompanyModal} onClose={handleOpenCompanyModal} sx={{ minwidth: '1000px', maxheight: '800px', minHeight: '400px' }}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
          Check  Application
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ margin: '0.5rem 0' }}>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={selectedCompany ? selectedCompany._id : ''}
              label="Select Company"
              onChange={(e) =>
                handleCompanySelect(companies.find((company) => company._id === e.target.value))
              }
              fullWidth
            >
              {companies.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCompany && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.isApplied ? 'Applied' : 'Not Applied'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompanyModal(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>);
}