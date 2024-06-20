import './App.css';
import MaplibreMap from "./components/MaplibreMap";
import Header from "./components/Header";

function App() {
  return (
    <>
    <Header />
    <div className="App">
      <MaplibreMap />
    </div>
    </>
  );
}

export default App;
