import { FunctionComponent, FormEvent, Dispatch, SetStateAction, useState } from "react";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";

import { login, register } from "api/auth";
import { AuthInfo, AuthStore } from "mobx/authStore";

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

type ModalForm = "login" | "register";

interface IAuthModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  modalState: ModalForm;
  setModalState: Dispatch<SetStateAction<ModalForm>>;
}

interface ILoginForm {
  auth: AuthInfo;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface IRegisterForm {
  setModalState: Dispatch<SetStateAction<ModalForm>>;
}

const LoginForm = observer(({ auth, setOpen }: ILoginForm) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });

      auth.setToken(res.data.token);
      const userObj = {
        email: res.data.user.email,
        name: res.data.user.name,
        password: res.data.user.password,
      }
      auth.setUser(userObj);
      localStorage.setItem("ss_user" , JSON.stringify(userObj));
      setOpen(false);
      toast.success("You logged in successfully");
    } catch (error) {
      toast.error("Failure");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <TextField
        style={{ margin: "32px 0px 16px 0px", width: "100%" }}
        id="outlined-basic"
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        style={{ margin: "8px 0", width: "100%" }}
        id="outlined-basic"
        label="Password"
        variant="outlined"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
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
  );
});

const RegisterForm = ({ setModalState }: IRegisterForm) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await register({ name, email, password });
    console.log(res.data);
    toast.success("User registered successfully");
    setModalState("login")
    try {
    } catch (error) {
      toast.error("Failure");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <TextField
        style={{ margin: "8px 0", width: "100%" }}
        id="outlined-basic"
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        style={{ margin: "32px 0px 16px 0px", width: "100%" }}
        id="outlined-basic"
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        style={{ margin: "8px 0", width: "100%" }}
        id="outlined-basic"
        label="Password"
        variant="outlined"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
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
  );
};

const AuthModal: FunctionComponent<IAuthModalProps> = ({
  open,
  setOpen,
  modalState,
  setModalState,
}) => {
  const handleSetModalState = (state: ModalForm) => () => {
    setModalState(state);
  };

  const renderLoginForm = (
    <>
      <div>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Login
        </Typography>
      </div>
      <LoginForm auth={AuthStore} {...{ setOpen }} />
      <div onClick={handleSetModalState("register")} style={{ marginTop: 24, cursor: "pointer" }}>
        <span>Register</span>
      </div>
    </>
  );
  const renderRegisterForm = (
    <>
      <div>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Register
        </Typography>
      </div>
      <RegisterForm {...{ setModalState }} />
      <div onClick={handleSetModalState("login")} style={{ marginTop: 24, cursor: "pointer" }}>
        <span>Login</span>
      </div>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{modalState === "login" ? renderLoginForm : renderRegisterForm}</Box>
    </Modal>
  );
};

export default AuthModal;
