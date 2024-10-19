import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import { Card, Stack, Table, Button,Tooltip , Container, TableBody, Typography, TableContainer, TablePagination } from '@mui/material';

import { PATHS } from 'src/routes/routes';

import { fDateTime } from 'src/utils/format-time';
import { fNumbers, fCurrency, } from 'src/utils/format-number';

import { PAGE_TITLES } from 'src/constants/page';
import AccountsService from 'src/services/account/accountsService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import DataTableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import TableToolbar from 'src/components/table/table-toolbar';

import NewAccount from '../account-new';
import DataTableRow from '../datatable-row';

export default function AccountView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [noData, setNoData] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [filters, setFilters] = useState({ balanceType: '', amount: 0 });
  const navigate = useNavigate();

  const fetchAccounts = useCallback(async () => {
    try {
      const filterParams = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: orderBy,
        sortOrder: order,
        name: filterName,
        balanceType: filters.balanceType,
        amountRange: filters.amount,
      };

      const response = await AccountsService.fetchCustomers(filterParams);

      if (response.accounts.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }

      setCustomer(response.accounts);
      setTotalCount(response.pagination.totalDocs);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setNoData(true);
    }
  }, [page, rowsPerPage, order, orderBy, filterName, filters]);


  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const fetchNonCustomers = async () => {
    try {
      const response = await AccountsService.fetchNonCustomer();
      return response;
    } catch (error) {
      console.error('Error fetching non-customers:', error);
      return [];
    }
  };

  const createAccount = async (customerData, initialBalance) => {
    try {
      await AccountsService.createCustomer({
        user: customerData,
        balance: initialBalance,
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleFilter = (newFilters) => {
    setFilterName('')
    setFilters(newFilters);
    setPage(0);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (value) => {
    setFilterName(value);
    setPage(0);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{PAGE_TITLES.ACCOUNT}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpenCreateDialog(true)}
            aria-label="Create new account"
          >
            New
          </Button>
          <Tooltip title="New Account Page" arrow>
            <Button
              color="inherit"
              onClick={() => navigate(PATHS.ACCOUNTNEW)}
              sx={{ minWidth: 0, padding: 1 }}
            >
              <Iconify icon="fluent-color:clipboard-48" />
            </Button>
          </Tooltip>
        </Stack>
      </Stack>

      <Card>
        <TableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          filters={filters}
          onFilter={(newFilters) => handleFilter(newFilters)}
          filterFor={PAGE_TITLES.ACCOUNT}
        />

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
                    { id: 'balanceType', label: 'Balance Type', align: 'center' },
                    { id: '' },
                  ]}
                />
              )}
              <TableBody>
                {customer.map((row, index) => (
                  <DataTableRow
                    key={row._id}
                    name={row.user.name}
                    updatedAt={fDateTime(row.updatedAt)}
                    balance={row.balance ? fCurrency(row.balance) : fNumbers(0)}
                    balanceType={row.balance < 0 ? 'Debit' : 'Credit'}
                    id={row._id}
                    avatarUrl={`/assets/images/avatars/avatar_${index + 1}.jpg`}
                    fetchCustomer={fetchAccounts}
                  />
                ))}

                {noData && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        {!noData && (
          <TablePagination
            page={page}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Card>

      <NewAccount
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        handleCreateCustomer={createAccount}
        fetchNonCustomers={fetchNonCustomers}

      />
    </Container>
  );
}
