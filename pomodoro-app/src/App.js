import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ErrorPage from './ErrorPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { TimerContextProvider } from './context/TimerContext';
import { TaskContextProvider } from './context/TaskContext';
import TList from './components/Reports/TList';
import TChart from './components/Reports/TChart';
import GuestSettings from './pages/Settings/GuestSettings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';


function App() {

  return (
    <AuthProvider>
      <TimerContextProvider>
        <TaskContextProvider>
          <Header />
          <Routes>
            <Route exact path='/' Component={Home} />
            <Route path='/login' Component={Login} />
            <Route path='/signup' Component={Signup} />
            <Route path='/guest/settings' Component={GuestSettings} />
            <Route path='/:username/tasklist' Component={TList} />
            <Route path='/:username/taskchart' Component={TChart} />
            <Route path="/:username/settings" Component={Settings} />
            <Route path='/privacy-policy' Component={PrivacyPolicy} />
            <Route path='/disclaimer' Component={Disclaimer} />
            <Route path='*' Component={ErrorPage} />
          </Routes>
          <Footer />
        </TaskContextProvider>
      </TimerContextProvider>
    </AuthProvider>
  );
}

export default App;
