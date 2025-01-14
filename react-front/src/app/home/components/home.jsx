function Home() {
  return (
      <body>
        <div class="slogan">{{'HOME_SLOGAN' | translate}}</div>
        <div class="grid-layout">
          <div appHasRole="general_patients">
            <button class="patient" onclick="window.location.href='/home/patient';">
              <img class="people" src="assets/people.png" alt="error de carga" />
            </button>
            <p>{{'PATIENTS' | translate }}</p>
          </div>
          <div appHasRole="general_rooms">
            <button class="room" onclick="window.location.href='/home/room';">
              <img class="room" src="assets/hab.png" alt="error de carga" />
            </button>
            <p>{{'ROOMS' | translate}}</p>
          </div>
          <div appHasRole="general_workers">
            <button class="worker" onclick="window.location.href='/home/worker';">
              <img class="worker"  src="assets/stethoscope-svgrepo-com.svg" alt="error de carga">
            </button>
            <p>{{'WORKERS' | translate}}</p>
          </div>
        </div>
      </body>
    
  );
}

export default Home;