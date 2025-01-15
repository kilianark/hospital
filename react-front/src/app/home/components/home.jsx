import * as React from 'react';
import './home.css';

function Home() {
  
  return (
    <div id="mainBody" style={{ position: 'relative' }} >
      

      <div className="slogan">LA SALUD ORGANIZADA ES LA SALUD MEJORADA</div>

      <div className="grid-layout">
        <div appHasRole="general_patients">
          <button className="calendar" onClick={() => window.location.href = '/home/calendar'}>
            <img className="calendario" src="assets/calendario.png" alt="error de carga" />
          </button>
          <p>Calendario</p>
        </div>

        <div appHasRole="general_citas">
          <button className="citas" onClick={() => window.location.href = '/home/citas'}>
        <img className="citas" src="assets/hab.png" alt="error de carga" />
          </button>
          <p>Citas</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
