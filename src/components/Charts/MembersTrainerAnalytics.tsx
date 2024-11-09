import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { TrainerAnalytics } from '../../types/TrainerAnalytics';

interface MemberTrainerChartState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  labels: ['Trainer Assigned', 'No Trainer'],
  colors: ['#6577F3', '#0FADCF', '#F76D6D', '#FFB400', '#6B5B93'],
  legend: {
    show: false,
    position: 'bottom',
  },

  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const MembersTrainerAnalytics = ({
  analytics,
}: {
  analytics: TrainerAnalytics;
}) => {
  const [state, setState] = useState<MemberTrainerChartState>({
    series: [analytics.assigned_count, analytics.unassigned_count],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      series: [analytics.assigned_count, analytics.unassigned_count],
    }));
  };
  handleReset;

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Members Trainer
          </h5>
          <span>How many members have a trainer assigned</span>
        </div>
      </div>

      <div className="mb-2">
        <div
          id="MembersTrainerAnalytics"
          className="mx-auto flex justify-center"
        >
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="flex w-full items-center mb-3">
        <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
        <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
          <span>Trainer Assgined </span>
          <span> {analytics.assigned_percentage}% </span>
        </p>
      </div>

      <div className="flex w-full items-center">
        <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#0FADCF]"></span>
        <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
          <span> No trainer </span>
          <span> {analytics.unassigned_percentage}% </span>
        </p>
      </div>
    </div>
  );
};

export default MembersTrainerAnalytics;
