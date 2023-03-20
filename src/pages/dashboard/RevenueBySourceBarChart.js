import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const RevenueBySourceBarChart = ( props ) => {

    const { data } = props;

    const [options, setOptions] = useState({});

    const groupedData = data?.reduce((acc, curr) => {
        if (!acc[curr.order_revenue_source]) {
            acc[curr.order_revenue_source] = 0;
        }
        acc[curr.order_revenue_source] += curr.order_revenue;
        return acc;
    }, {});

    const chartData = groupedData ? Object.keys(groupedData).map((source) => ({
        source: source,
        revenue: groupedData[source],
    })) : null;

    const sortedData = chartData?.sort((a, b) => b.revenue - a.revenue);

    const sources = sortedData?.map((d) => d.source);
    const revenues = sortedData?.map((d) => d.revenue);

    useEffect(() => {
        setOptions({
            title: {
                text: 'Revenue by Source',
                align: 'left'
            },
            chart: {
                type: 'bar',
                zoomType: 'y'
            },
            xAxis: {
                categories: sources ? sources : null,
            },
            yAxis: {
                title: {
                    text: "Revenue",
                },
                tickInterval: 200000,
                labels: {
                    formatter: function() {
                        if(this.value > 999 && this.value < 999999){
                            return this.value / 1000 + 'k';
                        }
                        if(this.value > 999999){
                            return this.value / 1000000 + 'M';
                        }
                        return this.value
                    },
                },
            },
            series: [
                {
                    name: "Revenue",
                    data: revenues ? revenues : null,
                },
            ],
        });
    }, [data]);

    return <div>{data ? <HighchartsReact highcharts={Highcharts} options={options} /> : <p>Loading chart...</p>}</div>;
};

export default RevenueBySourceBarChart;
