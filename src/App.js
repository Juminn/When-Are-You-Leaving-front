import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import "./App.css";
import AddressMap from "./naverMap/components/AddressMap";
import Survey from "./survey/Survey";
import ResultsPage from "./survey/ResultPage";
import ResultPageTest from "./survey/ResultPageTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddressMap />} />
        <Route path="/Survey" element={<Survey />} />
        <Route path="/Survey/result" element={<ResultsPage />} />
        <Route path="/test" element={<ResultPageTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
