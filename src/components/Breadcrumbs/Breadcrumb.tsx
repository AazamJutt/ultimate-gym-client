import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
interface BreadcrumbProps {
  pageName: string;
  backButton?: boolean;
}
const Breadcrumb = ({ pageName, backButton }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {backButton && (
        <Link to="/" className="flex gap-2 items-center hover:text-primary">
          {' '}
          <MdArrowBack /> Back
        </Link>
      )}
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
