import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import MemberTable from '../../components/Tables/MemberTable';

const List = () => {
  return (
    <>
      <Breadcrumb pageName="All Members" />
      <MemberTable />
    </>
  );
};

export default List;
