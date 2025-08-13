import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OnboardingPage from './pages/OnboardingPage'
import NotificationPage from './pages/NotificationPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div className='h-screen'>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/notification" element={<NotificationPage/>} />
        <Route path="/chat" element={<ChatPage/>} />
        <Route path="/call" element={<CallPage/>} />
        <Route path="/onboarding" element={<OnboardingPage/>} />
      </Routes>

      <Toaster>

      </Toaster>
      </div>
  )
}

export default App