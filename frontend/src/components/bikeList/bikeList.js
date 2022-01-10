import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { AppContext } from '../../context';
import AddEditBikeModal from './addEditBike';
import BikeWithUsersModal from './bikeWithUsers';
import ApiService from '../../apiService';

export default function BikeList() {
  const [bikeList, setBikeList] = useState();
  const [{ isAddEditModalOpen, selectedBike }, setAddEditModalParams] = useState({
    isAddEditModalOpen: false,
    selectedBike: null,
  });
  const [bikeWithUsers, setBikeWithUsers] = useState();
  const { getBikesList, deleteBike, getUserAssociatedWithBikes } = ApiService();

  const renderActions = (params) => (
    <>
      <Button color="primary" variant="contained" onClick={() => getUsersWithBikes(params.row._id)}>
        View Reservation
      </Button>
      <Button color="primary" variant="contained" onClick={() => toggleAddEditModal(params.row)}>
        Update
      </Button>
      <Button
        color="secondary"
        variant="contained"
        onClick={() => {
          onDeleteBike(params.row._id);
        }}>
        Delete
      </Button>
    </>
  );
  const columns = [
    {
      field: 'model',
      headerName: 'Model',
      width: 200,
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 200,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 200,
    },
    {
      field: 'isDeactive',
      headerName: 'Actions',
      width: 400,
      renderCell: renderActions,
    },
  ];

  const onDeleteBike = (id) => {
    deleteBike(id).then(() => {
      getBikes();
    });
  };
  const getBikes = () => {
    getBikesList().then((bikes) => {
      setBikeList(bikes);
    });
  };

  useEffect(() => {
    getBikes();
  }, []);
  
  const toggleAddEditModal = (bike) => {
    setAddEditModalParams({
      isAddEditModalOpen: !isAddEditModalOpen,
      selectedBike: bike,
    });
  };
  const getUsersWithBikes = (userId) => {
    getUserAssociatedWithBikes(userId)
      .then((users) => setBikeWithUsers(users))
      .catch(() => {});
  };
  return (
    <Grid container style={{ padding: 20 }}>
      {isAddEditModalOpen && (
        <AddEditBikeModal
          handleClose={() => toggleAddEditModal()}
          open={isAddEditModalOpen}
          onAddEdit={() => getBikes()}
          bikeData={selectedBike}
        />
      )}
      <BikeWithUsersModal
        handleClose={() => {
          setBikeWithUsers();
        }}
        userList={bikeWithUsers}
      />
      <Button
        color="primary"
        variant="contained"
        onClick={() => toggleAddEditModal()}
        style={{ margin: '10px 0px' }}>
        Add a new bike
      </Button>
      {bikeList?.length && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={bikeList} columns={columns} pageSize={10} autoHeight />
        </div>
      )}
    </Grid>
  );
}
