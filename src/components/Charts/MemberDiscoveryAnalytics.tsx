import { ApexOptions } from 'apexcharts';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { DiscoveryAnalytics } from '../../types/DiscoveryAnalytics';
import { capitalize } from '../../utils/helpers';

interface ChartThreeState {
  series: number[];
}

const MemberDiscoveryAnalytics = ({
  analytics,
}: {
  analytics: DiscoveryAnalytics[];
}) => {
  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: ['#6577F3', '#8FD0EF', '#0FADCF', '#F76D6D', '#FFB400', '#6B5B93'],
    labels: analytics.map((analytic) =>
      capitalize(analytic.discovery_method || 'other'),
    ),
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
  const [state, setState] = useState<ChartThreeState>({
    series: analytics.map((analytic) => analytic.count),
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      series: analytics.map((analytic) => analytic.count),
    }));
  };
  handleReset;

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Members Discovery
          </h5>
          <span>Member Reach Analysis (How did they hear about us?)</span>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-start gap-y-3">
        {analytics?.map((analytic: DiscoveryAnalytics, idx) => (
          <div
            key={analytic.discovery_method}
            className="px-5 flex w-full items-center"
          >
            <span
              className={`mr-2 block h-3 w-full max-w-3 rounded-full bg-[${options.colors[idx]}]`}
            ></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> {capitalize(analytic.discovery_method || 'other')}</span>
              <span> {analytic.percentage}% </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDiscoveryAnalytics;
