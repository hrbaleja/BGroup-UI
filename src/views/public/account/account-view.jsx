// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import { Grid,  Stack, Button, Container, Typography,  } from '@mui/material';

// import { Grid, Paper, Stack, Button, Select, Tooltip, MenuItem, Container, Typography, InputLabel, FormControl, } from '@mui/material';

// import { fCurrency } from 'src/utils/format-number';
// import { fDateDDMMYYYY } from 'src/utils/format-time';

// // import PDFViewer from 'src/function/pdf';
// import { addPDFHeader } from 'src/function/export';
import PublicService from 'src/services/public/publicService';

import Iconify from 'src/components/iconify';

import TransactionList from '../../account/account/transaction-list';

export default function AccountView() {
    const [transactions, setTransactions] = useState([]);
    const { id } = useParams();

    const handleGetTransactions = useCallback(async () => {
        try {
            const fetchedTransactions = await PublicService.getTransactionsByCustomerId(id);
            setTransactions(fetchedTransactions);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        }
    }, [id]);

    useEffect(() => {
        handleGetTransactions()
    }, [handleGetTransactions]);


   

    // const handleExport = async () => {

    //     try {
    //         const fetchedTransactions = await PublicService.getTransactionsByCustomerId(id);
    //         if (fetchedTransactions && fetchedTransactions.length > 0) {
    //             const doc = new jsPDF();
    //             addPDFHeader(doc)
    //             doc.setFontSize(16);
    //             // doc.setTextColor(255, 98, 0)
    //             doc.text('Transaction Report', 105, 31, { align: 'center' });
    //             const selectedUserName =  'Unknown';
    //             const selectedUserBalance = 1.00;
    //             const lastUpdatedAt = 'N/A';
    //             const lineHeight = 6;
    //             doc.setFontSize(12);
    //             // User details
    //             doc.text(`Name: ${selectedUserName}`, 2, 35);
    //             doc.text(`Balance: ${selectedUserBalance}`, 2, 35 + lineHeight); // Adjusted line position
    //             doc.text(`Last Updated: ${lastUpdatedAt}`, 2, 35 + 2 * lineHeight);
    //             // Prepare data for autoTable
    //             const tableData = fetchedTransactions.map((transaction) => ({
    //                 Date: fDateDDMMYYYY(transaction.txnDate),
    //                 Description: transaction.description,
    //                 Debit: fCurrency(transaction.debit),
    //                 Credit: fCurrency(transaction.credit),
    //                 Balance: fCurrency(transaction.balance),
    //             }));
    //             // Create the table in the PDF
    //             autoTable(doc, {
    //                 head: [['No', 'Date', 'Description', 'Debit', 'Credit', 'Balance']],
    //                 body: tableData.map((item, index) => [index + 1, item.Date, item.Description, item.Debit, item.Credit, item.Balance]),
    //                 margin: { top: 3, left: 3, right: 3, bottom: 3 },
    //                 startY: 60,
    //                 columnStyles: {
    //                     0: { cellWidth: 10 },
    //                     1: { cellWidth: 40 },
    //                     2: { cellWidth: 60 },
    //                     3: { cellWidth: 29, halign: 'right' },
    //                     4: { cellWidth: 30, halign: 'right' },
    //                     5: { cellWidth: 35, halign: 'right' },
    //                 },
    //                 headStyles: {
    //                     halign: 'center',
    //                 },
    //             });
    //             doc.save(`${generateRandomNumber()}.pdf`);
    //         } else {
    //             console.error('No transactions available for download');
    //         }
    //     } catch (error) {
    //         console.error('Error downloading PDF:', error);
    //     }
    // };

    // function generateRandomNumber() {
    //     return Math.floor(100000 + Math.random() * 900000).toString();
    // }

    return (
        <Container maxWidth="xl" >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={5}>
                <Typography variant="h4">Account Overview</Typography>
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    aria-label="Create new account"
                >
                Help
                </Button>
            </Stack>

            <Grid item xs={12}>
                {transactions.length > 0 && (
                    <TransactionList transactions={transactions} />
                )}
            </Grid>
        </Container >
    );
}