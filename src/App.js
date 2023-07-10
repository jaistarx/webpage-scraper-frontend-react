import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header/header";
import Home from "./components/home/home";
import TableViewer from "./components/table-viewer/table-viewer";

function App() {
  const [load, setLoad] = useState(false);
  const [urlData, setUrlData] = useState([]);
  const [originalUrlData, setOriginalUrlData] = useState([]);
  return (
    <>
      <BrowserRouter>
        <Header
          setUrlData={setUrlData}
          originalUrlData={originalUrlData}
        ></Header>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home load={load} setLoad={setLoad}></Home>
              </>
            }
          />
          <Route
            path="/table-viewer"
            element={
              <>
                <TableViewer
                  load={load}
                  setLoad={setLoad}
                  urlData={urlData}
                  setUrlData={setUrlData}
                  setOriginalUrlData={setOriginalUrlData}
                ></TableViewer>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
