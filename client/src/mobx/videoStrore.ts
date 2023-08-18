import { makeObservable, observable, action } from "mobx";

export class VideoInfos {
  url: string = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4";
  playing: boolean = false;
  played: number = 0;
  loaded: number = 0;
  isReady: boolean = false;

  constructor() {
    makeObservable(this, {
      url: observable,
      playing: observable,
      played: observable,
      loaded: observable,
      isReady: observable,
      setVideoUrl: action,
      setVideoState: action,
      setVideoPlayed: action
    });
  }

  setVideoUrl(url: string) {
    this.url = url;
  }

  setVideoState(playing: boolean) {
    this.playing = playing;
  }

  setVideoPlayed(played: number) {
    this.played = played;
  }
}

export const VideoInfosStore = new VideoInfos();
