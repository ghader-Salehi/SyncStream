import styles from "./styles.module.scss";

function Header(){
    return (
        <div className={styles.header} >
            <div className={styles.logo} >
                SyncStream
            </div>

            <div className={styles.login} >
                    login
            </div>
        </div>
    )
}

export default Header;