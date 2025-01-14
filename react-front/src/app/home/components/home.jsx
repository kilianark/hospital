import * as React from 'react';
import './home.css';
import Header from '../../components/navigate/header/header';
function Home() {
  return (
        <div id="mainBody">
        <link rel="stylesheet" href="home.css" />
        <div class="slogan">LA SALUD ORGANIZADA ES LA SALUD MEJORADA</div>
        <div class="grid-layout">
          <div appHasRole="general_patients">
            <button class="calendar" onclick="window.location.href='/home/calendar';">
              <img class="calendario" src="assets/calendario.png" alt="error de carga" />
            </button>
            <p>Calendario</p>
          </div>
          <div appHasRole="general_citas">
            <button class="citas" onclick="window.location.href='/home/citas';">
              <img class="citas" src="assets/hab.png" alt="error de carga" />
            </button>
            <p>Citas</p>
          </div>
        </div></div>

    
  );
}

export default Home;