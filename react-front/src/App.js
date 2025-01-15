import "./App.css";
import Header from "./app/components/navigate/header/header";
import Home from "./app/home/components/home";
import Calendar from "./app/home/components/patient/calendar/calendar";
import Appointment from "./app/home/components/appointment/appointment";
import { Component } from "react";
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
    <div className="App">
      <div className="header">
        <Header />
      </div>
      {ComponentToRender}
    </div>
  );
}

export default App;
