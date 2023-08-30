import { makeObservable, observable, action } from "mobx";

export type PlayerState = "paused" | "buffering" | "playing" | "ready"
//  https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4
export class VideoInfos {
  url: string = "";
  playing: boolean = false;
  played: number = 0;
  loaded: number = 0;
  isReady: boolean = false;
  currentTime : number = 0;
  playerCurrentState : PlayerState  = "paused";

  constructor() {
    makeObservable(this, {
      url: observable,
      playing: observable,
      played: observable,
      loaded: observable,
      isReady: observable,
      playerCurrentState : observable,
      setVideoUrl: action,
      setVideoState: action,
      setVideoPlayed: action,
      setPlayerCurrentState : action
    });
  }

  setVideoUrl(url: string) {
    console.log(url , "url");
    
    this.url = url;
  }

  setVideoState(playing: boolean) {
    this.playing = playing;
  }

  setVideoPlayed(played: number) {
    this.played = played;
  }

  setPlayerCurrentState (state : PlayerState){
    this.playerCurrentState = state;
  }

  setPlayerIsReady (isReady : boolean , currentTime : number = 0) {
    this.isReady = isReady;
    this.currentTime = currentTime
  }
}

export const VideoInfosStore = new VideoInfos();
