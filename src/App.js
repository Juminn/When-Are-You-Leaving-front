import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import "./App.css";
import AddressMap from "./naverMap/components/AddressMap";
import Survey from "./survey/Survey";
import ResultsPage from "./survey/ResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddressMap />} />
        <Route path="/Survey" element={<Survey />} />
        <Route path="/Survey/result" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
