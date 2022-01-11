import React, { useState, useEffect, useContext } from 'react';
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

import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import { format } from 'date-fns';
import { AppContext } from '../../context';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  border: '2px solid white',
  boxShadow: 24,
  p: 4,
};

const BikeWithUsersModal = ({ userList, handleClose }) => {
  const { dispatch } = useContext(AppContext);
  const columns = [
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 200,
      renderCell: (params) => params?.row?.userObj?.firstName,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 200,
      renderCell: (params) => params?.row?.userObj?.lastName,
    },
    {
      field: 'email',
      headerName: 'Location',
      width: 150,
      renderCell: (params) => params?.row?.userObj?.email,
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      width: 200,
      renderCell: (params) => format(new Date(params.row.startTime), 'dd/MM/yyyy hh:mm a'),
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      width: 200,
      renderCell: (params) => format(new Date(params.row.endTime), 'dd/MM/yyyy hh:mm a'),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 80,
    },
  ];

  return (
    <div>
      <Modal
        open={userList}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Fade in={userList}>
          <Box sx={style}>
            <Typography id="modal-modal-title" align="center" variant="h4" component="h4">
              Reservation
            </Typography>
            <br />
            <Grid container style={{ padding: 20 }}>
              {userList?.length > 0 && (
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid rows={userList} columns={columns} pageSize={10} disableColumnMenu />
                </div>
              )}
              {userList?.length === 0 && <h3>No reservations for this Bike</h3>}
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default BikeWithUsersModal;
