function Appointment() {
    return (
        <body>
            <div class="title">Citas:</div>

            <div class="grid-layout">
            <div>
                <button
                class="create"
                onclick="window.location.href='/home/patient/create';"
                >
                <img
                    class="patient"
                    src="assets/patient_create.png"
                    alt="error de carga"
                />
                </button>
                <p>Solicitar cita</p>
            </div>
            <div>
                <button
                class="search"
                onclick="window.location.href='/home/patient/search';"
                >
                <img 
                class="search" 
                src="assets/lupa.png" 
                alt="error de carga" 
                />
                </button>
                <p>Mis citas</p>
            </div>
            </div>
        </body>
    );
}

export default Appointment;