import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import PropTypes from 'prop-types';
import autoTable from 'jspdf-autotable';
import React, { useState } from 'react';

import { Box, Card, Paper, Button, Snackbar, IconButton, Typography, CardContent, } from '@mui/material';

import { COMPANY_NAME } from "src/constants/overview";

import Iconify from 'src/components/iconify';

import { logoBase64 } from "./logo";

// PDF Header function
export function addPDFHeader(doc) {
    const logoWidth = 20;
    const logoHeight = 20;
    doc.addImage(logoBase64, 'PNG', 2, 2, logoWidth, logoHeight);

    doc.setFontSize(18);
    doc.setTextColor('#FF6200');
    doc.setFont('Helvetica', 'bold');

    const companyText = COMPANY_NAME;
    const textWidth = doc.getTextWidth(companyText);
    const xCenter = (doc.internal.pageSize.getWidth() - textWidth) / 2.5;
    doc.text(companyText, xCenter, 12);

    // Add current date
    const currentDate = dayjs().format('DD/MM/YYYY');
    doc.setFontSize(10);
    doc.setTextColor('#000');
    doc.text(`Date: ${currentDate}`, doc.internal.pageSize.getWidth() - 40, 8);

    // Add geometric designs
    doc.setFillColor('#FF6200');
    doc.triangle(150, 0, 180, 0, 165, 24, 'F');

    doc.setFillColor('#1a3352');
    doc.triangle(170, 0, 200, 0, 185, 24, 'F');

    doc.setFillColor('#FF6200');
    doc.triangle(190, 0, 230, 0, 205, 24, 'F');

    // Add separator line
    doc.setLineWidth(0.2);
    doc.setDrawColor(255, 98, 0);
    doc.line(0, 25, 250, 25);

    doc.setTextColor(0, 0, 0);
}

// Generate PDF function
export const generatePDF = (data, fileName = 'document.pdf') => {
    const doc = new jsPDF();

    // Add header
    addPDFHeader(doc);

    // Add content starting position after header
    const startY = 40;

    // Add title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Document Details', 14, startY);

    // Convert data to table format
    const tableData = Object.entries(data).map(([key, value]) => [
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        value?.toString() || ''
    ]);

    // Add table
    autoTable(doc, {
        startY: startY + 10,
        head: [['Field', 'Value']],
        body: tableData,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 5
        },
        headStyles: {
            fillColor: [255, 98, 0],
            textColor: [255, 255, 255]
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });

    return doc;
};

// MUI PDF Viewer Component
const PDFViewer = ({ documentData }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [pdfVisible, setPdfVisible] = useState(false);
    const [pdfURL, setPdfURL] = useState('');
   
    // const handleView = () => {
    //     const doc = generatePDF(documentData);
    //     const pdfURL = doc.output('bloburl');
    //     window.open(pdfURL, '_blank');
    // };

    const handleView = () => {
        const doc = generatePDF(documentData);
        const url = doc.output('dataurlstring');
        setPdfURL(url);
        setPdfVisible(true);
    };

    // Usage example
    // handleView('open'); // to open the PDF in a new tab
    // handleView('embed'); // to embed the PDF in an iframe


    const handleDownload = () => {
        const fileName = `${documentData.title || 'document'}-${dayjs().format('YYYYMMDD')}.pdf`;
        const doc = generatePDF(documentData, fileName);
        doc.save(fileName);
    };

    const handleShare = async () => {
        const shareableLink = `${window.location.origin}/view/${documentData.id}`;

        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(shareableLink);
                setSnackbar({
                    open: true,
                    message: 'Link copied to clipboard!'
                });
            } catch (err) {
                console.error('Failed to copy link:', err);
                setSnackbar({
                    open: true,
                    message: 'Failed to copy link'
                });
            }
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareableLink;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setSnackbar({
                    open: true,
                    message: 'Link copied to clipboard!'
                });
            } catch (err) {
                console.error('Failed to copy link:', err);
                setSnackbar({
                    open: true,
                    message: 'Failed to copy link'
                });
            } finally {
                document.body.removeChild(textArea);
            }
        }
    };


    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
            <Paper elevation={3}>
                <Card>
                    <CardContent>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 3
                        }}>
                            <Box>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {documentData.title || 'Document'}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'text.secondary'
                                }}>
                                    <Iconify
                                        icon="ic:baseline-calendar-today"
                                        sx={{
                                            mr: 1,
                                            width: 18,
                                            height: 18
                                        }}
                                    />
                                    <Typography variant="body2">
                                        {dayjs(documentData.date).format('DD/MM/YYYY')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={
                                    <Iconify
                                        icon="ic:baseline-share"
                                        width={20}
                                        height={20}
                                    />
                                }
                                onClick={handleShare}
                                sx={{ ml: 2 }}
                            >
                                Share
                            </Button>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="inherit"
                                startIcon={
                                    <Iconify
                                        icon="ic:baseline-visibility"
                                        width={20}
                                        height={20}
                                    />
                                }
                                onClick={handleView}
                            // sx={{
                            //     bgcolor: theme.palette.primary.dark,
                            //     '&:hover': {
                            //         bgcolor: theme.palette.primary.dark
                            //     }
                            // }}
                            >
                                View PDF
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="inherit"

                                startIcon={
                                    <Iconify
                                        icon="ic:baseline-download"
                                        width={20}
                                        height={20}
                                    />
                                }
                                onClick={handleDownload}
                            >
                                Download PDF
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Paper>
            {pdfVisible && (
                <Box sx={{ mt: 2, border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
                    <iframe
                        src={pdfURL}
                        width="100%"
                        height="600px"
                        title="PDF Viewer"
                    />
                </Box>
            )}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                action={
                    <IconButton
                        size="small"
                        color="inherit"
                        onClick={handleCloseSnackbar}
                    >
                        <Iconify
                            icon="ic:baseline-close"
                            width={16}
                            height={16}
                        />
                    </IconButton>
                }
            />
        </Box>
    );
};

PDFViewer.propTypes = {
    documentData: PropTypes.shape({
        title: PropTypes.string,
        id: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date)
    }).isRequired
};


export default PDFViewer;