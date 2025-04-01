import './App.css';
import { Route, Routes } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import Settings from './pages/Settings/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GuestSettings from './pages/Settings/GuestSettings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import Document from './pages/Tech Document/Document';
import DocContent from './pages/Tech Document/DocContent';

import { AuthProvider } from './context/AuthContext';
import { TimerContextProvider } from './context/TimerContext';
import { TaskContextProvider } from './context/TaskContext';

import TList from './components/Reports/TList';
import TChart from './components/Reports/TChart';
import ErrorPage from './pages/ErrorPage';


function App() {

  return (
    <AuthProvider>
      <TimerContextProvider>
        <TaskContextProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route exact path='/' Component={Home} />
              <Route path='/login' Component={Login} />
              <Route path='/signup' Component={Signup} />
              <Route path='/guest/settings' Component={GuestSettings} />
              <Route path='/:username/tasklist' Component={TList} />
              <Route path='/:username/taskchart' Component={TChart} />
              <Route path="/:username/settings" Component={Settings} />
              <Route path='/privacy-policy' Component={PrivacyPolicy} />
              <Route path='/disclaimer' Component={Disclaimer} />
              <Route path='/doc' Component={Document}>
                <Route path=":slug" Component={DocContent} />
                <Route index Component={DocContent} />
              </Route>
            </Route>
          
            <Route path='*' Component={ErrorPage} />
          </Routes>
        </TaskContextProvider>
      </TimerContextProvider>
    </AuthProvider>
  );
}

export default App;
