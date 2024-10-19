import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Paper, Table, TableRow, TableBody, TableCell, TableHead, Typography, TableContainer, TablePagination, } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

export default function TransactionList({
  transactions
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
        <Typography variant="h6" align="center" gutterBottom>
          No transactions available for the selected user and date range.
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body1" fontWeight="medium">Date</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="medium">Description</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="medium">Debit</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="medium">Credit</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="medium">Balance</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow key={transaction.txnId}>
                  <TableCell>{fDateTime(transaction.txnDate)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{fCurrency(transaction.debit)}</TableCell>
                  <TableCell>{fCurrency(transaction.credit)}</TableCell>
                  <TableCell>{fCurrency(transaction.balance)}</TableCell>
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
      />
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
};