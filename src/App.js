import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
// Pages
import RegisterPage from './pages/Register';
import Login from './pages/Login';
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Components
import MyNavBar from './components/MyNavBar';
import List from './pages/List';
import Homepage from './pages/Homepage';

function App() {
  return (
    <div>
      <MyNavBar />
      <Routes>
        <Route path='/' element={<Homepage/>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/book/list' element={<List />} />
      </Routes>
    </div>
  );
}

export default App;
