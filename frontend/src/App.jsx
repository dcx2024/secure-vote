import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';

import VoterLogin from './components/VoterLogin';
import CreatePoll from './components/CreatePoll';
import VoterResult from './components/VoteResult';
import AdminPolls from './components/AdminPolls';
import AdminSignup from './components/AdminSignup';
import AdminLogin from './components/AdminLogin';
import VotePage from './components/VoterPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<VoterLogin />} />
      <Route path="/vote/:token" element={<VotePage />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/create" element={<CreatePoll />} />
      <Route path="/admin/poll" element={<AdminPolls />} />
      <Route path="/result" element={<VoterResult />} />
    </>
  )
);

const App = () => <RouterProvider router={router} />;
export default App;
