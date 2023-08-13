import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";

import styles from "./styles.module.scss";

interface SessionProps {}

const Session: FunctionComponent<SessionProps> = () => {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // connect to socket
    }
  }, [id]);

  return (
    <div className={styles.session}>
      <div className={styles.content}>
        <div className={styles.video}></div>
        <div className={styles.box}></div>
      </div>
      <div className={styles.details}></div>
    </div>
  );
};

export default Session;
