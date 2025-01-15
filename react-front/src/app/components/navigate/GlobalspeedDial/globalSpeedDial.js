// GlobalSpeedDial.js
import React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import AppsIcon from '@mui/icons-material/Apps';

const GlobalSpeedDial = () => {
    const actions = [
        { icon: <PersonIcon />, name: "Usuario" },
        {
          icon: <CalendarTodayIcon />,
          name: "Citas",
          onClick: () => (window.location.href = "/home/citas"),
        },
        { icon: <AppsIcon />, name: "Mas" },
      ];
    
      const [open, setOpen] = React.useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
    
      return (
        <div id="mainBody" style={{ position: "relative" }} onClick={handleClose}>
          <Box
            sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Backdrop open={open} onClick={handleClose} />
            <SpeedDial
              ariaLabel="SpeedDial tooltip example"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              icon={<SpeedDialIcon />}
              onClose={handleClose}
              onOpen={handleOpen}
              open={open}
            >
              {actions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  tooltipOpen
                  onClick={() => {
                    handleClose(); // Cierra el menú
                    action.onClick && action.onClick(); // Ejecuta la acción
                  }}
                />
              ))}
            </SpeedDial>
          </Box>
  
        </div>
      );
    };
export default GlobalSpeedDial;
