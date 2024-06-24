import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
// import Switch from '@mui/material/Switch';
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

import incomeService from 'src/services/ipo/incomeService';
// import companyService from 'src/services/companyService';
import transactionService from 'src/services/ipo/transactionService';
// import IncomeTableRow from './IncomeTableRow';

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
  const [noData, setNoData] = useState(false);

  const [incomes, setIncomes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  // const [selectedTransaction, setSelectedTransaction] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [incomeToEdit, setIncomeToEdit] = useState(null);

  const [newIncome, setNewIncome] = useState({
    transactionId: '',
    profit: '',
    sharedProfit: '',
    finalAmount: '',
  });


  useEffect(() => {
    fetchIncomes();
    fetchTransactions();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await incomeService.getIncomes();
      setIncomes(response);
      if (response.length === 0) {

        setNoData(true);
      }
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

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = incomes.map((n) => n.name);
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
    inputData: incomes,
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
    setNewIncome({
      transactionId: '',
      profit: '',
      sharedProfit: '',
      finalAmount: '',
    });
  };

  const handleCreateIncome = async () => {
    try {
      await incomeService.createIncome(newIncome);
      handleCloseCreateModal();
      fetchIncomes();
      setNoData(false)
    } catch (error) {
      console.error('Error creating income:', error);
    }
  };



  // Edit Income Modal
  const handleOpenEditModal = (income) => {
    setIncomeToEdit(income);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setIncomeToEdit(null);
  };

  const handleUpdateIncome = async () => {
    try {
      await incomeService.updateIncome(incomeToEdit._id, incomeToEdit);
      handleCloseEditModal();
      fetchIncomes();
    } catch (error) {
      console.error('Error updating income:', error);
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      await incomeService.deleteIncome(incomeId);
      fetchIncomes();
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  // const handleTransactionChange = (event) => {
  //   setSelectedTransaction(event.target.value);
  // };



  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Income Statement</Typography>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenCreateModal}
        >
          New        </Button>
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
                rowCount={incomes.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'application', label: 'Application No', flex: 1 },
                  { id: 'profit', label: 'Income', type: 'number', },
                  { id: 'sharedProfit', label: 'Share Amount', type: 'number', flex: 1 },
                  { id: 'finalAmount', label: 'Final Amount', type: 'number', flex: 1 },
                  { id: 'createdAt', label: 'Date', type: 'date', flex: 1 },
                  // { id: 'amount', label: 'Amount', type: 'number', flex: 1 }, 
                  // { id: 'is_own', label: 'Is Own', type: 'boolean', flex: 1 },
                  // { id: 'is_alloted', label: 'Is Alloted', type: 'boolean', flex: 1 },
                  { id: '', label: 'Action' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TransactionTableRow
                      key={row._id}
                      application={row.transactionId}
                      profit={fNumbers(row.profit)}
                      sharedProfit={fNumbers(row.sharedProfit)}
                      finalAmount={fNumbers(row.finalAmount)}
                      createdAt={fDate(row.createdAt)}
                      id={row._id}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      handleOpenEditModal={() => handleOpenEditModal(row)}
                      handleDeleteTransaction={() => handleDeleteIncome(row._id)}
                    // fetchTransaction={fetchTransactions}
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


      <Dialog open={openCreateModal} onClose={handleCloseCreateModal}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
          Create Income
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ margin: "0.5rem 0" }}>
            <InputLabel>Select Transaction</InputLabel>
            <Select
              value={newIncome.transactionId}
              label="Select Transaction"
              onChange={(e) => setNewIncome({ ...newIncome, transactionId: e.target.value })}
              fullWidth
            >
              {transactions.map((transaction) => (<MenuItem key={transaction._id} value={transaction._id}>
                {transaction.company.name}-{transaction.user.name}
              </MenuItem>
              ))}
            </Select>
          </FormControl><TextField
            margin="dense"
            label="Profit"
            type="number"
            fullWidth
            value={newIncome.profit}
            onChange={(e) => setNewIncome({ ...newIncome, profit: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Shared Profit"
            type="number"
            fullWidth
            value={newIncome.sharedProfit}
            onChange={(e) => setNewIncome({ ...newIncome, sharedProfit: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Final Amount"
            type="number"
            fullWidth
            value={newIncome.finalAmount}
            onChange={(e) => setNewIncome({ ...newIncome, finalAmount: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseCreateModal}>Cancel</Button>
          <Button onClick={handleCreateIncome}>Create</Button>
        </DialogActions>
      </Dialog>


      {/* Edit Income Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Income</DialogTitle>
        <DialogContent>
          {incomeToEdit && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Transaction ID"
                type="text"
                fullWidth
                value={incomeToEdit.transactionId}
                onChange={(e) =>
                  setIncomeToEdit({
                    ...incomeToEdit,
                    transactionId: e.target.value,
                  })
                }
              />

              <TextField
                margin="dense"
                label="Profit"
                type="number"
                fullWidth
                value={incomeToEdit.profit}
                onChange={(e) =>
                  setIncomeToEdit({
                    ...incomeToEdit,
                    profit: e.target.value,
                  })
                }
              />

              <TextField
                margin="dense"
                label="Shared Profit"
                type="number"
                fullWidth
                value={incomeToEdit.sharedProfit}
                onChange={(e) =>
                  setIncomeToEdit({
                    ...incomeToEdit,
                    sharedProfit: e.target.value,
                  })
                }
              />

              <TextField
                margin="dense"
                label="Final Amount"
                type="number"
                fullWidth
                value={incomeToEdit.finalAmount}
                onChange={(e) =>
                  setIncomeToEdit({
                    ...incomeToEdit,
                    finalAmount: e.target.value,
                  })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button onClick={handleUpdateIncome}>Update</Button>
        </DialogActions>
      </Dialog>
    </Container>);
}