import AppointmentIcon from "../../../../assets/patient_create.png"
import SearchIcon from "../../../../assets/lupa.png"
function Appointment() {
    return (
        <div>
            

            <div className="grid-layout">
                <div>
                    <button
                        className="create"
                        onClick={() => window.location.href = '/home/patient/create'}
                    >
                        <img
                            className="patient"
                            src={AppointmentIcon}
                            alt="error de carga"
                        />
                    </button>
                    <p>Solicitar cita</p>
                </div>

                <div>
                    <button
                        className="search"
                        onClick={() => window.location.href = '/home/patient/search'}
                    >
                        <img 
                            className="search" 
                            src={SearchIcon} 
                            alt="error de carga" 
                        />
                    </button>
                    <p>Mis citas</p>
                </div>
            </div>
        </div>
    );
}

export default Appointment;
