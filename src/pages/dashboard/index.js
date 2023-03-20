import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useData } from 'hooks/useData';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import RevenueBySourceBarChart from './RevenueBySourceBarChart';
import RevenueByDateChart from './RevenueByDateChart';

import { getDaysAgoData, getrPrevDaysAgoData, sortedDataByDate } from './utils/sorterAndFilter';
import RevenueByWeekAndSourceChart from './RevenueBySourceStackedChart';
import ReactDatePicker from 'react-datepicker';
import './styles/index.scss'
import 'react-datepicker/dist/react-datepicker.css';


const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //


const DashboardDefault = () => {
    const [view, setView] = useState('daily');

    useData();

    const data = useSelector(state => state.Data.data)
    
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [numDays, setNumDays] = useState(30);
    const [filteredData, setFilteredData] = useState([]);
    const [prevData, setPrevData] = useState([]);
    const [type, setType] = useState("All");

    const rangedData = getDaysAgoData(data);
    const prevRangedData = getrPrevDaysAgoData(data);

    const handleDateChange = (date, type) => {
        if (type === 'start') {
            setStartDate(date);
        } else if (type === 'end') {
            setEndDate(date);
        }
    };
      
    useEffect(() => {
        if (startDate && endDate) {
            const filtered = data.filter((item) => {
                const itemDate = new Date(item.order_date);
                return itemDate >= startDate && itemDate <= endDate;
            });
            setFilteredData(sortedDataByDate(filtered));
            setNumDays(Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
        }else{
            setFilteredData(sortedDataByDate(rangedData));
        }
    }, [data, startDate, endDate]);

    useEffect(() => {
        if (startDate && endDate) {
            let t = startDate;
            let d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 30);         
            const prev = data.filter((item) => {
                const itemDate = new Date(item.order_date);
                return itemDate > d && itemDate < t;
            })
            setPrevData(sortedDataByDate(prev));
        }else{
            setPrevData(sortedDataByDate(prevRangedData));
        }
    }, [data, startDate, endDate]);

    const parsedData = filteredData?.map((item) => ({
        ...item,
        order_revenue: parseFloat(parseFloat(item.order_revenue).toFixed(3)),
        num_orders: parseInt(item.num_orders),
        item_quantity: parseInt(item.item_quantity)
    }));

    const prevParsedData = prevData?.map((item) => ({
        ...item,
        order_revenue: parseFloat(parseFloat(item.order_revenue).toFixed(3)),
        num_orders: parseInt(item.num_orders),
        item_quantity: parseInt(item.item_quantity)
    }));

    const filteredDataByType = parsedData?.filter((item) => {
        if (type === "All") {
            return true;
        } else {
            return item.customer_type === type;
        }
    });

    const filteredPrevDataByType = prevParsedData?.filter((item) => {
        if (type === "All") {
            return true;
        } else {
            return item.customer_type === type;
        }
    });

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75} p={5}>

            <Grid item xs={24} md={12} lg={12}>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                    <Stack spacing={0.5} direction="row" ml={5} gap={5} height={50} alignItems="center">
                        <Typography variant="h5">Filters</Typography>
                        <Typography variant="h8" mr={0}>Customer type:</Typography>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="All">All</option>
                            <option value="New">New</option>
                            <option value="Existing">Existing</option>
                        </select>
                        <Typography variant="h8" mr={0}>Data range:</Typography>
                        <ReactDatePicker
                            selected={startDate}
                            selectsStart
                            onChange={(date) => handleDateChange(date, 'start')}
                            placeholderText="Start Date"
                        />
                        <ReactDatePicker
                            selected={endDate}
                            onChange={(date) => handleDateChange(date, 'end')}
                            placeholderText="End Date"
                        />
                        <Typography variant="h8" pl={20}>View options:</Typography>
                        <Button
                            size="small"
                            onClick={() => setView('monthly')}
                            color={view === 'monthly' ? 'primary' : 'secondary'}
                            variant={view === 'monthly' ? 'outlined' : 'text'}
                        >
                            Monthly
                        </Button>
                        <Button
                            size="small"
                            onClick={() => setView('daily')}
                            color={view === 'daily' ? 'primary' : 'secondary'}
                            variant={view === 'daily' ? 'outlined' : 'text'}
                        >
                            Daily
                        </Button>
                    </Stack>
                </MainCard>
            </Grid>

            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Revenue Overview</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={6}>
                <AnalyticEcommerce 
                    title="General Metrics" 
                    isGeneral={true} 
                    data={filteredDataByType ? filteredDataByType : rangedData} 
                    prevData={filteredPrevDataByType} 
                    numDays={numDays}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={6}>
                <AnalyticEcommerce 
                    title="Average Performance" 
                    isAverage={true} 
                    data={filteredDataByType ? filteredDataByType : rangedData} 
                    prevData={filteredPrevDataByType} 
                    numDays={numDays}
                />
            </Grid>

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            <Grid item xs={24} md={12} lg={12}>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                        <RevenueByDateChart data={filteredDataByType ? filteredDataByType : rangedData} type={type} view={view}/>
                    </Box>
                </MainCard>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
                <MainCard sx={{ mt: 1.75 }}>
                    <RevenueByWeekAndSourceChart data={filteredDataByType ? filteredDataByType : rangedData}/>
                </MainCard>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
                <MainCard sx={{ mt: 1.75 }}>
                    <RevenueBySourceBarChart data={filteredDataByType ? filteredDataByType : rangedData} view={view}/>
                </MainCard>
            </Grid>

        </Grid>
    );
};

export default DashboardDefault;
