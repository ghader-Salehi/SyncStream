import "./App.css";
import Main from "../src/app/index";
// import { useEffect } from "react";
// import { grant } from "api/auth";
// import { initAxios } from "api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
  // const handleGrantUserInfo = async () => {
  //   try {
  //     const res = await grant();
  //     const token = res.data.token;
  //     localStorage.setItem("ss_token", token);
  //     initAxios(token);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   handleGrantUserInfo();
  // }, []);

  return (
    <div className="App">
      <Main />
      <ToastContainer
      style={{textAlign : "left"}}
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
