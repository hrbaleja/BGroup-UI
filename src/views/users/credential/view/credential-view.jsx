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

import { PAGE_TITLES } from 'src/constants/page';
import InformationService from 'src/services/users/credentialService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import DataTableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import TableToolbar from 'src/components/table/table-toolbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

import DataTableRow from '../datatable-row';
import NewCredential from '../credential-new';

export default function CredentialView() {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [noData, setNoData] = useState(false);

  const [entries, setEntries] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    fetchCredential();
  }, []);

  const fetchCredential = async () => {
    try {
      const response = await InformationService.getEntries();
      if (response.length === 0) {
        setNoData(true);
      }
      setEntries(response);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const createCredential = async (entryData) => {
    try {
      await InformationService.createEntry(entryData);
      fetchCredential();
      setOpenCreateDialog(false);
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  // Pagination 
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const dataFiltered = applyFilter({
    inputData: entries,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{PAGE_TITLES.CREDENTIALS}</Typography>
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
            filterFor={PAGE_TITLES.CREDENTIALS}
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
                    { id: 'name', label: 'User' },
                    { id: 'site', label: 'App' },
                    { id: 'username', label: 'User Name' },
                    { id: 'description', label: 'Description' },
                    { id: '' },
                  ]}
                />)}

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <DataTableRow
                      key={row._id}
                      name={row.user?.name || ''}
                      site={row.site}
                      username={row.username}
                      password={row.password}
                      description={row.description}
                      id={row._id}
                      fetchEntries={fetchCredential}
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, entries.length)}
                />
                {(notFound || noData) && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        {!noData && (<TablePagination
          page={page}
          component="div"
          count={entries.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />)}
      </Card>

      <NewCredential
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSubmit={createCredential}
      />

    </Container>
  );
}
