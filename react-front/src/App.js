import './App.css';
import Header from './app/components/navigate/header/header';
import Home from './app/home/components/home';
function App() {
  return (
    <div className="App">
      <div className="header">
        <Header />
      </div>
        <Home />
    </div>
  );
}

export default App;

