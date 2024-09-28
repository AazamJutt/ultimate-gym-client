import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Analytics from './pages/Dashboard/Analytics';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import AddMember from './pages/Members/AddMember';
import Archived from './pages/Members/Archived';
import List from './pages/Members/List';
import StaffList from './pages/Staff/List';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import AddAttendance from './pages/Attendance/AddAttendance';
import AttendanceHistory from './pages/Attendance/AttendanceHistory';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Ultimate Fitness | Dashboard" />
              <Analytics />
            </>
          }
        />
        <Route
          path="/members/all"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Members | All" />
              <List />
            </>
          }
        />
        <Route
          path="/members/archived"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Members | Archived" />
              <Archived />
            </>
          }
        />
        <Route
          path="/members/add"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Members | Add" />
              <AddMember />
            </>
          }
        />
        <Route path='/staff/all' element={
          <>
            <PageTitle title="Ultimate Fitness | Staff | All" />
            <StaffList />
          </>
        }
        />
        <Route
          path="/staff/add"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Members | Add" />
              <AddMember />
            </>
          }
        />
        <Route path='/attendance/history' element={
          <>
            <PageTitle title="Ultimate Fitness | Attendance | History" />
            <AttendanceHistory />
          </>
        }
        />
        <Route
          path="/attendance/add"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Attendance | Add" />
              <AddAttendance />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Calendar" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Profile" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Form Elements" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Form Layout" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Tables" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Settings" />
              <Settings />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Alerts" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Buttons" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Signin" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Ultimate Fitness | Signup" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
