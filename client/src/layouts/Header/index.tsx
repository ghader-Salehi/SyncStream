import { useState } from "react";

import { Button, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import styles from "./styles.module.scss";

type ModalForm = "login" | "register"

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalForm>("login");

  console.log(modalState);

  const handleSetModalState = (state : ModalForm) => () => {
    setModalState(state)
  }
  

  const renderLoginForm = (
    <>
      <div>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Login
        </Typography>
      </div>
      <form>
        <TextField
          style={{ margin: "32px 0px 16px 0px", width: "100%" }}
          id="outlined-basic"
          label="Username"
          variant="outlined"
        />
        <TextField
          style={{ margin: "8px 0", width: "100%" }}
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />

        <Button
          style={{ marginTop: 24, width: "100%" }}
          type="submit"
          color="primary"
          variant="contained"
        >
          Submit
        </Button>
        <div onClick={handleSetModalState("register")} style={{ marginTop: 24, cursor: "pointer" }}>
          <span>Register</span>
        </div>
      </form>
    </>
  );
  const renderRegisterForm = (
    <>
      <div>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Register
        </Typography>
      </div>
      <form>
        <TextField
          style={{ margin: "32px 0px 16px 0px", width: "100%" }}
          id="outlined-basic"
          label="Email"
          variant="outlined"
        />
        <TextField
          style={{ margin: "8px 0", width: "100%" }}
          id="outlined-basic"
          label="Username"
          variant="outlined"
        />
        <TextField
          style={{ margin: "8px 0", width: "100%" }}
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />

        <Button
          style={{ marginTop: 24, width: "100%" }}
          type="submit"
          color="primary"
          variant="contained"
        >
          Submit
        </Button>
      </form>
      <div onClick={handleSetModalState("login")} style={{ marginTop: 24, cursor: "pointer" }}>
        <span >Login</span>
      </div>
    </>
  );

  return (
    <div className={styles.header}>
      <div className={styles.heading}>
        <span className={styles.logo}>SyncStream</span>
        <a href="https://github.com/ghader-Salehi/SyncStream" target="_blank" rel="noreferrer">
          <IconButton className={styles.github} color="default">
            <GitHubIcon color="action" />
          </IconButton>
        </a>
      </div>
      <div className={styles.login}>
        <Button onClick={() => setOpen(true)} className={styles.login_btn} variant="text">
          Login
        </Button>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{modalState === "login" ? renderLoginForm : renderRegisterForm}</Box>
      </Modal>
    </div>
  );
}

export default Header;
