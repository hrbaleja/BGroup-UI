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

import AccountsService from 'src/services/bank/accountsService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import DataTableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import TableToolbar from 'src/components/table/table-toolbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

import NewAccount from '../account-new';
import DataTableRow from '../datatable-row';

// ----------------------------------------------------------------------

export default function AccountView() {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [noData, setNoData] = useState(false);

  const [customer, setCustomer] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await AccountsService.fetchCustomers();
      if (response.length === 0) {
        setNoData(true);
      }
      setCustomer(response);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const createAccount = async (customerdata, initialBalance) => {
    try {
      const customerData = {
        user: customerdata,
        balance: initialBalance,
      };
      const response = await AccountsService.createCustomer(customerData);
      fetchAccounts();
      console.log('New customer created:', response);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  // Pagination 
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

  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Account Holder</Typography>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => setOpenCreateDialog(true)}
        > New</Button>
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
                    { id: 'name', label: 'Name' },
                    { id: 'updatedAt', label: 'Last Update' },
                    { id: 'balance', label: 'Balance' },
                    { id: 'balanceType', label: 'Balance Type' },
                    { id: '' },
                  ]}
                />)}
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <DataTableRow
                      key={row._id}
                      name={row.name}
                      updatedAt={fDateTime(row.updatedAt)}
                      balance={(row.balance) ? fNumbers(row.balance) : fNumbers(0)}
                      balanceType={row.balance < 0 ? 'Debit' : 'Credit'}
                      id={row._id}
                      avatarUrl={`/assets/images/avatars/avatar_${index + 1}.jpg`}
                      fetchCustomer={fetchAccounts}
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

      <NewAccount
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        handleCreateCustomer={createAccount}
      />

    </Container>
  );
}