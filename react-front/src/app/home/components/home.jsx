import * as React from "react";
import "./home.css";
import CalendarImg from "../../../assets/lupa.png";
import CitasImg from "../../../assets/hab.png";
import { useNavigate } from "react-router-dom";
import Calendar from "./patient/calendar/calendar";

function Home() {
  const navigate = useNavigate();

  const goToCalendar = () => {
    navigate("./calendar"); // Adjust path to match your routing setup
  };

  const goToCitas = () => {
    navigate("./appointment"); // Adjust path to match your routing setup
  };

  return (
    <div id="mainBody">
      <link rel="stylesheet" href="home.css" />
      <div className="slogan">LA SALUD ORGANIZADA ES LA SALUD MEJORADA</div>
      <div className="grid-layout">
        <div appHasRole="general_patients">
          <button onClick={goToCalendar} className="calendar">
            <img
              className="calendario"
              src={CalendarImg}
              alt="error de carga"
            />
          </button>
          <p>Calendario</p>
        </div>
        <div appHasRole="general_citas">
          <button onClick={goToCitas} className="citas">
            <img className="citas" src={CitasImg} alt="error de carga" />
          </button>
          <p>Citas</p>
        </div>
      </div>
    </div>
  );
}
export default Home;
