import { DataGrid } from '@mui/x-data-grid';

const rows = [
    { id: 1, doctor: 'Hello', date: 'World' },
    { id: 2, doctor: 'DataGridPro', date: 'is Awesome' },
    { id: 3, doctor: 'MUI', date: 'is Amazing' },
  ];

  const columns = [
    { field: 'doctor', headerName: 'Doctor', width: 150 },
    { field: 'date', headerName: 'Fecha', width: 150 },
  ];

function AppointmentList() {
    return (
        <div className='patientAppointments'>
            <DataGrid rows={rows} columns={columns} />
        </div>
    )
}

export default AppointmentList;