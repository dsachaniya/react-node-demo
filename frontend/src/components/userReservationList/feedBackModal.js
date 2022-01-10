import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid';

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

export default function FeedbackModal({ open, handleClose, onRatingSubmit }) {
  const [rating, setRating] = React.useState();

  const onSubmit = () => {
    onRatingSubmit({ rating });
  };
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
              Rating
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Rating
                  size="large"
                  name="half-rating"
                  defaultValue={0}
                  precision={1}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              onClick={() => onSubmit()}
              fullWidth
              variant="contained"
              color="primary"
              disabled={!rating}
              sx={{ mt: 3, mb: 2 }}>
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
