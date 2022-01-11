import React, { useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { AppContext } from '../../context';
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
const initialData = {
  color: '',
  modal: '',
  location: '',
};

function AddEditBikeModal({ open, handleClose, bikeData, onAddEdit }) {
  const [{ color, model, location }, setState] = React.useState(bikeData || initialData);
  const { state } = useContext(AppContext);
  const { getStaticData, addBike, updateBike } = ApiService();

  const onSubmit = () => {
    if (bikeData?._id) {
      updateBike({ color, model, location }, bikeData?._id)
        .then(() => {
          onAddEdit();
          handleClose();
        })
        .catch(() => {});
    } else {
      addBike({ color, model, location })
        .then(() => {
          onAddEdit();
          handleClose();
        })
        .catch(() => {});
    }
  };
  useEffect(() => {
    if (!state.staticData) getStaticData();
  }, []);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
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
              Add Bike
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  disablePortal
                  value={model}
                  onChange={(event, newValue) => {
                    setState((prevState) => ({
                      ...prevState,
                      model: newValue,
                    }));
                  }}
                  id="combo-box-demo"
                  options={state?.staticData?.model || []}
                  fullWidth
                  renderInput={(params) => <TextField {...params} fullWidth label="Model" />}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  disablePortal
                  value={color}
                  onChange={(event, newValue) => {
                    setState((prevState) => ({
                      ...prevState,
                      color: newValue,
                    }));
                  }}
                  id="combo-box-demo"
                  options={state?.staticData?.color || []}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Color" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  value={location}
                  onChange={(event, newValue) => {
                    setState((prevState) => ({
                      ...prevState,
                      location: newValue,
                    }));
                  }}
                  id="combo-box-demo"
                  options={state?.staticData?.location || []}
                  renderInput={(params) => <TextField {...params} label="location" />}
                />
              </Grid>
            </Grid>
            <Button
              onClick={() => onSubmit()}
              fullWidth
              variant="contained"
              color="primary"
              disabled={!(model && color && location)}
              sx={{ mt: 3, mb: 2 }}>
              Save
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default AddEditBikeModal;
