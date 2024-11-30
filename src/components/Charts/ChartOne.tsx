import { ApexOptions } from 'apexcharts';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Datepicker from 'react-tailwindcss-datepicker';
import { useGetYearlyRevenueAnalyticsQuery } from '../../services/dashboard.service';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#E1E52C'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#E1E52C'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: moment.monthsShort(),
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100,
  },
};

const ChartOne: React.FC = () => {
  const [filter, setFilter] = useState<{ year: string }>({
    year: new Date().getFullYear().toString(),
  });
  const { data, refetch } = useGetYearlyRevenueAnalyticsQuery(
    filter?.year,
  );
  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Revenue</p>
              <p className="text-sm font-medium">{filter?.year}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Sales</p>
              <p className="text-sm font-medium">{filter?.year}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-80 justify-end">
          <input
            type="number"
            value={filter?.year}
            onChange={(e) =>
              setFilter((prev: any) => ({ ...prev, year: e.target.value }))
            }
            min="2024"
            max="2100"
            step="1"
            placeholder="Year"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div>
        {data?.data?.series && (
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
              options={{
                ...options,
                yaxis: {
                  ...options.yaxis,
                  min: Math.min(...data.data.series[0].data),
                  max: Math.max(...data.data.series[0].data)+1000,
                },
              }}
              series={data.data.series}
            type="area"
            height={350}
          />
        </div>
        )}
      </div>
    </div>
  );
};

export default ChartOne;
