import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Paper, Table, TableRow, TableBody, TableCell, TableHead, Typography, TableContainer, TablePagination, } from '@mui/material';

const TransactionList = ({ transactions }) => {
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
          No transactions found
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
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Debit</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow key={transaction.txnId}>
                  <TableCell>{new Date(transaction.txnDate).toLocaleString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.debit}</TableCell>
                  <TableCell>{transaction.credit}</TableCell>
                  <TableCell>{transaction.balance}</TableCell>
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

export default TransactionList;


//   try (BufferedReader br = new BufferedReader(new FileReader("foo.txt"))) {
//     String line;
//     while ((line = br.readLine()) != null) {
//         System.out.println(line);
//     }
//  }