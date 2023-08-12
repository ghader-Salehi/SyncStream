import Home from "app/Home";
import Session from "app/Session";
import Rooms from "app/Rooms";
import YouTube from "app/YouTube";
// TODO: add lazy import

const ROUTES = [
  { path: "/", component: Home },
  { path: "/session/:id", component: Session },
  { path: "/rooms", component: Rooms },
  { path: "/youtube-search", component: YouTube },
];



export default ROUTES;
