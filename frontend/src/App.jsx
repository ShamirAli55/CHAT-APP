import React from 'react'
import {Route, Routes ,Navigate} from 'react-router-dom'
import Home from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OnboardingPage from './pages/OnboardingPage'
import NotificationPage from './pages/NotificationPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'

const App = () => 
{
  const {data:authData,isLoading,error} = useQuery({queryKey:["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get('/auth/me')
      return response.data
    },
    retry: false, // Disable retry on failure
  });
  
  const authUser = authData?.user || null;

  return (
    <div className='h-screen'>
      <Routes>
        <Route path="/" element={authUser ?<Home/> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/" />} />
        <Route path="/notification" element={authUser ? <NotificationPage/> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage/> : <Navigate to="/login" />} />
        <Route path="/call" element={authUser ? <CallPage/> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={authUser ? <OnboardingPage/> : <Navigate to="/login" />} />
      </Routes>

      <Toaster>

      </Toaster>
      </div>
  )
}

export default App