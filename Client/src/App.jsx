import { Route, Routes } from 'react-router-dom';
import RequireAuth from './Components/Auth/RequireAuth';
import HomePage from './Pages/HomePage';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import NotFound from './Pages/NotFound';
import AdminLayout from './Layouts/AdminLayout';
import UserLayout from './Layouts/UserLayout';
import Gamepage from './Pages/User/Gamepage';
import GameListing from './Pages/User/GameListing';
import UserProfile from './Pages/User/UserProfile';
import AdminProfile from './Pages/Admin/AdminProfile';
import SetMcq from './Pages/Admin/SetMcq';
import NewMcq from './Pages/Admin/NewMcq';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserLeaderBoard from './Pages/User/UserLeaderBoard';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/admin/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Admin Routes */}
      <Route element={<RequireAuth allowedRoles={['admin']} />}>
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route
                  path="dashboard"
                  element={<AdminDashboard />}
                />
                <Route
                  path="set-mcq"
                  element={<SetMcq />}
                />
                <Route
                  path="new-mcq"
                  element={<NewMcq />}
                />
                <Route
                  path="edit-mcq/:id"
                  element={<NewMcq />}
                />
                <Route
                  path="profile"
                  element={<AdminProfile />}
                />
              </Routes>
            </AdminLayout>
          }
        />
      </Route>

      {/* User Routes */}
      <Route element={<RequireAuth allowedRoles={['user']} />}>
        <Route
          path="/user/*"
          element={
            <UserLayout>
              <Routes>
                <Route
                  path="profile"
                  element={<UserProfile />}
                />
              </Routes>
            </UserLayout>
          }
        />
        <Route
          path="/games"
          element={
            <UserLayout>
              <GameListing />
            </UserLayout>
          }
        />
        <Route
          path="/play"
          element={
            <UserLayout>
              <Gamepage />
            </UserLayout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <UserLayout>
              <UserLeaderBoard />
            </UserLayout>
          }
        />
      </Route>

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;
