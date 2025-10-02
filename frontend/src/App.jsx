import React from 'react'
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'
import VoterLogin from './components/VoterLogin'
import CreatePoll from './components/CreatePoll'
import VoterResult from './components/VoteResult'
import AdminPolls from './components/AdminPolls'
import AdminSignup from './components/AdminSignup'
import AdminLogin from './components/AdminLogin'
import VotePage from './components/VoterPage'

const App = () => {

  const router=createBrowserRouter( 
    createRoutesFromElements(
      <Route>
      <Route path='/' index element={<VoterLogin/>} />
      <Route path='/vote/:token' index element={<VotePage/>} />
      <Route path='/admin/signup' index element={<AdminSignup/>} />
      <Route path='/admin/login' index element={<AdminLogin/>}/>
      <Route path='/admin/create' index element={<CreatePoll/>}/>
      <Route path='/admin/poll' index element={<AdminPolls/>}/>
      <Route path='/result' index element={<VoterResult/>} />
      </Route>
    )
  )
  return <RouterProvider router={router}/>
}
export default App