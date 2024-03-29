import "./App.css";
import AddressMap from "./naverMap/components/AddressMap";
import SimpleMap from "./naverMap/components/SimpleMap";
import { MapProvider } from "./naverMap/context/MapContext";

function App() {
  return (
    <MapProvider>
      <div>
        <AddressMap />
      </div>
    </MapProvider>
  );
}

export default App;
