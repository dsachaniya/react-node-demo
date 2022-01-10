import React, { useContext } from 'react';
import axios from 'axios';
import { AppContext } from './context';

export default function ApiService() {
  const { dispatch } = useContext(AppContext);
  const getUserList = () =>
    axios
      .get(`${window.API_URL}user/list`)
      .then(({ data }) => {
        if (data?.data?.length) {
          return data?.data.map((item, index) => ({ ...item, id: index + 1 }));
        }
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const getBikesAssociatedWithUser = (userId) =>
    axios
      .post(`${window.API_URL}reservations/bikes`, { userId })
      .then(({ data }) => {
        if (data?.data) {
          return data?.data.map((item, index) => ({ ...item, id: index + 1 }));
        }
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const getUserAssociatedWithBikes = (bikeId) =>
    axios
      .post(`${window.API_URL}reservations/users`, { bikeId })
      .then(({ data }) => {
        if (data?.data) {
          return data?.data.map((item, index) => ({ ...item, id: index + 1 }));
        }
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const getBikesList = () =>
    axios
      .get(`${window.API_URL}bikes/list`)
      .then(({ data }) => {
        if (data?.data?.length) {
          return data?.data.map((item, index) => ({ ...item, id: index + 1 }));
        }
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const addBike = (payload) =>
    axios
      .post(`${window.API_URL}bikes`, payload)
      .then(() => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: 'Bike added successfully', type: 'success' },
        });
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const updateBike = (payload, bikeId) =>
    axios
      .put(`${window.API_URL}bikes/${bikeId}`, payload)
      .then(() => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: 'Bike updated successfully', type: 'success' },
        });
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const addUser = (payload) =>
    axios
      .post(`${window.API_URL}user/register`, payload)
      .then(() => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: 'User added successfully', type: 'success' },
        });
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const updateUser = (payload, userId) =>
    axios
      .put(`${window.API_URL}user/${userId}`, payload)
      .then(() => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: 'User updated successfully', type: 'success' },
        });
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const deleteUser = (userId) =>
    axios
      .delete(`${window.API_URL}user/${userId}`)
      .then(() => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: 'User deleted successfully', type: 'success' },
        });
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const deleteBike = (bikeId) =>
    axios
      .delete(`${window.API_URL}bikes/${bikeId}`)
      .then(({ data }) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: data?.message, type: 'success' },
        });
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const getStaticData = () =>
    axios
      .get(`${window.API_URL}static-data`)
      .then(({ data }) => {
        if (data?.data) {
          dispatch({ type: 'SET_STATIC_DATA', payload: data.data });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const searchBikes = (payload) =>
    axios
      .post(`${window.API_URL}bikes/exlcuding-reserved`, payload)
      .then(({ data }) => {
        if (data?.data?.items?.length) {
          return data?.data.items.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
        }
        return [];
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const reserveBike = (payload) =>
    axios
      .post(`${window.API_URL}reservations`, payload)
      .then(({ data }) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: 'Bike booked successfully', type: 'success' },
        });
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  const updateReservation = (payload, id) =>
    axios
      .put(`${window.API_URL}reservations/${id}`, payload)
      .then(({ data }) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: data.message, type: 'success' },
        });
      })
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { message: error.response?.data?.message, type: 'error' },
        });
      });
  return {
    getUserList,
    getBikesAssociatedWithUser,
    getBikesList,
    getStaticData,
    addBike,
    updateBike,
    deleteBike,
    getUserAssociatedWithBikes,
    addUser,
    updateUser,
    deleteUser,
    searchBikes,
    reserveBike,
    updateReservation,
  };
}
