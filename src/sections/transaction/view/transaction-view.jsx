import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fDateTime } from 'src/utils/format-time';
import { fNumbers } from 'src/utils/format-number';

import CustomerService from 'src/services/bank/customerService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import NewCustomerForm from '../NewCustomerForm';
import TableEmptyRows from '../table-empty-rows';
import UserTableRow from '../transaction-table-row';
import UserTableHead from '../transaction-table-head';
import UserTableToolbar from '../transaction-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
// ----------------------------------------------------------------------

export default function TransactionPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [customer, setCustomer] = useState([]);
  const [openNewCustomerForm, setOpenNewCustomerForm] = useState(false);




  useEffect(() => {
    fetchCustomer();
  }, []);

  const handleOpenNewCustomerForm = () => {
    setOpenNewCustomerForm(true);
  };

  const handleCloseNewCustomerForm = () => {
    setOpenNewCustomerForm(false);
  };
  const handleCreateTransaction = async (customerdata, initialBalance) => {
    try {
      const customerData = {
        user: customerdata,
        balance: initialBalance,
      };
      
      const response = await CustomerService.createCustomer(customerData);
      fetchCustomer();
      console.log('New customer created:', response);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };


  const fetchCustomer = async () => {
    try {
      const response = await CustomerService.fetchCustomers();
      setCustomer(response);
    } catch (error) {
      console.error('Error fetching customer data:', error);
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




  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>

        <Button variant="outlined" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenNewCustomerForm}>
          New 
        </Button>
      </Stack>
      <NewCustomerForm
        open={openNewCustomerForm}
        handleClose={handleCloseNewCustomerForm}
        handleCreateCustomer={handleCreateTransaction}
      />

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
                  { id: 'name', label: 'Name' },
                  { id: 'updatedAt', label: 'Last Update' },
                  { id: 'balance', label: 'Balance' },
                  { id: 'balanceType', label: 'Balance Type' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      name={row.user.name}
                      updatedAt={fDateTime(row.updatedAt)}
                      balance={(row.balance) ? fNumbers(row.balance) : fNumbers(0)}
                      balanceType={row.balance < 0 ? 'Debit' : 'Credit'}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      id={row._id}
                      fetchCustomer={fetchCustomer}
                    />
                  ))}

                <TableEmptyRows
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
    </Container>
  );
}
