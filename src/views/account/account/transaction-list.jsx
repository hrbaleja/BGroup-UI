import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Paper, Table, TableRow, TableBody, TableCell, TableHead, Typography, useMediaQuery, TableContainer, TablePagination
} from '@mui/material';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

export default function TransactionList({ transactions }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile view

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (transactions.length === 0) {
    return (
      <div>
        <Typography variant={isMobile ? 'body2' : 'h6'} align="center" gutterBottom>
          No transactions available for the selected user and date range.
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <TableContainer component={Paper} elevation={isMobile ? 0 : 2} sx={{ mb: 2 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body2" fontWeight="medium" fontSize={isMobile ? '0.5rem' : '1rem'}>Date</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium" fontSize={isMobile ? '0.5rem' : '1rem'}>Description </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium" fontSize={isMobile ? '0.5rem' : '1rem'}>Debit</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium" fontSize={isMobile ? '0.5rem' : '1rem'}> Credit</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium" fontSize={isMobile ? '0.5rem' : '1rem'}>Balance</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow key={transaction.txnId}>
                  <TableCell>
                    <Typography variant="body1" fontSize={isMobile ? '0.5rem' : '1rem'}>
                      {fDateTime(transaction.txnDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontSize={isMobile ? '0.5rem' : '1rem'}>
                      {transaction.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontSize={isMobile ? '0.5rem' : '1rem'} color="error.main">
                      {fCurrency(transaction.debit)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontSize={isMobile ? '0.5rem' : '1rem'} color="success.main">
                      {fCurrency(transaction.credit)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontSize={isMobile ? '0.5rem' : '1rem'} fontWeight="bold">
                      {fCurrency(transaction.balance)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '.MuiTablePagination-toolbar': {
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            fontSize: isMobile ? '0.75rem' : '1rem',
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: isMobile ? '0.75rem' : '1rem',
          },
        }}
      />
    </div>
  );
}

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
};
