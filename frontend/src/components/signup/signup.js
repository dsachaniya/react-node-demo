import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
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

const theme = createTheme();

export default function SignUp() {
  const [{ firstName, lastName, emailAddress, password, phone }, setState] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    emailAddress: '',
    password: '',
  });
  const { dispatch } = useContext(AppContext);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const mobileNoRegex = /^[0-9\b]+$/;
    if (name === 'phone' && !mobileNoRegex.test(value)) return;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSubmit = () => {
    const body = {
      firstName,
      lastName,
      email: emailAddress,
      password,
      phone,
      type: 2,
    };
    axios
      .post(`${window.API_URL}user/register`, body)
      .then(({ data }) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: data?.message, type: 'success' },
        });
        window.location.href = '/login';
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  };
  const validateEmail = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailAddress).toLowerCase());
  };
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
            Sign up
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  value={lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="phone"
                  variant="outlined"
                  required
                  fullWidth
                  id="phone"
                  label="Mobile Number"
                  autoFocus
                  inputProps={{
                    maxLength: 10,
                    pattern: 'd*',
                  }}
                  value={phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  type="email"
                  label="Email Address"
                  name="emailAddress"
                  autoComplete="email"
                  inputProps={{
                    pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$',
                  }}
                  value={emailAddress}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              onClick={() => onSubmit()}
              fullWidth
              variant="contained"
              color="primary"
              disabled={
                !(firstName && lastName && emailAddress && validateEmail() && password && phone)
              }
              sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
