import React from 'react';
import { Link } from 'react-router-dom';

interface CardLargeStatsProps {
  icon: React.ReactNode;
  title: string;
  total: number;
  actionLink: string;
}
const CardLargeStats: React.FC<CardLargeStatsProps> = ({
  icon,
  title,
  total,
  actionLink,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="text-center font-lg mb-3">Total {title}</div>
      <div className="flex gap-4 items-center flex-col">
        {icon}
        <div className="text-lg font-bold">{total}</div>
        {actionLink && (
          <Link
            to={actionLink}
            className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            View All
          </Link>
        )}
      </div>
    </div>
  );
};

export default CardLargeStats;
