import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
// import Document from './pages/Tech Document/Document';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ErrorPage from './ErrorPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem('userinfo')) || null;
  });
  const [xCorrId, setXCorrId] = useState(() => {
    return sessionStorage.getItem('xCorrId') || null
  });
  const [loginType, setLoginType] = useState(() => {
    return sessionStorage.getItem('loginType') || 'custom';
  });

  useEffect(() => {
    if (user) {
      setXCorrId(user.xCorrId);
    }
  }, [user, loginType])



  return (
    <UserContext.Provider value={{ user, setUser, xCorrId, setXCorrId, setLoginType }}>
      <div className='App'>
        <Header />
        <Routes>
          <Route exact path='/' Component={Home} />
          <Route path="/:username/settings" Component={Settings} />
          <Route path='/login' Component={Login} />
          <Route path='/signup' Component={Signup} />
          {/* <Route path='/:username/document/*' Component={Document} /> */}
          <Route path='*' Component={ErrorPage} />
        </Routes>
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

export default App;
