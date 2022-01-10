import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { AppContext } from '../../context';
import AddEditUserModal from './addEditUser';
import UserWithBikesModal from './userWithBikes';
import ApiService from '../../apiService';

export default function UserList() {
  const [userList, setUserList] = useState();
  const [{ isAddEditModalOpen, selectedUser }, setAddEditModalParams] = useState({
    isAddEditModalOpen: false,
    selectedUser: null,
  });
  const [userWithBikes, setUserWithBikes] = useState();
  const { getUserList, getBikesAssociatedWithUser, deleteUser } = ApiService();

  const renderActions = (params) => (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          getBikesWithUsers(params.row._id);
        }}
      >
        View Reservation
      </Button>
      <Button color="primary" variant="contained" onClick={() => toggleAddEditModal(params.row)}>
        Update
      </Button>
      <Button
        color="secondary"
        variant="contained"
        onClick={() => {
          onDeleteUser(params.row._id);
        }}
      >
        Delete
      </Button>
    </>
  );
  const columns = [
    {
      field: 'firstName',
      headerName: 'First name',
      width: 200,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 200,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 200,
    },
    {
      field: 'role',
      headerName: 'User Type',
      width: 150,
      renderCell: (params) => (params.row.role === 1 ? 'Manager' : 'User'),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'isDeactive',
      headerName: 'Actions',
      width: 400,
      renderCell: renderActions,
    },
  ];

  const getUsers = () => {
    getUserList().then((users) => {
      setUserList(users);
    });
  };
  const getBikesWithUsers = (userId) => {
    getBikesAssociatedWithUser(userId).then((bikes) => setUserWithBikes(bikes));
  };
  const onDeleteUser = (userId) => {
    deleteUser(userId).then(() => {
      getUsers();
    });
  };
  useEffect(() => {
    getUsers();
  }, []);
  const toggleAddEditModal = (user) => {
    setAddEditModalParams({
      isAddEditModalOpen: !isAddEditModalOpen,
      selectedUser: user,
    });
  };
  const closeBikeModal = () => {
    setUserWithBikes();
  };
  return (
    <Grid container style={{ padding: 20 }}>
      {isAddEditModalOpen && (
        <AddEditUserModal
          handleClose={() => toggleAddEditModal()}
          open={isAddEditModalOpen}
          userData={selectedUser}
          onAddEdit={() => getUsers()}
        />
      )}
      <UserWithBikesModal handleClose={closeBikeModal} bikeList={userWithBikes} />
      <Button
        color="primary"
        variant="contained"
        onClick={() => toggleAddEditModal()}
        style={{ margin: '10px 0px' }}
      >
        Add a new User
      </Button>
      {userList?.length && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={userList} columns={columns} pageSize={10} autoHeight disableColumnMenu />
        </div>
      )}
    </Grid>
  );
}
