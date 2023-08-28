import { FunctionComponent, useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { observer } from "mobx-react-lite";

import styles from "./styles.module.scss";
import VideoCard from "./VideoCard";
import { getYouTubeSearchResult } from "api/youtube";
import { VideoInfos } from "mobx/videoStore";
import { useDebounce } from "hooks/useDebounce";

interface YouTubeProps {
  videoStore: VideoInfos;
}
interface YouTubeItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: { [key: string]: any };
}

const getVideoLink = (id: string): string => {
  const base_url = "https://www.youtube.com/watch?v=";
  return base_url + id;
};

const YouTube: FunctionComponent<YouTubeProps> = observer(({ videoStore }) => {
  const [searchedText, setSearchedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videosList, setVideosList] = useState<YouTubeItem[]>([]);
  const dv = useDebounce(searchedText, 500);

  const handleGetYouTubeVideos = async () => {
    setIsLoading(true);
    try {
      const res = await getYouTubeSearchResult(searchedText);
      setVideosList(res.data.items);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchedText) {
      handleGetYouTubeVideos();
      return;
    }
    setVideosList([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dv]);

  return (
    <div className={styles.youtube}>
      <div className={styles.youtube__search_box}>
        <TextField
          style={{ margin: 16, width: 300 }}
          id="outlined-basic"
          label="Search Your Youtube video"
          variant="outlined"
          value={searchedText}
          onChange={(e) => setSearchedText(e.target.value)}
        />
      </div>

      <div className={styles.youtube__list}>
        {isLoading && (
          <div className={styles.loading_box}>
            {" "}
            <CircularProgress />{" "}
          </div>
        )}
        {videosList.map((v) => {
          return (
            <VideoCard
              id={v.id.videoId}
              thumbnail={v.snippet.thumbnails.medium.url}
              title={v.snippet.title}
              setVideoUrl={() => videoStore.setVideoUrl(getVideoLink(v.id.videoId))}
            />
          );
        })}
        {!videosList.length && !isLoading && (
          <div className={styles.no_data}> There is no video to display! Search Something.</div>
        )}
      </div>
    </div>
  );
});

export default YouTube;
