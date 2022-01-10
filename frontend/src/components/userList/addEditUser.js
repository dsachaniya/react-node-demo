import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

import Grid from '@mui/material/Grid';
import ApiService from '../../apiService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid white',
  boxShadow: 24,
  p: 4,
};
const initialState = {
  role: 2,
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
};
export default function AddEditUserModal({ open, handleClose, userData, onAddEdit }) {
  const [{ firstName, lastName, phone, email, password, role }, setState] = React.useState(
    userData || initialState,
  );
  const { addUser, updateUser } = ApiService();

  const handleChange = (event) => {
    const { name, value } = event.target;
    const mobileNoRegex = /^[0-9\b]+$/;
    if (name === 'phone' && !mobileNoRegex.test(value)) return;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  const validateEmail = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const onSubmit = async () => {
    const params = { firstName, lastName, phone, email };
    if (!userData) params.password = password;
    if (role == 1) params.adminKey = 'test-admin';
    try {
      if (userData?._id) await updateUser(params, userData._id);
      else {
        params.password = password;
        params.type = parseInt(role, 10);
        await addUser(params);
      }
      onAddEdit();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={() => handleClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="modal-modal-title" align="center" variant="h6" component="h2">
              Add User
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <RadioGroup
                  row
                  aria-label="quiz"
                  name="role"
                  value={parseInt(role, 10)}
                  onChange={handleChange}>
                  <FormControlLabel
                    disabled={userData}
                    value={1}
                    control={<Radio />}
                    label="Manager"
                  />
                  <FormControlLabel
                    disabled={userData}
                    value={2}
                    control={<Radio />}
                    label="Normal user"
                  />
                </RadioGroup>
              </Grid>
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
                  name="email"
                  autoComplete="email"
                  inputProps={{
                    pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$',
                  }}
                  value={email}
                  onChange={handleChange}
                />
              </Grid>
              {!userData && (
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
              )}
            </Grid>
            <Button
              onClick={() => onSubmit()}
              fullWidth
              variant="contained"
              color="primary"
              disabled={
                !(
                  firstName &&
                  lastName &&
                  email &&
                  validateEmail() &&
                  (userData || password) &&
                  phone
                )
              }
              sx={{ mt: 3, mb: 2 }}>
              Save
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
