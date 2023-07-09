// react
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// routing
import { Route, Routes, Navigate } from 'react-router-dom';

// redux
import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';

// pages
import SignInPage from './pages/sign-in/sign-in.page';
import DashboardPage from './pages/dashboard/dashboard.page';

// chakra ui
import { Grid } from '@chakra-ui/react';

// css
import './App.css';

function App({ currentUser }) {
  return (
    <Grid className='App' h='100vh'>
      <Routes>
        <Route
          path='/'
          element={currentUser ? <Navigate to='/dashboard' /> : <SignInPage />}
        />
        <Route
          path='/dashboard'
          element={!currentUser ? <Navigate to='/' /> : <DashboardPage />}
        />
      </Routes>
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
