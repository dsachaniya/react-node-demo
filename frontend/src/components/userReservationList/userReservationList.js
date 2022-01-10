import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import FeedbackModal from './feedBackModal';
import ApiService from '../../apiService';

export default function UserReservations() {
  const [reservationList, setReservationList] = useState();
  const [selectedReservation, setSelectedReservation] = useState(false);
  const { getBikesAssociatedWithUser, updateReservation } = ApiService();
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  const renderActions = (params) => (
    <>
      {!params.row.isCancelled && (
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            onUpdateReservation({ isCancelled: true }, params.row._id);
          }}>
          Cancel Reservation
        </Button>
      )}
      {!params.row.rating && (
        <Button
          color="primary"
          variant="contained"
          onClick={() => setSelectedReservation(params.row)}>
          Give Rating
        </Button>
      )}
    </>
  );
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
    {
      field: 'isDeactive',
      headerName: 'Actions',
      width: 400,
      renderCell: renderActions,
    },
  ];

  const getBikesWithUsers = () => {
    getBikesAssociatedWithUser(userDetails._id).then((bikes) => setReservationList(bikes));
  };
  useEffect(() => {
    getBikesWithUsers();
  }, []);

  const closeFeedBackModal = () => {
    setSelectedReservation();
  };
  const onUpdateReservation = (payload, reservationId) => {
    updateReservation(payload, reservationId)
      .then(() => {
        setSelectedReservation();
        getBikesWithUsers();
      })
      .catch(() => {});
  };
  return (
    <Grid container style={{ padding: 20 }}>
      {selectedReservation && (
        <FeedbackModal
          handleClose={closeFeedBackModal}
          open={selectedReservation}
          onRatingSubmit={(payload) => onUpdateReservation(payload, selectedReservation._id)}
        />
      )}
      {reservationList?.length && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={reservationList} columns={columns} pageSize={10} autoHeight />
        </div>
      )}
    </Grid>
  );
}
