import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./app/components/navigate/header/header";
import Home from "./app/home/components/home";
import Calendar from "./app/home/components/patient/calendar/calendar";
function App() {
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
