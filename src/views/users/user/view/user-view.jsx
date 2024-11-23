import { useMemo, useState, useEffect, useCallback, } from 'react';

import {
  Card, Stack, Table, Button, Switch, Container, TableBody, Typography,
  TableContainer, TablePagination
} from '@mui/material';

import { PAGE_TITLES } from 'src/constants/page';
import authService from 'src/services/auth/authService';
import UserService from 'src/services/users/userService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import DataTableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import TableToolbar from 'src/components/table/table-toolbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

import NewUser from '../user-new';
import DataTableRow from '../datatable-row';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Role' },
  { id: 'isVerified', label: 'Verified', align: 'center' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: '' },
];

export default function UserView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('role');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [filters, setFilters] = useState({ isVerified: true, isActive: true, role: [] });
  const [isDematUsers, setDematUsers] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const filterParams = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: orderBy,
        sortOrder: order,
        name: filterName,
        role: filters.role,
        isActive: filters.isActive,
        isVerified: filters.isVerified
      };
      const response = await UserService.fetchUsers(isDematUsers, filterParams);
      setUsers(response);
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  }, [isDematUsers, page, rowsPerPage, order, orderBy, filterName, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData) => {
    try {
      await authService.register(userData);
      fetchUsers();
      setOpenCreateDialog(false);
    } catch (error) {
      console.error('Error creating User:', error);
    }
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
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (value) => {
    setPage(0);
    setFilterName(value);
  };

  const dataFiltered = useMemo(() => applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  }), [users, order, orderBy, filterName]);


  const isNotFound = !dataFiltered.length && !!filterName;
  const isNoData = !users.length;

  const handleFilter = (newFilters) => {
    setFilterName('')
    setFilters(newFilters);
    setPage(0);
  };

  return (
    <Container maxWidth="xl">
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">{PAGE_TITLES.USERS}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Demat Users:</Typography>
          <Switch checked={isDematUsers} onChange={(e) => setDematUsers(e.target.checked)} />
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpenCreateDialog(true)}
          >
            New
          </Button>
        </Stack>
      </Stack> */}

      <Stack direction="row" alignItems="left" justifyContent="space-between" mb={3}
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
        <Typography variant="h4" sx={{ textAlign: 'centre', mb: 1 }}>{PAGE_TITLES.USERS}</Typography>
        <Stack direction="row" spacing={0} alignItems="center"
          sx={{ justifyContent: 'space-between', alignItems: 'center', }}>
          <Stack direction="row" spacing={0} alignItems="center">
            <Typography>Demat Users:</Typography>
            <Switch
              checked={isDematUsers}
              onChange={(e) => setDematUsers(e.target.checked)}
            />
          </Stack>
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
        {!isNoData && (
          <TableToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            filters={filters}
            onFilter={handleFilter}
            filterFor={PAGE_TITLES.USERS}
          />
        )}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              {!isNoData && (
                <DataTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleSort}
                  headLabel={TABLE_HEAD}
                />
              )}

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <DataTableRow
                      key={row._id}
                      {...row}
                      id={row._id}
                      avatarUrl={`/assets/images/avatars/avatar_${row.role}.jpg`}
                      fetchUsers={fetchUsers}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {(isNotFound || isNoData) && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {!isNoData && (
          <TablePagination
            page={page}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 20]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Card>

      <NewUser
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSubmit={createUser}
      />
    </Container>
  );
}