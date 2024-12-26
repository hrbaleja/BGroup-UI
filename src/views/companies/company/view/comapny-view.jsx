import { useState, useEffect, useCallback } from 'react';

import { Card, Stack, Table, Button, Switch, Container, TableBody, Typography, TableContainer, TablePagination, CircularProgress } from '@mui/material';

import { PAGE_TITLES } from 'src/constants/page';
import CompanyService from 'src/services/company/companyService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import DataTableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import TableToolbar from 'src/components/table/table-toolbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

import NewCompany from '../comapny-new';
import DataTableRow from '../datatable-row';

export default function CompanyView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  // const [filters, setFilters] = useState({ balanceType: '', amount: 0 });

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setNoData(false);
    try {
      const response = await CompanyService.getCompanies(!isArchived);
      if (response.length === 0) {
        setNoData(true);
      }
      setCompanies(response);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isArchived]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

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
    inputData: companies,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="left" justifyContent="space-between" mb={3}
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
        <Typography variant="h4" sx={{ textAlign: 'centre', mb: 1 }}>{PAGE_TITLES.COMPANY}</Typography>
        <Stack direction="row" spacing={0} alignItems="center"
          sx={{ justifyContent: 'space-between', alignItems: 'center', }}>
          <Stack direction="row" spacing={0} alignItems="center">
            <Typography>Show Past:</Typography>
            <Switch checked={isArchived} onChange={(e) => setIsArchived(e.target.checked)} />
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
        {isLoading && (
          <Stack sx={{ justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Stack>
        )}
        {!isLoading && !noData && (
          <TableToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            filterFor={PAGE_TITLES.COMPANY}
          />
        )}
        {!isLoading && (
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                {!isLoading && !noData && (
                  <DataTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleSort}
                    headLabel={[
                      { id: 'name', label: 'Name' },
                      { id: 'industry', label: 'Industry' },
                      { id: 'startDate', label: 'Start Date' },
                      { id: 'endDate', label: 'End Date' },
                      { id: 'amount', label: 'Amount' },
                      { id: 'lotSize', label: 'Lot Size' },
                      { id: 'isMain', label: 'Category' },
                      { id: '', label: 'Action', align: 'right' },
                    ]}
                  />
                )}
                <TableBody>
                  {!isLoading &&
                    dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((company) => (
                        <DataTableRow
                          key={company._id}
                          company={company}
                          fetchCompanies={fetchCompanies}
                        />
                      ))}
                  {!isLoading && (
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, companies.length)}
                    />
                  )}
                  {!isLoading && (notFound || noData) && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}
        {!isLoading && !noData && (
          <TablePagination
            page={page}
            component="div"
            count={companies.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Card>

      <NewCompany
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        fetchCompanies={fetchCompanies}
      />
    </Container>
  );
}
