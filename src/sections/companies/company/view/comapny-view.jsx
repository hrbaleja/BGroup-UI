import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loader

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

// ----------------------------------------------------------------------

export default function CompanyView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const [companies, setCompanies] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true); // Set loading to true before fetching data
    try {
      const response = await CompanyService.getCompanies(!isArchived);
      if (response.length === 0) {
        setNoData(true);
      }
      setCompanies(response);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching data
    }
  }, [isArchived]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

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
    inputData: companies,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Company Information</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Show Archived:</Typography>
          <Switch
            checked={isArchived}
            onChange={(e) => setIsArchived(e.target.checked)}
          />
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpenCreateDialog(true)}
          > New</Button>
        </Stack>
      </Stack>
      <Card>
        {!noData && (<TableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        />)}
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>

            <Table sx={{ minWidth: 800 }}>
              {!noData && (<DataTableHead
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
              />)}

              <TableBody>
                {isLoading ? (
                      <Stack sx={{ position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',}}>
                        <CircularProgress />
                      </Stack>                    
                ) : (
                  <>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((company) => (
                        <DataTableRow
                          key={company._id}
                          company={company}
                          fetchCompanies={fetchCompanies}
                        />
                      ))}
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, companies.length)}
                    />
                    {(notFound || noData) && <TableNoData query={filterName} />}
                  </>
                )}
              </TableBody>

            </Table>
          </TableContainer>
        </Scrollbar>

        {!noData && (
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
