import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./app/components/navigate/header/header";
import Home from "./app/home/components/home";
import Calendar from "./app/home/components/patient/calendar/calendar";

import Appointment from "./app/home/components/appointment/appointment";
function App() {
  // Detecta la URL actual
  const currentPath = window.location.pathname;

  // Renderiza el componente según la ruta
  let ComponentToRender;
  if (currentPath === "/home/citas") {
    ComponentToRender = <Appointment />;
  } else {
    ComponentToRender = <Home />;
  }

  return (
    <Router>
      <div className="App">
        <div className="header">
          <Header />
        </div>
        <Home />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Navigate />} />
        <Route path="/appointment" element={<Calendar />} />
      </Routes>
    </Router>
  );
}

export default App;
