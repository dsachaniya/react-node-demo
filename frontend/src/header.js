import React from 'react';
import { useNavigate } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';

export default function Header({ userDetails }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const redirectToProfile = () => {
    handleClose();
  };
  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
    handleClose();
  };
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { md: 'flex' } }}>
            Bike Rent
          </Typography>
          <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
            {userDetails?.role === 1 && (
              <>
                <Button
                  key="user"
                  onClick={() => navigate('userList')}
                  sx={{ my: 2, color: 'white', display: 'block' }}>
                  Users
                </Button>
                <Button
                  key="bikes"
                  onClick={() => navigate('bikeList')}
                  sx={{ my: 2, color: 'white', display: 'block' }}>
                  Bikes
                </Button>
              </>
            )}
            {userDetails?.role === 2 && (
              <>
                <Button
                  key="book"
                  onClick={() => navigate('reserveBike')}
                  sx={{ my: 2, color: 'white', display: 'block' }}>
                  Book a Bike
                </Button>
                <Button
                  key="myBooking"
                  onClick={() => navigate('userReservations')}
                  sx={{ my: 2, color: 'white', display: 'block' }}>
                  My Bookings
                </Button>
              </>
            )}
          </Box>
          {userDetails && (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ p: 0 }}>
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}>
                {/* <MenuItem onClick={() => redirectToProfile()}>My Profile</MenuItem> */}
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
