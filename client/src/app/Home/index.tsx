import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "api/room";
import { v4 as uuid } from 'uuid';

import styles from "./styles.module.scss";
interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const navigate = useNavigate();
  
    const handleCreateTemporaryRoom = async () => {
      try {
        const dataObj = {
          name : "Room " + uuid(),
          title : "title",
          type : "TEMPORARY"
      }
        console.log("🚀 ~ file: index.tsx:19 ~ handleCreateTemporaryRoom ~ dataObj:", dataObj)

        const res = await createRoom(dataObj);

        navigate(`/session/${res.data.room._id}`)
      } catch (error) {
        console.log(error)
      }

    };
  
  const handleCreatePremanantRoom = () => {
    // open a modal for getting room data
  };

  return (
    <div className={styles.home}>
      <div className={styles.menu}>
        <div onClick={handleCreateTemporaryRoom} className={styles.menu_item}>
          Create Temporary Room
        </div>
        <div onClick={handleCreatePremanantRoom} className={styles.menu_item}>
          Create Permanent Room
        </div>
        <div
          onClick={() => {
            navigate("/rooms");
          }}
          className={styles.menu_item}
        >
          Rooms List
        </div>
        <div
          onClick={() => {
            navigate("/youtube-search");
          }}
          className={styles.menu_item}
        >
          YouTube
        </div>
      </div>
    </div>
  );
};

export default Home;
