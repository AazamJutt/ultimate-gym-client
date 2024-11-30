import { ApexOptions } from 'apexcharts';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Datepicker from 'react-tailwindcss-datepicker';
import { useGetSalesQuery } from '../../services/dashboard.service';

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

const ChartTwo: React.FC = () => {
  const [filter, setFilter] = useState({
    type: 'month',
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD'),
  });
  const { data, refetch } = useGetSalesQuery(filter);
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Profit this week
          </h4>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex items-center mb-3">
          <select
            className="mr-3 p-2 border border-stroke dark:border-strokedark rounded bg-white text-black dark:bg-gray-700 dark:text-white"
            value={filter?.type || 'day'}
            onChange={(e) =>
              setFilter((prev: any) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        <Datepicker
          showFooter
          useRange={false}
          toggleClassName="absolute bg-secondary rounded-r-lg text-black right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          value={{
            startDate: filter?.startDate ? moment(filter?.startDate) : null,
            endDate: filter?.endDate ? moment(filter?.endDate) : null,
          }}
          onChange={(newValue) => {
            setFilter((prev: any) => ({
              ...prev,
              startDate: newValue?.startDate
                ? moment(newValue?.startDate).format('YYYY-MM-DD')
                : '',
              endDate: newValue?.endDate
                ? moment(newValue?.endDate).format('YYYY-MM-DD')
                : '',
            }));
          }}
          showShortcuts={true}
        />
      </div>
      </div>
      <div>
        {data?.data?.series && (
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
              options={{
                ...options,
                xaxis: { ...options.xaxis, categories: data?.data?.labels },
              }}
              series={data?.data?.series}
            type="bar"
            height={350}
          />
        </div>
        )}
      </div>
    </div>
  );
};

export default ChartTwo;
