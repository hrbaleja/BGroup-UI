import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { APIMESSAGES } from 'src/constants/messages';

export default function TableNoData({ query }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
          {query.length === 0 ? (
            <Typography variant="h4" paragraph>
              {APIMESSAGES.NO_DATA}
            </Typography>
          ) :
            (
              <>
                <Typography variant="h6" paragraph>
                  Not found
                </Typography>
                <Typography variant="body2">
                  No results found for &nbsp;
                  <strong>{`"${query}"`}</strong>.
                  <br /> Try checking for typos or using complete words.
                </Typography>
              </>
            )}
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};