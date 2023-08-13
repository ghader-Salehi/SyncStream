import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";
interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const navigate = useNavigate();
  
    const handleCreateTemporaryRoom = () => {
      // generate a room, get its id then redirect to session
      navigate("/session/14")
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
