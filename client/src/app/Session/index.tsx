import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import ReactPlayer from "react-player";

import { observer } from "mobx-react-lite";

import styles from "./styles.module.scss";
import { connectToSocket } from "api/socket";
import { VideoInfos } from "mobx/videoStrore";

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

const Session: FunctionComponent<SessionProps> = observer(({ videoStore }) => {
  const { id } = useParams();
  const [url, setUrl] = useState(videoStore.url);
  const [seeking, setSeeking] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(true);

  const playerRef = useRef<ReactPlayer | null>(null);

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: any) => {
    setSeeking(false);
    const fraction = parseFloat(e.target.value);
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

    socket.emit("/req", {
      playing: false,
      played: fraction,
    });

    videoStore.setVideoState(false);
  };

  // const handleSkipForward = () => {
  //   const currentTime = playerRef.current?.getCurrentTime() || 0;
  //   playerRef.current?.seekTo(currentTime + 10); // Skip forward by 10 seconds

  //   socket.emit("/req", {
  //     playing: false,
  //     played: currentTime + 10,
  //   });
  // };

  // const handleSkipBackward = () => {
  //   const currentTime = playerRef.current?.getCurrentTime() || 0;
  //   playerRef.current?.seekTo(currentTime - 10);

  //   socket.emit("/req", {
  //     playing: false,
  //     played: currentTime - 10,
  //   });
  // };

  useEffect(() => {
    if (id) {
      socket = connectToSocket(id);

      socket.on("connect", () => {
        console.log("connected successfully to socket");
      });

      socket.on("/sync", (data) => {
        // TODO: set coming data about video (seeker time, playing status)
        if (data.playing !== undefined) {
          console.log("hey playing", data.playing);

          videoStore.setVideoState(data.playing);
        }
        if (data.played !== undefined) {
          videoStore.setVideoPlayed(data.played);
          playerRef.current?.seekTo(data.played);
        }
      });

      socket.on("/user", (data) => {
        console.log(data);
        setUsers((prev) => [...prev, { str: data }]);
      });

      socket.on("/get-video", (data) => {
        videoStore.setVideoUrl(data.url);
        setUrl(data.url)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.emit("/req", {
      playing: videoStore.playing,
      played: videoStore.played,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoStore.playing]);

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
              videoStore.setVideoState(true);
              // if (socket) socket.emit("/req", { playing: true });
            }}
            onPause={() => {
              videoStore.setVideoState(false);
              // if (socket) socket.emit("/req", { playing: false });
            }}
            onSeek={(time: number) => {
              console.log(time);
            }}
            playing={videoStore.playing}
            onProgress={(progress) => {
              if (!seeking) {
                videoStore.setVideoPlayed(progress.played);
              }
            }}
            playsinline
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
          {users.map((u) => (
            <div> {u.str} </div>
          ))}
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
