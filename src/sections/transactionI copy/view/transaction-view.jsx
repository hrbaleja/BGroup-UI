import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fDate } from 'src/utils/format-time';
import { fNumbers } from 'src/utils/format-number';

import userService from 'src/services/users/userService';
import companyService from 'src/services/ipo/companyService';
import transactionService from 'src/services/ipo/transactionService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import UserTableHead from '../transaction-table-head';
import TransactionTableRow from '../transaction-table-row';
import UserTableToolbar from '../transaction-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function TransactionPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [customer, setCustomer] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    user: '',
    company: '',
    lotSize: '',
    appliedDate: '',
    is_own: false,
    grantedBy: '',
    amount: '',
    is_alloted: false,
    createdBy: '',
    updatedBy: '',
  });

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
    fetchCompanies();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getTransactions();
      setCustomer(response);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };
  // Inside the TransactionPage component

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
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = customer.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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

  // Create Transaction Modal
  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setNewTransaction({
      user: '',
      company: '',
      lotSize: '',
      appliedDate: '',
      is_own: false,
      grantedBy: '',
      amount: '',
      is_alloted: false,
      createdBy: '',
      updatedBy: '',
    });
  };

  const handleCreateTransaction = async () => {
    try {
      await transactionService.createTransaction(newTransaction);
      handleCloseCreateModal();
      fetchTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  // Edit Transaction Modal
  const handleOpenEditModal = (transaction) => {
    setTransactionToEdit(transaction);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setTransactionToEdit(null);
  };

  const handleUpdateTransaction = async () => {
    try {
      await transactionService.updateTransaction(transactionToEdit._id, transactionToEdit);
      handleCloseEditModal();
      fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await transactionService.deleteTransaction(transactionId);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenCreateModal}
        >
          Create Transaction
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={customer.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'company', label: 'Company', flex: 1 },
                  { id: 'name', label: 'Name' },
                  { id: 'lotSize', label: 'Lot Size', type: 'number', flex: 1 },
                  { id: 'appliedDate', label: 'Applied Date', type: 'date', flex: 1 },
                  { id: 'grantedBy', label: 'Granted By', flex: 1 },
                  { id: 'amount', label: 'Amount', type: 'number', flex: 1 }, { id: 'is_own', label: 'Is Own', type: 'boolean', flex: 1 },
                  { id: 'is_alloted', label: 'Is Alloted', type: 'boolean', flex: 1 },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TransactionTableRow
                      key={row._id}
                      company={row.company.name}
                      name={row.user.name}
                      lotSize={row.lotSize}
                      appliedDate={fDate(row.appliedDate)}
                      grantedBy={row.grantedBy.name}
                      amount={fNumbers(row.amount)}
                      is_own={row.is_own ? 'Yes' : 'No'}
                      is_alloted={row.is_alloted ? 'Yes' : 'No'}
                      id={row._id}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      handleOpenEditModal={() => handleOpenEditModal(row)}
                      handleDeleteTransaction={() => handleDeleteTransaction(row._id)}
                      fetchTransaction={fetchTransactions}
                    />
                  ))}<TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, customer.length)}
                />
                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={customer.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Create Transaction Modal */}
      <Dialog open={openCreateModal} onClose={handleCloseCreateModal}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
          Create Transaction
        </DialogTitle>
        <DialogContent>

          <FormControl fullWidth sx={{ margin: "0.5rem 0" }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={newTransaction.user} label="Select User"
              onChange={(e) => setNewTransaction({ ...newTransaction, user: e.target.value })}
              fullWidth
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ margin: "0.5rem 0" }}>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={newTransaction.company} label="Select Company"
              onChange={(e) => setNewTransaction({ ...newTransaction, company: e.target.value })}
              fullWidth
            >
              {companies.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Lot Size"
            type="number"
            fullWidth
            value={newTransaction.lotSize}
            onChange={(e) => setNewTransaction({ ...newTransaction, lotSize: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Applied Date"
            type="date"
            fullWidth
            value={newTransaction.appliedDate}
            onChange={(e) => setNewTransaction({ ...newTransaction, appliedDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl fullWidth sx={{ margin: "0.5rem 0" }}>
            <InputLabel>Granted By</InputLabel>
            <Select
              value={newTransaction.grantedBy} label="Granted By"
              onChange={(e) => setNewTransaction({ ...newTransaction, grantedBy: e.target.value })}
              fullWidth
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
          />

          <Stack direction="row" alignItems="center" spacing={2}>
            Is Own<Switch value={newTransaction.is_own}
              onChange={(e) => setNewTransaction({ ...newTransaction, is_own: e.target.checked })}
              inputProps={{ 'aria-label': 'controlled' }} />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            Is Alloted<Switch value={newTransaction.is_alloted}
              onChange={(e) => setNewTransaction({ ...newTransaction, is_alloted: e.target.checked })}
              inputProps={{ 'aria-label': 'controlled' }} />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseCreateModal}>Cancel</Button>
          <Button onClick={handleCreateTransaction}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Transaction Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          {transactionToEdit && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="User"
                type="text"
                fullWidth
                value={transactionToEdit.user.name}
                onChange={(e) =>
                  setTransactionToEdit({
                    ...transactionToEdit,
                    user: { ...transactionToEdit.user, name: e.target.value },
                  })
                }
              />

              <Select
                value={transactionToEdit.user._id}
                onChange={(e) =>
                  setTransactionToEdit({
                    ...transactionToEdit,
                    user: users.find((user) => user._id === e.target.value),
                  })
                }
                fullWidth
              >
                <MenuItem value="">Select User</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                value={transactionToEdit.company._id}
                onChange={(e) =>
                  setTransactionToEdit({
                    ...transactionToEdit,
                    company: companies.find((company) => company._id === e.target.value),
                  })
                }
                fullWidth
              >
                <MenuItem value="">Select Company</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company._id} value={company._id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
              {/* Add more input fields for other transaction properties */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button onClick={handleUpdateTransaction}>Update</Button>
        </DialogActions>
      </Dialog>
    </Container>);
}