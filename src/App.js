import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import "./App.css";
import AddressMap from "./naverMap/components/AddressMap";
import Survey from "./survey/Survey";
import ResultsPage from "./survey/ResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Survey />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
