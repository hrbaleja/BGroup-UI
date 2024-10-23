import PropTypes from 'prop-types';

import { TableRow, TableCell, } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

export default function SDataTableRow({ transaction, transactionAmount }) {
  return (
    <TableRow>
      <TableCell colSpan={5} align="left"><strong>Total Application:</strong> {transaction}</TableCell>
      <TableCell colSpan={4} align="right" ><strong>Total Amount:</strong> {fCurrency(transactionAmount)}</TableCell>
    </TableRow>
  );
}

SDataTableRow.propTypes = {
  transaction: PropTypes.number,
  transactionAmount: PropTypes.number,
};