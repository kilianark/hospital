function Home() {
  return (
      <body>
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
        </div>
      </body>
    
  );
}

export default Home;