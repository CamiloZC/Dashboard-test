import { Typography, Stack } from '@mui/material';

import MainCard from 'components/MainCard';
import AnalyticCard from './Card';

const AnalyticEcommerce = ({ title, isGeneral, isAverage, data, prevData, numDays }) => {

    const totalRevenue = data?.reduce((acc, item) => acc + item.order_revenue, 0);
    const totalOrders = data?.reduce((acc, item) => acc + item.num_orders, 0);
    const totalItems = data?.reduce((acc, item) => acc + item.item_quantity, 0);
    const newCustomers = data?.filter((item) => item.customer_type === 'New');
    const totalNewCustomers = newCustomers?.reduce((acc, item) => acc + item.num_orders, 0);
    const newCustomersRevenue = newCustomers?.reduce((acc, item) => acc + item.order_revenue, 0);
    const newCustomersPercentage = (newCustomersRevenue / totalRevenue) * 100;

    const avgRevenuePerDay = totalRevenue / numDays;
    const avgOrdersPerDay = totalOrders / numDays;
    const avgItemsPerOrder = totalItems / totalOrders;
    const avgOrderValue = totalRevenue / totalOrders;
    const avgNewCustomersPerDay = totalNewCustomers / numDays;

    const prevTotalRevenue = prevData?.reduce((acc, item) => acc + item.order_revenue, 0);
    const prevTotalOrders = prevData?.reduce((acc, item) => acc + item.num_orders, 0);
    const prevTotalItems = prevData?.reduce((acc, item) => acc + item.item_quantity, 0);
    const prevNewCustomers = prevData?.filter((item) => item.customer_type === 'New');
    const prevTotalNewCustomers = prevNewCustomers?.reduce((acc, item) => acc + item.num_orders, 0);
    const prevNewCustomersRevenue = prevNewCustomers?.reduce((acc, item) => acc + item.order_revenue, 0);
    const prevNewCustomersPercentage = (prevNewCustomersRevenue / prevTotalRevenue) * 100;

    const prevAvgRevenuePerDay = prevTotalRevenue / 30;
    const prevAvgOrdersPerDay = prevTotalOrders / 30;
    const prevAvgItemsPerOrder = prevTotalItems / prevTotalOrders;
    const prevAvgOrderValue = prevTotalRevenue / prevTotalOrders;
    const prevAvgNewCustomersPerDay = prevTotalNewCustomers / 30;

    const totalRevenueChange = ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100;
    const totalOrdersChange = ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100;
    const newCustomersChange = ((totalNewCustomers - prevTotalNewCustomers) / prevTotalNewCustomers) * 100;
    const newCustomerRevenuePercentChange = ((newCustomersPercentage - prevNewCustomersPercentage) / prevNewCustomersPercentage) * 100;

    const avgRevenuePerDayChange = ((avgRevenuePerDay - prevAvgRevenuePerDay) / prevAvgRevenuePerDay) * 100;
    const avgOrdersPerDayChange = ((avgOrdersPerDay - prevAvgOrdersPerDay) / prevAvgOrdersPerDay) * 100;
    const avgItemsPerOrderChange = ((avgItemsPerOrder - prevAvgItemsPerOrder) / prevAvgItemsPerOrder) * 100;
    const avgOrderValueChange = ((avgOrderValue - prevAvgOrderValue) /  prevAvgOrderValue) * 100;
    const avgNewCustomersPerDayChange = ((avgNewCustomersPerDay - prevAvgNewCustomersPerDay) / prevAvgNewCustomersPerDay) * 100;
    
    const formatNumber = (count) => {
        if(count > 9999 && count < 999999){
            return ((count/1000).toFixed(2)).toString()+"k";
        }
        if(count > 999999){
            return ((count/1000000).toFixed(2)).toString()+"M";
        }
        else{
            return ((count).toFixed(2)).toString();
        }
    }

    const formatPercent = (count) => {
        return ((count).toFixed(2)).toString()+"%";
    }

    const generalMetrics = [
        {
            count: totalRevenue ? formatNumber(totalRevenue) : 0,
            percentage: totalRevenueChange ? formatPercent(totalRevenueChange) : 0,
            subInfo: 'Total revenue'
        },
        {
            count: totalOrders ? formatNumber(totalOrders) : 0,
            percentage: totalOrdersChange ? formatPercent(totalOrdersChange) : 0,
            subInfo: 'Total orders'
        },
        {
            count: totalNewCustomers ? formatNumber(totalNewCustomers) : 0,
            percentage: newCustomersChange ? formatPercent(newCustomersChange) : 0,
            subInfo: 'New customers'
        },
        {
            count: newCustomersPercentage ? formatPercent(newCustomersPercentage) : 0,
            percentage: newCustomerRevenuePercentChange ? formatPercent(newCustomerRevenuePercentChange) : 0,
            subInfo: '% New Customers Revenue'
        }
    ];

    const averagePerformance = [
        {
            count: avgRevenuePerDay ? formatNumber(avgRevenuePerDay) : 0,
            percentage: avgRevenuePerDayChange ? formatPercent(avgRevenuePerDayChange) : 0,
            subInfo: 'Av Revenue/Day'
        },
        {
            count: avgOrdersPerDay ? Math.trunc(formatNumber(avgOrdersPerDay)) : 0,
            percentage: avgOrdersPerDayChange ? formatPercent(avgOrdersPerDayChange) : 0,
            subInfo: 'Avg Orders/Day'
        },
        {
            count: avgItemsPerOrder ? formatNumber(avgItemsPerOrder) : 0,
            percentage: avgItemsPerOrderChange ? formatPercent(avgItemsPerOrderChange) : 0,
            subInfo: 'Avg Items/Order'
        },
        {
            count: avgOrderValue ? formatNumber(avgOrderValue) : 0,
            percentage: avgOrderValueChange ? formatPercent(avgOrderValueChange) : 0,
            subInfo: 'Avg Order Value'
        },
        {
            count: avgNewCustomersPerDay ? Math.trunc(formatNumber(avgNewCustomersPerDay)) : 0,
            percentage: avgNewCustomersPerDayChange ? formatPercent(avgNewCustomersPerDayChange) : 0,
            subInfo: 'Avg New Customers/Day'
        }
    ];

    return (
        <MainCard contentSX={{ p: 2.25 }}>
            <Typography variant="h4" mb={1.5}>
                {title}
            </Typography>
            {isGeneral ? (
                <Stack spacing={0.5} direction="row">
                    {generalMetrics.map((metric) => (
                        <AnalyticCard
                            count={metric.count}
                            percentage={metric.percentage}
                            subInfo={metric.subInfo}
                        />
                    ))}
                </Stack>
            ) : null}
            {isAverage ? (
                <Stack spacing={0.5} direction="row">
                    {averagePerformance.map((metric) => (
                        <AnalyticCard
                            count={metric.count}
                            percentage={metric.percentage}
                            subInfo={metric.subInfo}
                        />
                    ))}
                </Stack>
            ) : null}
        </MainCard>
    );
}

export default AnalyticEcommerce;
