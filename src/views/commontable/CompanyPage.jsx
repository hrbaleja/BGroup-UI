import React, { useState, useEffect, useCallback } from 'react';

import Switch from '@mui/material/Switch';

import CompanyService from 'src/services/company/companyService';

import DataTableRow from './company-table-row';
import CommonTablePage from './CommonTablePage';
import CreateCompanyDialog from './CreateCompanyDialog';

export default function CompanyView() {
  const [companies, setCompanies] = useState([]);
  const [isArchived, setIsArchived] = useState(false);

  const fetchCompanies = useCallback(async () => {
    try {
      const response = await CompanyService.getCompanies(!isArchived);
      setCompanies(response);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  }, [isArchived]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'industry', label: 'Industry' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'endDate', label: 'End Date' },
    { id: 'amount', label: 'Amount' },
    { id: 'lotSize', label: 'Lot Size' },
    { id: 'isMain', label: 'Category' },
    { id: '', label: 'Action' },
  ];

  return (
    <><Switch
    checked={isArchived}
    onChange={(e) => setIsArchived(e.target.checked)}
  />
    <CommonTablePage
      title="Company Information"
      data={companies}
      columns={columns}
      RowComponent={DataTableRow}
      CreateDialog={CreateCompanyDialog}
      fetchData={fetchCompanies}
      createItem={CompanyService.createCompany}
    /></>
    
  );
}