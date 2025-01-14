import * as React from 'react';
import './home.css';
import CalendarImg from "../../../assets/lupa.png";   
import CitasImg from "../../../assets/hab.png";
function Home() {
    
  return (
        <div id="mainBody">
        <link rel="stylesheet" href="home.css" />
        <div class="slogan">LA SALUD ORGANIZADA ES LA SALUD MEJORADA</div>
        <div class="grid-layout">
          <div appHasRole="general_patients">
            <button class="calendar" onclick="window.location.href='/home/calendar';">
              <img class="calendario" src={CalendarImg} alt="error de carga" />
            </button>
            <p>Calendario</p>
          </div>
          <div appHasRole="general_citas">
            <button class="citas" onclick="window.location.href='/home/citas';">
              <img class="citas" src={CitasImg} alt="error de carga" />
            </button>
            <p>Citas</p>
          </div>
        </div></div>

    
  );
}

export default Home;