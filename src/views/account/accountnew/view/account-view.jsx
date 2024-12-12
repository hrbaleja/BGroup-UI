import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Grid, Paper, Stack, Button, Select, Tooltip, MenuItem, Container, Typography, InputLabel, FormControl, } from '@mui/material';

import { PATHS } from 'src/routes/routes';

import { fCurrency } from 'src/utils/format-number';
import { fDateDDMMYYYY } from 'src/utils/format-time';

// import PDFViewer from 'src/function/pdf';
import { addPDFHeader } from 'src/function/export';
import AccountsService from 'src/services/account/accountsService';
import TransactionService from 'src/services/account/transactionService';

import Iconify from 'src/components/iconify';

import TransactionList from '../../account/transaction-list';
// import addPDFHeader from 'src/function/export';

export default function AccountView() {
  const [selectedUser, setSelectedUser] = useState('');
  const [customer, setCustomer] = useState([]);
  const [toDate, setToDate] = useState(dayjs());
  const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  // const documentData = {
  //   id: 'D9E69CAA-61C7-4F55-B61C-A0A61DD79B59',
  //   title: 'Inovoice ',
  //   date: new Date(),
  //   author: 'John Doe',

  // };
  const fetchAccounts = useCallback(async () => {
    try {
      const response = await AccountsService.fetchCustomersdropdown();
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleUserChange = async (event) => {
    const selectedUserId = event.target.value;
    setSelectedUser(selectedUserId);
    const selectedUserDetails = customer.find(user => user._id === selectedUserId);
    if (selectedUserDetails) {
      setSelectedUserInfo({
        balance: selectedUserDetails.balance,
        updatedAt: selectedUserDetails.updatedAt,
      });
    }
    await handleSearch();
  };

  const handleFromDateChange = (newValue) => {
    setFromDate(newValue);
    if (toDate && newValue && newValue.isAfter(toDate)) {
      setToDate(null);
    }
  };

  const handleToDateChange = (newValue) => {
    setToDate(newValue);
  };

  const handleSearch = async () => {
    const payload = {
      customerId: selectedUser,
      fromDate: fromDate.format('YYYY-MM-DD'),
      toDate: toDate.format('YYYY-MM-DD'),
    };
    try {
      const transactionsResponse = await TransactionService.fetchTransactions(payload);
      setTransactions(transactionsResponse);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleExport = async () => {
    const payload = {
      customerId: selectedUser,
      fromDate: fromDate.format('YYYY-MM-DD'),
      toDate: toDate.format('YYYY-MM-DD'),
    };

    try {
      const transactionsResponse = await TransactionService.fetchTransactions(payload);
      if (transactionsResponse && transactionsResponse.length > 0) {
        const doc = new jsPDF();
        addPDFHeader(doc)
        doc.setFontSize(16);
        // doc.setTextColor(255, 98, 0)
        doc.setFont('Helvetica', 'bold');
        doc.text('Transaction Report', 105, 31, { align: 'center' });
        doc.setFont('Helvetica', 'normal');
        const selectedUserName = customer.find(user => user._id === selectedUser)?.name || 'Unknown';
        const selectedUserBalance = selectedUserInfo?.balance ?? 'N/A';
        const lastUpdatedAt = dayjs(selectedUserInfo?.updatedAt).format('DD-MM-YYYY HH:mm') || 'N/A';
        const lineHeight = 6;
        doc.setFontSize(12);
        // User details
        doc.text(`Name: ${selectedUserName}`, 2, 35);
        doc.text(`Balance: ${selectedUserBalance}`, 2, 35 + lineHeight); // Adjusted line position
        doc.text(`Last Updated: ${lastUpdatedAt}`, 2, 35 + 2 * lineHeight);
        // Prepare data for autoTable
        const tableData = transactionsResponse.map((transaction) => ({
          Date: fDateDDMMYYYY(transaction.txnDate),
          Description: transaction.description,
          Debit: fCurrency(transaction.debit),
          Credit: fCurrency(transaction.credit),
          Balance: fCurrency(transaction.balance),
        }));
        // Create the table in the PDF
        autoTable(doc, {
          head: [['No', 'Date', 'Description', 'Debit', 'Credit', 'Balance']],
          body: tableData.map((item, index) => [index + 1, item.Date, item.Description, item.Debit, item.Credit, item.Balance]),
          margin: { top: 3, left: 3, right: 3, bottom: 3 },
          startY: 60,
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 40 },
            2: { cellWidth: 60 },
            3: { cellWidth: 29, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' },
            5: { cellWidth: 35, halign: 'right' },
          },
          headStyles: {
            halign: 'center',
          },
        });
        doc.save(`${generateRandomNumber()}.pdf`);
      } else {
        console.error('No transactions available for download');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  function generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  const handleSendSMS = async () => {
    const payload = {
      customerId: selectedUser,
      message: `Your transactions from ${fromDate.format('DD-MM-YYYY')} to ${toDate.format('DD-MM-YYYY')} are ready.`,
    };
    try {
      // Call the SMS API
      const response = await TransactionService.sendSMS(payload);
      console.log('SMS sent:', response);
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

  return (
    <Container maxWidth="xl" >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Account Overview</Typography>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="fluent-color:clipboard-48" />}
          aria-label="Create new account"
          onClick={() => navigate(PATHS.ACCOUNT)}
        >
          Old
        </Button>
      </Stack>

      <Paper sx={{ padding: 2, mb: 4 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={handleFromDateChange}
                format="DD-MM-YYYY"
                fullWidth
                slotProps={{ textField: { variant: 'outlined', size: 'small', fullWidth: true, } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={handleToDateChange}
                minDate={fromDate}
                fullWidth
                format="DD-MM-YYYY"
                slotProps={{
                  textField: { variant: 'outlined', size: 'small', fullWidth: true, }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" size='small'>
              <InputLabel id="user-select-label">Select User</InputLabel>
              <Select
                labelId="user-select-label"
                value={selectedUser}
                onChange={handleUserChange}
                label="Select User"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                    },
                  },
                }}
              >
                {customer?.length > 0 ? (
                  customer.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No users available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Stack direction="row" spacing={1} justifyContent="right" alignItems="right">
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="eva:search-fill" />}
                onClick={handleSearch}
              >Search
              </Button>
              <Tooltip title="Export Data" arrow>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleExport}
                  sx={{ minWidth: 0, padding: 1 }}
                >
                  <Iconify icon="eva:download-fill" />
                </Button>
              </Tooltip>
              <Tooltip title="Send SMS" arrow>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleSendSMS}
                  sx={{ minWidth: 0, padding: 1 }}
                >
                  <Iconify icon="eva:message-square-fill" />
                </Button>
              </Tooltip>
            </Stack>
          </Grid>
          {selectedUserInfo && (
            <Grid item xs={12}>
              <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                <Grid item>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    style={{
                      color:
                        selectedUserInfo.balance > 0 ? 'green' : 'red',
                    }}
                  >
                    Current Balance: {selectedUserInfo.balance}
                  </Typography>

                </Grid>
                <Grid item>
                  <Typography variant="body1" textAlign="right" fontWeight="medium">
                    Last Updated At: {dayjs(selectedUserInfo.updatedAt).format('DD-MM-YYYY HH:mm')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}

        </Grid>
      </Paper>
      <Grid item xs={12}>
        {transactions.length > 0 && (
          <TransactionList transactions={transactions} />
        )}
      </Grid>
      {/* <Grid item xs={12}>
        <PDFViewer documentData={documentData} />
      </Grid> */}
    </Container >
  );
}