import logo from './assets/img/logo.svg';
import './App.css';
import Header from './app/components/navigate/header/header';
function App() {
  return (
    <div className="App">
        <Header />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a href="\app\components\navigate\header\header.jsx" className="fa fa-google">clickHere</a>
      </header>
    </div>
  );
}

export default App;

