import "./App.css";
import Main from "../src/app/index";
import { useEffect } from "react";
import { grant } from "api/auth";
import { initAxios } from "api";

function App() {
  const handleGrantUserInfo = async () => {
    try {
      const res = await grant();
      const token = res.data.token;
      localStorage.setItem("ss_token", token);
      initAxios(token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGrantUserInfo();
  }, []);

  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
