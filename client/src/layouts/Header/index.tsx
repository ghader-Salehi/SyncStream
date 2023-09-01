import { useState } from "react";

import { Button, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate } from "react-router-dom";
import AuthModal from "components/modals/Auth";
import { observer } from "mobx-react-lite";
import { grant } from "api/auth";

import styles from "./styles.module.scss";
import { AuthInfo } from "mobx/authStore";

type ModalForm = "login" | "register";
interface IHeader {
  auth: AuthInfo;
}

function Header({ auth }: IHeader) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalForm>("login");

  const handleGrantUserInfo = async () => {
    try {
      const res = await grant();
      const token = res.data.token;
      auth.setToken(token);
      localStorage.setItem("ss_token", token);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogin = () => {
    setOpen(true);
    setModalState("login");
  };

  const handleLogout = () => {
    auth.setToken("");
    auth.setUser(null);
    localStorage.removeItem("ss_user")
    handleGrantUserInfo();
  };

  const handleRegister = () => {
    setOpen(true);
    setModalState("register");
  }

  return (
    <div className={styles.header}>
      <div className={styles.heading}>
        <span onClick={() => navigate("/")} className={styles.logo}>
          SyncStream
        </span>
        <a href="https://github.com/ghader-Salehi/SyncStream" target="_blank" rel="noreferrer">
          <IconButton className={styles.github} color="default">
            <GitHubIcon color="action" />
          </IconButton>
        </a>
      </div>
      <div className={styles.login}>
        {auth.user ? (
          <div className={styles.username}>
            <span>{auth.user.name}</span>
          </div>
        ) : (
          <Button onClick={handleLogin} className={styles.login_btn} variant="text">
            Login
          </Button>
        )}

        {auth.user ? (
          <Button onClick={handleLogout} className={styles.login_btn} variant="text">
            Logout
          </Button>
        ) : (
          <Button
            onClick={handleRegister}
            className={styles.login_btn}
            variant="text"
          >
            Sign up
          </Button>
        )}
      </div>
      <AuthModal {...{ open, setOpen, modalState, setModalState }} />
    </div>
  );
}

export default observer(Header);
