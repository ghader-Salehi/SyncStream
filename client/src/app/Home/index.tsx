import { FunctionComponent, useState , FormEvent} from "react";

import { useNavigate } from "react-router-dom";
import { createRoom, IRoom } from "api/room";
import { v4 as uuid } from "uuid";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem/MenuItem";
// import { InputLabel } from "@mui/material";

import styles from "./styles.module.scss";
import { AuthInfo } from "mobx/authStore";
import { toast } from "react-toastify";

interface HomeProps {
  auth: AuthInfo;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const Home: FunctionComponent<HomeProps> = observer(({ auth }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [roomTitle, setRoomTitle] = useState("");
  // const [roomType , setRoomType] = useState(0);

  const handleCreateTemporaryRoom = async () => {
    try {
      const dataObj: IRoom = {
        name: "Room " + uuid(),
        title: "title",
        type: "TEMPORARY",
      };

      const res = await createRoom(dataObj);

      navigate(`/session/${res.data.room._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatePermanentRoom = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await createRoom({
        name : roomName,
        title : roomTitle,
        type : "PERMANENT"
      })

      navigate(`/session/${res.data.room.id}`);
    } catch (error) {
        console.log(error);
        
    }
  };

  const renderCreateRoomForm = (
    <form onSubmit={handleCreatePermanentRoom}>
      <TextField
        style={{ margin: "32px 0px 16px 0px", width: "100%" }}
        id="outlined-basic"
        label="Room Name"
        variant="outlined"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <TextField
        style={{ margin: "8px 0", width: "100%" }}
        id="outlined-basic"
        label="Room Title"
        variant="outlined"
        value={roomTitle}
        onChange={(e) => setRoomTitle(e.target.value)}
      />
      {/* <InputLabel style={{ marginTop: "8px", width: "100%" , }}>
        Room Type
      </InputLabel> */}
      {/* <Select
        style={{ marginTop: "8px", width: "100%" , }}
        label="Type"
        value={roomType}
        onChange={(e)=>setRoomType(+e.target.value)}
        variant="standard"
      >
        <MenuItem value={0}>Permanent</MenuItem>
        <MenuItem value={1}>Temporary</MenuItem>
      </Select> */}

      <Button
        style={{ marginTop: 24, width: "100%" }}
        type="submit"
        color="primary"
        variant="contained"
      >
        Create
      </Button>
    </form>
  );

  return (
    <div className={styles.home}>
      <div className={styles.menu}>
        <Button onClick={handleCreateTemporaryRoom} className={styles.menu_item}>
          Create Temporary Room
        </Button>
        <Button onClick={() => {
          if(auth.user){
            setOpen(true)
            return;
          }
          toast.warn("You should login before create a permanent room")
          
        }} className={styles.menu_item}>
          Create Permanent Room
        </Button>
        <Button
          onClick={() => {
            navigate("/rooms");
          }}
          className={styles.menu_item}
        >
          Rooms List
        </Button>
        <Button
          onClick={() => {
            navigate("/youtube-search");
          }}
          className={styles.menu_item}
        >
          YouTube
        </Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Permanent Room
          </Typography>
          {renderCreateRoomForm}
        </Box>
      </Modal>
    </div>
  );
});

export default Home;
