import { Routes, Route } from "react-router-dom";
import Header from "layouts/Header";
import ROUTES from "./routes";

function Main() {
  return (
    <div>
      <Header />
      <Routes>
        {ROUTES.map((r, i)=>{
          return (
            <Route key={i} path={r.path} element={<r.component />} />
          )
        })}
      </Routes>
    </div>
  );
}

export default Main;
