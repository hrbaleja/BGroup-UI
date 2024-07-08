// CommonTablePage.js
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Card, Stack, Table, Button, Container, TableBody,
  Typography, TableContainer, TablePagination
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import DataTableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import TableToolbar from 'src/components/table/table-toolbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

function CommonTablePage({
  title,
  data,
  columns,
  RowComponent,
  CreateDialog,
  fetchData,
  createItem,
  noDataComponent
}) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleCreateItem = async (itemData) => {
    try {
      await createItem(itemData);
      fetchData();
      setOpenCreateDialog(false);
    } catch (error) {
      console.error(`Error creating ${title}:`, error);
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
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{title}</Typography>
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
        <TableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <DataTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={columns}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <RowComponent
                      key={row._id}
                      row={row}
                      fetchData={fetchData}
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, data.length)}
                />
                {(notFound || data.length === 0) && (noDataComponent || <TableNoData query={filterName} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <CreateDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSubmit={handleCreateItem}
      />
    </Container>
  );
}

CommonTablePage.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      flex: PropTypes.number,
    })).isRequired,
    RowComponent: PropTypes.elementType.isRequired,
    CreateDialog: PropTypes.elementType.isRequired,
    fetchData: PropTypes.func.isRequired,
    createItem: PropTypes.func.isRequired,
    noDataComponent: PropTypes.elementType,
  };
  
  CommonTablePage.defaultProps = {
    noDataComponent: null,
  };
  
  export default CommonTablePage;