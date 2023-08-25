import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import ReactPlayer from "react-player";

import { observer } from "mobx-react-lite";

import styles from "./styles.module.scss";
import { connectToSocket } from "api/socket";
import { VideoInfos } from "mobx/videoStore";

// interface OnProgressProps {
//   played: number;
//   playedSeconds: number;
//   loaded: number;
//   loadedSeconds: number;
// }

interface SessionProps {
  videoStore: VideoInfos;
}

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const formatProgressString = (amountOfSeconds: number) => {
  const sec_num = parseInt(amountOfSeconds + "", 10);
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  let seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = 0 + hours;
  }
  if (minutes < 10) {
    minutes = 0 + minutes;
  }
  if (seconds < 10) {
    seconds = 0 + seconds;
  }

  return hours + ":" + minutes + ":" + seconds;
};

const Session: FunctionComponent<SessionProps> = observer(({ videoStore }) => {
  const { id } = useParams();
  const [url, setUrl] = useState(videoStore.url);
  const [seeking, setSeeking] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [playedSecs, setPlayedSecs] = useState(0);
  const [duration, setDuration] = useState(0);
  const [boxCurrentTab, setBoxCurrentTab] = useState("users");

  const playerRef = useRef<ReactPlayer | null>(null);

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: any) => {
    setSeeking(false);
    const fraction = parseFloat(e.target.value);
    videoStore.setVideoPlayed(fraction)
    playerRef.current?.seekTo(fraction);
  };

  const handlePlayPause = (playing: boolean) => {
    videoStore.setVideoState(playing);
    socket.emit("/req", {
      playing,
      played: videoStore.played,
    });
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fraction = parseFloat(e.target.value);
    videoStore.setVideoPlayed(fraction);
    setPlayedSecs(+e.target.value * duration);
    socket.emit("/req", {
      playing: false,
      played: fraction,
    });

    videoStore.setVideoState(false);
  };

  useEffect(() => {
    if (id) {
      socket = connectToSocket(id);

      socket.on("connect", () => {
        console.log("connected successfully to socket");
      });

      socket.on("/sync", (data) => {
        if (data?.playing !== undefined) {
          videoStore.setVideoState(data.playing);
        }
        if (data?.played !== undefined) {
          videoStore.setVideoPlayed(data.played);
          playerRef.current?.seekTo(data.played);
          if (duration) setPlayedSecs(+data.played * duration);
        }
      });

      socket.on("/left-user", (data) => {
        console.log(data);
        setUsers((prev) => [...prev, { str: data }]);
      });

      socket.on("/join-user", (data) => {
        setUsers((prev) => [...prev, { str: data }]);

        socket.emit("/req", {
          playing: videoStore.playing,
          played: videoStore.played,
        });
      });

      socket.on("/get-video", (data) => {
        videoStore.setVideoUrl(data.url);
        setUrl(data.url);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoStore.playing) {
      socket.emit("/req", {
        playing: videoStore.playing,
        played: videoStore.played,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoStore.playing]);

  useEffect(() => {
    if (duration) setPlayedSecs(+videoStore.played * duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  useEffect(()=>{
    const isBuffering = videoStore.playerCurrentState === "buffering";
    const internalVideoPlayer = playerRef.current?.getInternalPlayer();
    const isReady = videoStore.isReady;
    
    if(isReady && internalVideoPlayer && !isBuffering){
      playerRef.current?.seekTo(videoStore.played); 
      videoStore.setPlayerIsReady(false);
    }
  })
  


  return (
    <div className={styles.session}>
      <div className={styles.content}>
        <div className={styles.video}>
          <ReactPlayer
            ref={playerRef}
            url={videoStore.url}
            width={"100%"}
            height={"100%"}
            volume={1}
            muted={isMuted}
            onPlay={() => {
              if ( !videoStore.playing ) {
                const test :any = playerRef.current;
                console.log(test?.player.handlePause);
                
              }
              videoStore.setVideoState(true);
              videoStore.setPlayerCurrentState("playing");
              // if (socket) socket.emit("/req", { playing: true });
            }}
            onPause={() => {
              videoStore.setVideoState(false);
              videoStore.setPlayerCurrentState("paused");
              // if (socket) socket.emit("/req", { playing: false });
            }}
            // onSeek={(time: number) => {
            //   console.log(time);
            // }}
            onBuffer={()=>{
              videoStore.setPlayerCurrentState("buffering");
            }}
            playing={videoStore.playing}
            onProgress={(progress) => {
              if (!seeking) {
                videoStore.setVideoPlayed(progress.played);
                setPlayedSecs(progress.playedSeconds);

                // if (
                //   +progress.playedSeconds.toFixed(0) > 0 &&
                //   +progress.playedSeconds.toFixed(0) % 5 === 0
                // ) {
                //   socket.emit("/req", {
                //     playing: videoStore.playing,
                //     played: videoStore.played,
                //   });
                // }
              }
            }}
            onDuration={(d) => {
              setDuration(d);
            }}
            onReady={(p)=>{
              console.log("ready")
              videoStore.setPlayerIsReady(true , p.getCurrentTime());
            }}
            config={{
              youtube: {
                playerVars: { showinfo: 1 }
              }
            }}
          />

          <div className={styles.custom_controls}>
            <button
              className={styles.control_btn}
              onClick={() => {
                handlePlayPause(!videoStore.playing);
              }}
            >
              {videoStore.playing ? "Pause" : "Play"}
            </button>
            <span className={styles.progress_time}>{formatProgressString(playedSecs)}</span>
            <input
              className={styles.seek_bar}
              type="range"
              min={0}
              max={1}
              step="any"
              value={videoStore.played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
            />
            {/* <button onClick={handleSkipBackward}>Skip Backward</button>
            <button onClick={handleSkipForward}>Skip Forward</button> */}
            <button onClick={() => setIsMuted(!isMuted)}>{isMuted ? "Unmute" : "Mute"}</button>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.box_header}>
            <div onClick={() => setBoxCurrentTab("users")}>Users</div>
            <div onClick={() => setBoxCurrentTab("chats")}>Chats</div>
          </div>
          {boxCurrentTab === "users" ? users.map((u) => <div> {u.str} </div>) : "chats"}

          {/* {JSON.stringify(users)} */}
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.url_box}>
          <div>Enter Video Url :</div>
          <div>
            <input value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div>
            <button
              onClick={() => {
                videoStore.setVideoUrl(url);
                if (socket) socket.emit("/set-video", { url });
              }}
            >
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Session;
