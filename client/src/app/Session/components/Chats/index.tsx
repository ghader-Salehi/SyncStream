import styles from "./styles.module.scss"

type PlayerState = "paused" | "buffering" | "playing" | "ready" | "unready";

interface User {
  id: string;
  name: string;
  email: string;
  state?: PlayerState;
}

export interface Chat {
  id: string;
  content: string;
  sender: User;
}

interface ChatsProps {
  chats: Chat[];
}

const Chats = ({ chats }: ChatsProps) => {
  return (
    <div className={styles.chats_list} style={{display: "flex" , flexDirection : "column" , alignItems : "center"}} >
      
      {chats.map((chat) => {
        return (
          <div  className={styles.chat}>
            <span className={styles.chat__sender}>{chat.sender.name} :</span>
            <span className={styles.chat__content}>{chat.content}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
