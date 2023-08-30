import { Routes, Route } from "react-router-dom";
import Header from "layouts/Header";
import Home from "app/Home";
import Session from "app/Session";
import Rooms from "app/Rooms";
import YouTube from "app/YouTube";
import { VideoInfosStore } from "mobx/videoStore";

function Main() {
  return (
    <div>
      <Header />
      <main style={{paddingTop : 80}}>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/session/:id"} element={<Session videoStore={VideoInfosStore} />} />
          <Route path={"/rooms"} element={<Rooms />} />
          <Route path={"/youtube-search"} element={<YouTube videoStore={VideoInfosStore} />} />
        </Routes>
      </main>
    </div>
  );
}

export default Main;
