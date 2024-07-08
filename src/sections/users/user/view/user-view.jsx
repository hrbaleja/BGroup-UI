import { useState, useEffect, useCallback } from 'react';

import {
  Card, Stack, Table, Button, Container, TableBody, Typography,
  TableContainer, TablePagination
} from '@mui/material';

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
  { id: 'email', label: 'Company' },
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

  const fetchUsers = useCallback(async () => {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  }, []);

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

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isNotFound = !dataFiltered.length && !!filterName;
  const isNoData = !users.length;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
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
        {!isNoData && (
          <TableToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
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