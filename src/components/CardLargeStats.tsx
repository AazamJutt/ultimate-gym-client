import React from 'react';
import { Link } from 'react-router-dom';

interface CardLargeStatsProps {
  icon: React.ReactNode;
  title: string;
  total: number;
  onClick: () => void;
}
const CardLargeStats: React.FC<CardLargeStatsProps> = ({
  icon,
  title,
  total,
  onClick,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="text-center font-lg mb-3">Total {title}</div>
      <div className="flex gap-4 items-center flex-col">
        {icon}
        <div className="text-lg font-bold">{total}</div>
        {onClick && (
          <button
            type="button"
            disabled={!total}
            onClick={onClick}
            className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white disabled:cursor-not-allowed disabled:bg-stroke dark:disabled:bg-strokedark hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            View All
          </button>
        )}
      </div>
    </div>
  );
};

export default CardLargeStats;
