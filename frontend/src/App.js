import React, { useReducer } from 'react';
import { Routes, Route } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import { AppContext, initialState, reducer } from './context';
import UserList from './pages/UserList/UserList';
import BikeList from './pages/BikeList/BikeList';
import LoginPage from './pages/LoginPage/LoginPage';
import UserReservationsList from './pages/UserReservationsList/UserReservationsList';
import ReserveBike from './pages/ReserveBike/ReserveBike';
import SignUpPage from './pages/SignupPage/SignupPage';
import Header from './header';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import './App.css';
import { UserRoles } from './utils/constant';

axios.interceptors.request.use((config) => {
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  document.getElementById('loader').style.display = 'block';
  if (userDetails) config.headers.Authorization = userDetails?.token;
  return config;
});

axios.interceptors.response.use(
  (response) => {
    document.getElementById('loader').style.display = 'none';
    return response;
  },
  (error) => {
    document.getElementById('loader').style.display = 'none';
    return Promise.reject(error);
  },
);
function App() {
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleAlertClose = () => {
    dispatch({ type: 'HIDE_ALERT' });
  };
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <div id="loader" style={{ display: 'none' }}>
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
        {state.alert && (
          <Snackbar
            open={state.alert}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            autoHideDuration={6000}
            onClose={() => handleAlertClose()}>
            <Alert
              onClose={() => handleAlertClose()}
              severity={state.alert?.type}
              sx={{ width: '100%' }}>
              {state.alert?.message}
            </Alert>
          </Snackbar>
        )}
        {<Header userDetails={userDetails} />}
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          {userDetails && (
            <>
              {userDetails.role === UserRoles.MANAGER && (
                <>
                  <Route path="userList" element={<UserList />} />
                  <Route path="bikeList" element={<BikeList />} />
                </>
              )}
              {userDetails.role === UserRoles.USER && (
                <>
                  <Route path="userReservations" element={<UserReservationsList />} />
                  <Route path="reserveBike" element={<ReserveBike />} />
                </>
              )}
            </>
          )}
          <Route path="*" element={<NotFoundPage />} />
          <Route path="" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
