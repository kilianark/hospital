import "./App.css";
import Header from "./app/components/navigate/header/header";
import Home from "./app/home/components/home";
import Calendar from "./app/home/components/patient/calendar/calendar";
import Appointment from "./app/home/components/appointment/appointment";

import GlobalSpeedDial from './app/components/navigate/GlobalspeedDial/globalSpeedDial'; // Importa el SpeedDial

function App() {
  // Detecta la URL actual
  const currentPath = window.location.pathname;

  // Renderiza el componente según la ruta
  let ComponentToRender;
  if (currentPath === "/home/citas") {
    ComponentToRender = <Appointment />;
  } else if (currentPath === "/home/calendar") {
    ComponentToRender = <Calendar />;
  } else {
    ComponentToRender = <Home />;
  }

  return (
    <div className="App">
      {/* Renderiza el encabezado en todas las páginas */}
      <div className="header">
        <Header />
      </div>

      {/* Renderiza el componente principal según la ruta */}
      {ComponentToRender}

      {/* SpeedDial global disponible en todas las páginas */}
      <GlobalSpeedDial />
    </div>
  );
}

export default App;
