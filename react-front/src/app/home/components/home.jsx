import * as React from "react";
import "./home.css";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import AppsIcon from "@mui/icons-material/Apps";

function Home() {
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

      <div className="slogan">LA SALUD ORGANIZADA ES LA SALUD MEJORADA</div>

      <div className="grid-layout">
        <div appHasRole="general_patients">
          <button
            className="calendar"
            onClick={() => (window.location.href = "/home/calendar")}
          >
            <img
              className="calendario"
              src="assets/calendario.png"
              alt="error de carga"
            />
          </button>
          <p>Calendario</p>
        </div>

        <div appHasRole="general_citas">
          <button
            className="citas"
            onClick={() => (window.location.href = "/home/citas")}
          >
            <img className="citas" src="assets/hab.png" alt="error de carga" />
          </button>
          <p>Citas</p>
        </div>
      </div>
    </div>
  );
}
export default Home;
