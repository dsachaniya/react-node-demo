import React, { useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { AppContext } from '../../context';
import { UserRoles } from '../../utils/constant';
import useForm from '../../hooks/useForm';
import { validateLoginForm } from '../../utils/common';

const theme = createTheme();

const LoginPage = () => {
  const { dispatch } = useContext(AppContext);

  const navigate = useNavigate();

  const onSubmit = (formValues) => {
    console.log('test', formValues);
    axios
      .post(`${window.API_URL}user/login`, {
        email: formValues.email,
        password: formValues.password,
      })
      .then(({ data }) => {
        localStorage.setItem('userDetails', JSON.stringify(data?.data));
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: 'Login successful', type: 'success' },
        });
        if (data?.data.role == UserRoles.USER) {
          navigate('/reserveBike');
        } else {
          navigate('/userList');
        }
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: {
            message: error.response?.data?.message || 'Login failed, Please try later',
            type: 'error',
          },
        });
      });
  };

  const { values, errors, handleChange, handleSubmit, isSubmitDisabled } = useForm(
    onSubmit,
    validateLoginForm,
  );
  console.log('isSubmitDisabled', isSubmitDisabled);
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={handleChange}
              value={values.email}
              autoFocus
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={handleChange}
              value={values.password}
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
              color="primary"
              disabled={isSubmitDisabled}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs />
              <Grid item>
                <Link href="/signup" variant="body2">
                  {`Don't have an account? Sign Up`}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
