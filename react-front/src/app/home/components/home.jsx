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
import calendarIcon from "./../../../assets/calendar-date-svgrepo-com.svg";
import appointmentIcon from "./../../../assets/patient_create.png";

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
    <div id="mainBody" style={{ position: 'relative' }} >
      

      <div className="slogan">LA SALUD ORGANIZADA ES LA SALUD MEJORADA</div>

      <div className="grid-layout">
        <div appHasRole="general_patients">
          <button
            className="calendar"
            onClick={() => (window.location.href = "/home/calendar")}
          >
            <img
              className="calendario"
              src={calendarIcon}
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
            <img className="citas" src={appointmentIcon} alt="error de carga" />
          </button>
          <p>Citas</p>
        </div>
      </div>
    </div>
  );
}
export default Home;
