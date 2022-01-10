import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import add from 'date-fns/add';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DateAdapter from '@mui/lab/AdapterDateFns';
import DesktopDateTimePicker from '@mui/lab/DesktopDateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { format } from 'date-fns';
import { AppContext } from '../../context';
import ConfirmModal from './confirmModal';
import ApiService from '../../apiService';

export default function ReserveBike() {
  const [bikeList, setBikeList] = useState();
  const [selectedBike, setSelectedBike] = useState();
  const [startTime, setStartTime] = useState(add(new Date(), { days: 1 }));
  const [endTime, setEndTime] = useState(add(new Date(), { days: 2 }));
  const [models, setModels] = useState();
  const [colors, setColors] = useState();
  const [locations, setLocations] = useState();
  const [ratings, setRatings] = useState();
  const { getStaticData, searchBikes, reserveBike } = ApiService();
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const navigate = useNavigate();

  const { state } = useContext(AppContext);
  const renderActions = (params) => (
    <Button color="primary" variant="contained" onClick={() => setSelectedBike(params.row)}>
      Reserve
    </Button>
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
      field: 'rating',
      headerName: 'Rating',
      width: 200,
      renderCell: (params) =>
        params.row.rating > 0 && (
          <Rating size="small" name="rating" value={params.row.rating} readOnly />
        ),
    },
    {
      field: 'isDeactive',
      headerName: 'Actions',
      width: 400,
      renderCell: renderActions,
    },
  ];

  useEffect(() => {
    getStaticData();
    onSearch();
  }, []);

  const closeConfirmModal = () => {
    setSelectedBike();
  };
  const onSearch = () => {
    searchBikes({
      startTime,
      endTime,
      color: colors,
      model: models,
      location: locations,
      rating: ratings,
    })
      .then((response) => {
        setBikeList(response);
      })
      .catch(() => {});
  };
  const onConfirmBooking = () => {
    reserveBike({
      startTime,
      endTime,
      bikeId: selectedBike._id,
      userId: userDetails._id,
    })
      .then((response) => {
        setSelectedBike();
        navigate('/userReservations');
      })
      .catch(() => {});
  };

  return (
    <Grid container style={{ padding: 20 }}>
      {selectedBike && (
        <ConfirmModal
          handleClose={closeConfirmModal}
          selectedBike={selectedBike}
          onConfirmBooking={() => onConfirmBooking()}
          startTime={format(startTime, 'dd/MM/yyyy hh:mm a')}
          endTime={format(endTime, 'dd/MM/yyyy hh:mm a')}
        />
      )}
      <LocalizationProvider dateAdapter={DateAdapter}>
        <Grid container spacing={1} style={{ marginBottom: 30 }}>
          <Grid item sm={4}>
            <DesktopDateTimePicker
              value={startTime}
              label="Start time"
              onChange={(newValue) => {
                setStartTime(newValue);
              }}
              minDateTime={new Date()}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minutesStep={30}
            />
          </Grid>
          <Grid item sm={4}>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DesktopDateTimePicker
                value={endTime}
                label="End time"
                onChange={(newValue) => {
                  setEndTime(newValue);
                }}
                minDateTime={startTime}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minutesStep={30}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              disablePortal
              value={models}
              multiple
              limitTags={3}
              onChange={(event, newValue) => {
                setModels(newValue);
              }}
              id="combo-box-demo"
              options={state?.staticData?.model || []}
              fullWidth
              renderInput={(params) => <TextField {...params} fullWidth label="Models" />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              disablePortal
              value={colors}
              multiple
              limitTags={3}
              onChange={(event, newValue) => {
                setColors(newValue);
              }}
              id="combo-box-demo"
              options={state?.staticData?.color || []}
              fullWidth
              renderInput={(params) => <TextField {...params} fullWidth label="Colors" />}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Autocomplete
              disablePortal
              value={locations}
              multiple
              limitTags={3}
              onChange={(event, newValue) => {
                setLocations(newValue);
              }}
              id="combo-box-demo"
              options={state?.staticData?.location || []}
              fullWidth
              renderInput={(params) => <TextField {...params} fullWidth label="Locations" />}
            />
          </Grid>
          <Grid item sm={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-helper-label">Rating</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={ratings}
                fullWidth
                label="Ratings"
                onChange={(event) => setRatings(event.target.value)}>
                <MenuItem value={0}>
                  {' '}
                  <Rating size="small" value={0} readOnly /> and up
                </MenuItem>
                <MenuItem value={1}>
                  {' '}
                  <Rating size="small" value={1} readOnly /> and up
                </MenuItem>
                <MenuItem value={2}>
                  <Rating size="small" value={2} readOnly /> and up
                </MenuItem>
                <MenuItem value={3}>
                  <Rating size="small" value={3} readOnly /> and up
                </MenuItem>
                <MenuItem value={4}>
                  <Rating size="small" value={4} readOnly /> and up
                </MenuItem>
                <MenuItem value={5}>
                  <Rating size="small" value={5} readOnly /> and up
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={3}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={() => {
                onSearch();
              }}>
              Search Bike
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
      {bikeList?.length > 0 && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={bikeList} columns={columns} pageSize={10} autoHeight disableColumnMenu />
        </div>
      )}
      {bikeList?.length === 0 && <h3>No bikes available</h3>}
    </Grid>
  );
}
