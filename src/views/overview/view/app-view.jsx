import Cookies from 'js-cookie';
import { faker } from '@faker-js/faker';
import React, { useState, useEffect, useCallback } from 'react';

// import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Tab, Tabs, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import TaskService from 'src/services/overview/TaskService';
import SectorService from 'src/services/overview/sectorService';
import CompanyStatisticsService from 'src/services/overview/dashboard';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const [taskss, setTasks] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [sectorData, setSectorData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);

  const [chartData1, setChartData1] = useState({
    labels: [],
    series: [],
  });
  const [chartData, setChartData] = useState({
    labels: [],
    mainSeries: [],
    smeSeries: [],
    companySeries: [],
  });
  const username = Cookies.get('username');

  const fetchCompany = useCallback(async () => {
    try {
      const data = await CompanyStatisticsService.fetchCompanyStatistics();
      setStatistics(data);
      const chartDatas = transformChartData(data.companyData);
      setChartData(chartDatas);
    } catch (error) {
      console.error('Error fetching company statistics:', error);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const fetchedTasks = await TaskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  const fetchSector = useCallback(async () => {
    try {
      const sectors = await SectorService.getLatestSectorValues();
      const formattedData = sectors.map((sector) => ({
        label: sector.name,
        value: parseFloat(sector.value),
      }));
      setSectorData(formattedData);
      // Calculate total value
      const sum = formattedData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.value,
        0
      );
      setTotalValue(sum);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  const fetchSectorData = useCallback(async () => {
    try {
      const sectors = await SectorService.getAllSectors();
      const transformedData = transformChartData1(sectors);
      setChartData1(transformedData);
    } catch (error) {
      console.error('Error fetching sector data:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchCompany();
    fetchSector();
    fetchSectorData();
  }, [fetchTasks, fetchCompany, fetchSector, fetchSectorData]);

  const transformChartData = (data) => {
    const currentYear = new Date().getFullYear();
    const labels = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
    const mainSeries = Array(12).fill(0);
    const smeSeries = Array(12).fill(0);
    const companySeries = Array(12).fill(0);

    data.forEach((item) => {
      const itemYear = new Date(item.endDate).getFullYear();
      if (itemYear === currentYear) {
        const month = new Date(item.endDate).getMonth();
        companySeries[month] += 1;
        if (item.isMain) {
          mainSeries[month] += 1;
        } else {
          smeSeries[month] += 1;
        }
      }
    });
    return { labels, mainSeries, smeSeries, companySeries };
  };

  const transformChartData1 = (data) => {
    // Sort data by date
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get unique dates and sector names
    const uniqueDates = [...new Set(data.map((item) => item.date))];
    const uniqueSectors = [...new Set(data.map((item) => item.name))];

    // Create series data
    const series = uniqueSectors.map((sector) => ({
      name: sector,
      type: 'line',
      fill: 'solid',
      data: uniqueDates.map((date) => {
        const item = data.find((d) => d.date === date && d.name === sector);
        return item ? item.value : null;
      }),
    }));

    return {
      labels: uniqueDates.map((date) => new Date(date).getTime()), 
      series,
    };
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, {username}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Amount" />
            <Tab label="Companies" />
            <Tab label="Others" />
          </Tabs>
        </Stack>
      </Stack>
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Bank Turnover"
              total={statistics.transactionAmount}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/ic_galss_money.jpg" />}
              to="/account"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Credit Bank Balance"
              total={statistics.creditBalance || 0}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_credit.jpg" />}
              to="/account"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Debit Bank Balance"
              total={statistics.debitBalance || 0}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_debit.jpg" />}
              to="/account"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Users"
              total={statistics.user || 0}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_users.png" />}
              to="/user"
            />
          </Grid>
          <Grid xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Sector Values Over Time"
              subheader="Daily sector value trends"
              chart={chartData1}
            />
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title={`Current Portflio Value: ${fCurrency(totalValue)}`}
              chart={{ series: sectorData }}
            />
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Amount"
              total={statistics.amount}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/ic_galss_money.jpg" />}
              to="/transaction"

            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Main Companies"
              total={statistics.mainCompany}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
              to="/companies"

            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="SME Companies"
              total={statistics.smeCompany}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
              to="/companies"

            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Users"
              total={statistics.dematuser || 0}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_users.png" />}
              to="/account"

            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Total Companies"
              subheader="Main and SME IPO Count"
              chart={{
                labels: chartData.labels,
                series: [
                  {
                    name: 'Main Companies',
                    type: 'column',
                    fill: 'solid',
                    data: chartData.mainSeries,
                  },
                  {
                    name: 'SME Companies',
                    type: 'area',
                    fill: 'gradient',
                    data: chartData.smeSeries,
                  },
                  {
                    name: 'Companies',
                    type: 'area',
                    fill: 'gradient',
                    data: chartData.companySeries,
                  },
                ],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chart={{
                series: [
                  { label: 'America', value: 4344 },
                  { label: 'Asia', value: 5435 },
                  { label: 'Europe', value: 1443 },
                  { label: 'Africa', value: 4443 },
                ],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chart={{
                series: [
                  { label: 'Italy', value: 400 },
                  { label: 'Japan', value: 430 },
                  { label: 'China', value: 448 },
                  { label: 'Canada', value: 470 },
                  { label: 'France', value: 540 },
                  { label: 'Germany', value: 580 },
                  { label: 'South Korea', value: 690 },
                  { label: 'Netherlands', value: 1100 },
                  { label: 'United States', value: 1200 },
                  { label: 'United Kingdom', value: 1380 },
                ],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chart={{
                categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
                series: [
                  { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                  { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                  { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                ],
              }}
            />
          </Grid>
        </Grid>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid xs={12} md={6} lg={8}>
            <AppTasks title="Tasks" subheader={`You have ${taskss.length} pending tasks`} />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.string.uuid(),
                title: faker.person.jobTitle(),
                description: faker.commerce.productDescription(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.string.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
