import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const RevenueByWeekAndSourceChart = ( props ) => {

  const { data } = props;

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const getWeek = (date) => {
      const onejan = new Date(date.getFullYear(), 0, 1);
      return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    };

    const dataByWeek = data?.reduce((acc, item) => {
      const week = getWeek(new Date(item.order_date));
      const source = item.order_revenue_source;
      const revenue = item.order_revenue;

      if (!acc[week]) {
        acc[week] = {};
      }

      if (!acc[week][source]) {
        acc[week][source] = 0;
      }

      acc[week][source] += revenue;

      return acc;
    }, {});

    const dataFiltered = Object.keys(dataByWeek)
      .map((week) => {
        const sources = dataByWeek[week];
        const totalRevenue = Object.values(sources).reduce(
          (acc, revenue) => acc + revenue,
          0
        );

        return {
          week: parseInt(week),
          sources,
          totalRevenue,
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    const weekCategories = Object.keys(dataByWeek).map((week) =>
      parseInt(week)
    );
    const sourceCategories = Object.keys(
      dataFiltered[0] ? dataFiltered[0].sources : {}
    );

    const chartData = {
      chart: {
        type: "column",
      },
      title: {
        text: "Revenue by Source",
        align: 'left'
      },
      xAxis: {
        categories: weekCategories,
      },
      yAxis: {
        labels: {
            format: '{value} %'
        },
        min: 0,
        tickInterval: 20,
        title: {
            text: null
        }
      },
      legend: {
        reversed: true,
      },
      plotOptions: {
        column: {
          stacking: "percent",
        },
      },
      series: sourceCategories.map((source) => {
        return {
          name: source,
          data: dataFiltered.map((item) => item.sources[source] || 0),
        };
      }),
    };
    setChartData(chartData);
  }, [data]);

  return (
    <div>
      {chartData ? (
        <HighchartsReact highcharts={Highcharts} options={chartData} />
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default RevenueByWeekAndSourceChart;
