import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { formatMonth } from './utils/dateFormatter';

const RevenueByDateChart = ( props ) => {

    const { data, type, view } = props;

    const [options, setOptions] = useState({});

    const groupedData = data?.reduce((acc, curr) => {
        const { order_date, customer_type, order_revenue, num_orders } = curr;
        const date = view === 'daily' ? order_date : view === 'monthly' ? formatMonth(curr.order_date.substring(0, 2)) : null;
        if (!acc[date]) {
          acc[date] = {};
        }
        if (!acc[date][customer_type]) {
          acc[date][customer_type] = { revenue: 0, orders: 0 };
        }
        acc[date][customer_type].revenue += order_revenue;
        acc[date][customer_type].orders += num_orders;
        return acc;
    }, {});

    const customerTypes = ['Existing', 'New'];

    const chartData = groupedData ? Object.entries(groupedData).map(([date, values]) => {
        const data = customerTypes.map((customer_type) => values[customer_type] || 0);
        return { order_date: date, data };
    }) : null;

    useEffect(() => {
        setOptions({
            title: {
                text: 'Revenue by Date',
                align: 'left'
            },
            chart: {
                type: 'column'
            },
            xAxis: {
                categories: chartData?.map((item) => item.order_date),
            },
            yAxis: [{
                labels: {
                    formatter: function() {
                        if(this.value > 999){
                            return this.value / 1000 + 'k';
                        }
                        return this.value
                    },
                },
                title: {
                    text: 'Existing Customer Revenue'
                },
                min: 0,
                tickInterval: 20000
                }, {
                labels: {
                    formatter: function() {
                        if(this.value > 999){
                            return this.value / 1000 + 'k';
                        }
                        return this.value
                    },
                },
                title: {
                    text: 'Total Orders'
                },
                min: 0,
                tickInterval: 650,
                opposite: true
            }],
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            return '$'+Math.floor(this.point.stackTotal);
                        },
                        style: {
                            fontWeight: 'bold',
                            textOutline: false
                          },
                        y: -30,
                        verticalAlign: 'top'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: 'gray'
                        },
                        formatter: function() {
                            return this.point.stackTotal;
                        }
                    }
                }
            },
            series: [
                {
                    type: 'column',
                    name: 'New Customer Revenue',
                    data: type === "All" ? chartData?.map((item) => parseFloat((item.data[1].revenue).toFixed(3)))
                     : 
                    type === "New" ? chartData?.map((item) => parseFloat((item.data[1].revenue).toFixed(3))) : [],
                },
                {
                    type: 'column',
                    name: 'Existing Customer Revenue',
                    data: type === "New" ? [] : type === "All" || "Existing" ? chartData?.map((item) => parseFloat((item.data[0].revenue).toFixed(3))) 
                    : [],
                
                    dataLabels: {
                        enabled: type === "Existing" ? true : false,
                        style: {
                            fontWeight: 'bold',
                            color: 'black'
                        },
                    }
                },
                {
                    type: 'spline',
                    yAxis: 1,
                    name: 'Total Orders',
                    data: type === "All" ? chartData?.map((item) => parseInt(item.data[0]?.orders) + parseInt(item.data[1]?.orders))
                     : 
                    type === "New" ? chartData?.map((item) => parseInt(item.data[1]?.orders)) 
                     : type === "Existing" ? chartData?.map((item) => parseInt(item.data[0]?.orders)) :
                    null,
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[1],
                        fillColor: 'white'
                    }
                },
                {
                    type: 'spline',
                    yAxis: 1,
                    name: 'New Customer Orders',
                    data: type === "All" ? chartData?.map((item) => parseFloat((item.data[1].orders).toFixed(3)))
                     : 
                     type === "New" ? chartData?.map((item) => parseFloat((item.data[1].orders).toFixed(3))) : [],
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'orange'
                    }
                },  
            ]   
        });
    }, [data]);

    return <div>{data ? <HighchartsReact highcharts={Highcharts} options={options} /> : <p>Loading chart...</p>}</div>;
};

export default RevenueByDateChart;
