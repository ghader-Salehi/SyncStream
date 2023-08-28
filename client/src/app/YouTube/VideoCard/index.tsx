import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

import styles from "./styles.module.scss";
import { createRoom } from "api/room";

interface IVideoCard {
  id: string;
  title: string,
  thumbnail: string;
  setVideoUrl : () => void
}

const VideoCard = ({ id, title , thumbnail , setVideoUrl }: IVideoCard) => {
  const navigate = useNavigate();
    


  const handleClickOnCard = async () =>{
    try {
      const dataObj = {
        name: "Room " + uuid(),
        title: "title",
        type: "TEMPORARY",
      };

      const res = await createRoom(dataObj);
      console.log(setVideoUrl);
      
      setVideoUrl()
      navigate(`/session/${res.data.room._id}`); 
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.card__inner} onClick={handleClickOnCard} >
        <img src={thumbnail} alt={title} />
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default VideoCard;