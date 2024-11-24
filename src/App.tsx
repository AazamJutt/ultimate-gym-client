import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import useRestoreSession from './hooks/useRestoreSession';
import LayoutWrapper from './layout/LayoutWrapper';
import AddAttendance from './pages/Attendance/AddAttendance';
import AttendanceHistory from './pages/Attendance/AttendanceHistory';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Analytics from './pages/Dashboard/Analytics';
import InvoicesList from './pages/Invoices/List';
import LockersList from './pages/Lockers/List';
import AddMember from './pages/Members/Client/AddMember';
import EditMember from './pages/Members/Client/EditMember';
import List from './pages/Members/Client/List';
import AddStaff from './pages/Members/Staff/AddStaff';
import EditStaff from './pages/Members/Staff/EditStaff';
import StaffList from './pages/Members/Staff/List';
import AddMembership from './pages/Memberships/AddMembership';
import EditMembership from './pages/Memberships/EditMembership';
import MembershipList from './pages/Memberships/List';
import PackageList from './pages/Packages/List';
import Settings from './pages/Settings';
import { RootState } from './redux/store';
import ConfirmDialogModal from './components/ConfirmDialog';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const restoreSession = useRestoreSession();
  // Assume this is how you check if the user is authenticated
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    restoreSession();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <LayoutWrapper>
      <Routes>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Ultimate Gym | Signin" />
              <SignIn />
            </>
          }
        />
        <Route
          index
          element={
            <>
              <PageTitle title="Ultimate Gym | Dashboard" />
              <Analytics />
            </>
          }
        />
        <Route
          path="/members/all"
          element={
            <>
              <PageTitle title="Ultimate Gym | Members | All" />
              <List
                listFilter={{
                  status: '',
                }}
              />
            </>
          }
        />
        <Route
          path="/members/archived"
          element={
            <>
              <PageTitle title="Ultimate Gym | Members | Archived" />
              <List
                listFilter={{
                  archived: true,
                }}
              />
            </>
          }
        />
        <Route
          path="/members/add"
          element={
            <>
              <PageTitle title="Ultimate Gym | Members | Add" />
              <AddMember />
            </>
          }
        />
        <Route
          path="/members/:id/edit"
          element={
            <>
              <PageTitle title="Ultimate Gym | Members | Edit" />
              <EditMember />
            </>
          }
        />
        <Route
          path="/memberships/all"
          element={
            <>
              <PageTitle title="Ultimate Gym | Members | All" />
              <MembershipList />
            </>
          }
        />
        <Route
          path="/memberships/add"
          element={
            <>
              <PageTitle title="Ultimate Gym | Membership | Add" />
              <AddMembership />
            </>
          }
        />
        <Route
          path="/memberships/:membership_id/edit"
          element={
            <>
              <PageTitle title="Ultimate Gym | Membership | Edit" />
              <EditMembership />
            </>
          }
        />
        <Route
          path="/staff/all"
          element={
            <>
              <PageTitle title="Ultimate Gym | Staff | All" />
              <StaffList
                listFilter={{
                  status: '',
                }}
              />
            </>
          }
        />
        <Route
          path="/staff/archived"
          element={
            <>
              <PageTitle title="Ultimate Gym | Staff | Archived" />
              <StaffList
                listFilter={{
                  archived: true,
                }}
              />
            </>
          }
        />
        <Route
          path="/staff/add"
          element={
            <>
              <PageTitle title="Ultimate Gym | Members | Add" />
              <AddStaff />
            </>
          }
        />
        <Route
          path="/staff/:id/edit"
          element={
            <>
              <PageTitle title="Ultimate Gym | Staff | Edit" />
              <EditStaff />
            </>
          }
        />
        <Route
          path="/attendance/history"
          element={
            <>
              <PageTitle title="Ultimate Gym | Attendance | History" />
              <AttendanceHistory />
            </>
          }
        />
        <Route
          path="/attendance/add"
          element={
            <>
              <PageTitle title="Ultimate Gym | Attendance | Add" />
              <AddAttendance />
            </>
          }
        />
        <Route
          path="/packages/all"
          element={
            <>
              <PageTitle title="Ultimate Gym | Packages" />
              <PackageList
                listFilter={{
                  archived: true,
                }}
              />
            </>
          }
        />
        <Route
          path="/invoices/all"
          element={
            <>
              <PageTitle title="Ultimate Gym | Invoices" />
              <InvoicesList />
            </>
          }
        />
        <Route
          path="/lockers/all"
          element={
            <>
              <PageTitle title="Ultimate Gym | Lockers" />
              <LockersList />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Ultimate Gym | Calendar" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Ultimate Gym | Settings" />
              <Settings />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Ultimate Gym | Signup" />
              <SignUp />
            </>
          }
        />
      </Routes>
      <ToastContainer position="bottom-right" />

      <ConfirmDialogModal />
    </LayoutWrapper>
  );
}

export default App;
