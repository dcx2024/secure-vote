import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import VoterLogin from './components/VoterLogin';
import CreatePoll from './components/CreatePoll';
import VoterResult from './components/VoteResult';
import AdminPolls from './components/AdminPolls';
import AdminSignup from './components/AdminSignup';
import AdminLogin from './components/AdminLogin';
import VotePage from './components/VoterPage';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<VoterLogin />} />
        <Route path='/vote/:token' element={<VotePage />} />
        <Route path='/admin/signup' element={<AdminSignup />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/create' element={<CreatePoll />} />
        <Route path='/admin/poll' element={<AdminPolls />} />
        <Route path='/result' element={<VoterResult />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
