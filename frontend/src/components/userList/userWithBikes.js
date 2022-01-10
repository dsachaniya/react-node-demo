import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';

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

export default function UserWithBikesModal({ bikeList, handleClose }) {
  const columns = [
    {
      field: 'model',
      headerName: 'Model',
      width: 180,
      renderCell: (params) => params?.row?.bikeObj?.model,
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 180,
      renderCell: (params) => params?.row?.bikeObj?.color,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 180,
      renderCell: (params) => params?.row?.bikeObj?.location,
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
        open={bikeList}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Fade in={bikeList}>
          <Box sx={style}>
            <Typography id="modal-modal-title" align="center" variant="h4" component="h4">
              Reservation
            </Typography>
            <br />
            <Grid container style={{ padding: 20 }}>
              {bikeList?.length > 0 && (
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid rows={bikeList} columns={columns} pageSize={10} />
                </div>
              )}
              {bikeList?.length === 0 && <h3>No reservations for this user</h3>}
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
