import React, { FunctionComponent, useEffect, useState, useRef, KeyboardEvent } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import ReactPlayer from "react-player";
import { observer } from "mobx-react-lite";
// MUI Icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Button, IconButton, TextField } from "@mui/material";

import styles from "./styles.module.scss";
import { connectToSocket } from "api/socket";
import { VideoInfos } from "mobx/videoStore";
import Chats, { Chat } from "./components/Chats";

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
  const [boxCurrentTab, setBoxCurrentTab] = useState<"users" | "chats">("users");
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [chat, setChat] = useState("");
  const [chatsList, setChatsList] = useState<Chat[]>([]);
  const [roomType, setRoomType] = useState("");

  const playerRef = useRef<ReactPlayer | null>(null);

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: any) => {
    setSeeking(false);
    const fraction = parseFloat(e.target.value);
    videoStore.setVideoPlayed(fraction);
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

  // const handleSliderChange = (event: Event, newValue: number | number[]) => {
  //   videoStore.setVideoPlayed((newValue as number / 100) * duration);
  //   setPlayedSecs((newValue as number  / 100) * duration);
  //   playerRef.current?.seekTo((newValue as number  / 100) * duration);

  //   socket.emit("/req", {
  //     playing: false,
  //     played: (newValue as number  / 100) * duration,
  //   });

  //   videoStore.setVideoState(false);
  // };

  const handleSetUserReady = (ready: boolean) => {
    if (socket) {
      socket.emit("/status", { status: ready ? "ready" : "unready" });
      videoStore.setPlayerIsReady(ready);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
    if (!e || (e && e.key === "Enter" && !e.shiftKey)) {
      console.log(chat);

      socket.emit("/chat", { chat });
      setChat("");
    }
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
        // setUsers((prev) => [...prev, { str: data }]);
      });

      socket.on("/join-user", (data) => {
        // setUsers((prev) => [...prev, { str: data }]);

        socket.emit("/req", {
          playing: videoStore.playing,
          played: videoStore.played,
        });
      });

      socket.on("/get-video", (data) => {
        videoStore.setVideoUrl(data.url);
        setUrl(data.url);
      });

      socket.on("/users", (data) => {
        setUsers(data);
        //  get users last update list
      });

      socket.on("/chats", (data) => {
        setChatsList(data);
      });

      socket.on("/room" , (data)=> {
        setRoomType(data.type);
      })

      // send video url to server when selecting a video from list to watching it in sync
      if (videoStore.url) {
        socket.emit("/set-video", { url });
      }
    }

    return ()=>{
      socket.disconnect();
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

  useEffect(() => {
    const isBuffering = videoStore.playerCurrentState === "buffering";
    const internalVideoPlayer = playerRef.current?.getInternalPlayer();

    if (isPlayerReady && internalVideoPlayer && !isBuffering) {
      playerRef.current?.seekTo(videoStore.played);
      // videoStore.setPlayerIsReady(false);
      setIsPlayerReady(false);
    }
  });

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
              if (!videoStore.playing) {
                const test: any = playerRef.current;
                console.log(test?.player.handlePause);
              }
              videoStore.setVideoState(true);
              videoStore.setPlayerCurrentState("playing");
              // if (socket) socket.emit("/status", { status: "playing" });
            }}
            onPause={() => {
              videoStore.setVideoState(false);
              videoStore.setPlayerCurrentState("paused");
              // if (socket) socket.emit("/status", { status: "paused" });
            }}
            // onSeek={(time: number) => {
            //   console.log(time);
            // }}
            onBuffer={() => {
              videoStore.setPlayerCurrentState("buffering");
              // if (socket) socket.emit("/status", { status: "buffering" });
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
            onReady={(p) => {
              setIsPlayerReady(true);
            }}
            config={{
              youtube: {
                playerVars: { showinfo: 1 },
              },
            }}
          />

          <div className={styles.custom_controls}>
            <IconButton
              className={styles.control_btn}
              onClick={() => {
                handlePlayPause(!videoStore.playing);
              }}
            >
              {videoStore.playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
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
            {/* <Slider
              style={{ margin: "0 16px" }}
              value={(videoStore.played / duration) * 100}
              onChange={handleSliderChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
            /> */}
            {/* <button onClick={handleSkipBackward}>Skip Backward</button>
            <button onClick={handleSkipForward}>Skip Forward</button> */}
            <IconButton className={styles.mute_btn} onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </div>

          {!videoStore.url && (
            <div className={styles.no_video}>
              <span>No Video To Display</span>
            </div>
          )}
        </div>
        <div className={styles.box}>
          <div className={styles.box__content}>
            <div className={styles.box_header}>
              <Button className={styles.tab_button} onClick={() => setBoxCurrentTab("users")}>
                Users
              </Button>
              <Button className={styles.tab_button} onClick={() => setBoxCurrentTab("chats")}>
                Chats
              </Button>
            </div>

            {boxCurrentTab === "users" ? (
              <div className={styles.users_list}>
                {users.map((u) => (
                  <div className={styles.user}>
                    <span className={styles.user__name}> {u.name} :</span> 
                    <span data-ready={u.status === "ready"} className={styles.user__status}>({u.status.toUpperCase()})</span>
                  </div>
                ))}
              </div>
            ) : (
              <Chats chats={chatsList} />
            )}
          </div>
          {boxCurrentTab === "chats" && (
            <div className={styles.box__chat_input}>
              <TextField
                style={{ margin: "8px 0", width: "100%", backgroundColor: "#fff" }}
                id="outlined-basic"
                label="Type something..."
                variant="filled"
                value={chat}
                onChange={(e) => setChat(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.details}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className={styles.url_box}>
            <div className={styles.url_box__title}>Enter Video Url :</div>
            <div className={styles.url_box__input}>
              <TextField
                style={{ margin: "8px 0", width: 400 }}
                id="outlined-basic"
                label="URL"
                variant="outlined"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div>
              <Button
                onClick={() => {
                  videoStore.setVideoUrl(url);
                  if (socket) {
                    socket.emit("/set-video", { url });
                    videoStore.setVideoPlayed(0);
                    videoStore.setVideoState(false);
                    videoStore.setPlayerIsReady(false);
                  }
                }}
                color="success"
                className={styles.url_box__submit}
              >
                submit
              </Button>
            </div>
          </div>

          <div className={styles.get_ready_box}>
            <Button
              color="inherit"
              variant="contained"
              className={styles.get_ready_box__btn}
              onClick={() => handleSetUserReady(!videoStore.isReady)}
            >
              {videoStore.isReady ? "unready" : "ready"}
            </Button>
          </div>
        </div>

        <div className={styles.invite_link_box}>
          <div className={styles.invite_link_box__title}>
            <span>Share Invite Link:</span>
          </div>
          <div className={styles.invite_link_box__input}>
            <TextField
              style={{ margin: "8px 0", width: 450 }}
              id="outlined-basic"
              label="Invite Link  "
              variant="outlined"
              value={`https://syncstream.io/session/${id}`}
            />
          </div>
          <div className={styles.invite_link_box__room_type}>
            <span>
              {roomType.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Session;
