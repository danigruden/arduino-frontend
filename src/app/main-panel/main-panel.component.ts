import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketioService } from '../socketio.service';
import { MicrocontrollerService } from './microcontroller.service';
import Speech from 'speak-tts';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css'],
})
export class MainPanelComponent implements OnInit, OnDestroy {
  constructor(
    private mcService: MicrocontrollerService,
    private socketService: SocketioService
  ) {}

  speech: any;

  public state = 'rgb(0,0,0)';
  public colorrgba: string = 'rgb(255,255,255)';
  public displayedText: string = '';
  public soundData;
  public soundLoudest = 0;
  public tempData;

  private socketTextSub = new Subscription();
  private socketRGBSub = new Subscription();
  private socketSoundSub = new Subscription();
  private socketTempSub = new Subscription();

  $player: HTMLAudioElement;

  ngOnInit(): void {
    this.setupSocketSubs();
    this.setupTTS();
  }

  colorChangeComplete(newColor: any) {
    console.log(newColor);
    this.mcService
      .setNewColor(
        newColor.color.rgb.r,
        newColor.color.rgb.g,
        newColor.color.rgb.b
      )
      .subscribe((response) => {});
  }

  onSetNewDisplayText(text: string) {
    this.mcService.setNewDisplayText(text).subscribe((response) => {
    });
  }

  playSpeechAudio(ttsData: string) {
    this.speech
      .speak({
        text: ttsData,
      })
      .then(() => {
        console.log('TTS successful!');
      })
      .catch((e) => {
        console.error('An error occurred :', e);
      });
  }

  setupTTS() {
    this.speech = new Speech(); // will throw an exception if not browser supported
    if (this.speech.hasBrowserSupport()) {
      // returns a boolean
      console.log('speech synthesis supported');
      this.speech
        .init({
          volume: 1,
          lang: 'en-US',
          rate: 1,
          pitch: 1,
          voice: 'Microsoft David Desktop - English (United States)',
          splitSentences: true,
        })
        .catch((e) => {
          console.error('An error occured while initializing : ', e);
        });
    }
  }

  setupSocketSubs() {
    this.socketService.setupSocketConnection();

    this.socketTextSub = this.socketService
      .getSocketTextListener()
      .subscribe((data) => {
        this.displayedText = data;
        this.playSpeechAudio(data);
      });

    this.socketRGBSub = this.socketService
      .getSocketRGBListener()
      .subscribe((data) => {
        this.colorrgba = 'rgb(' + data.r + ',' + data.g + ',' + data.b + ')';
      });

    this.socketSoundSub = this.socketService
      .getSocketSoundListener()
      .subscribe((data) => {
        this.soundData = data.current;
        this.soundLoudest = data.highest;
      });

    this.socketTempSub = this.socketService
      .getSocketTempListener()
      .subscribe((data) => {
        this.tempData = data;
      });
  }

  ngOnDestroy() {
    this.socketTextSub.unsubscribe();
    this.socketRGBSub.unsubscribe();
    this.socketSoundSub.unsubscribe();
    this.socketTempSub.unsubscribe();
  }
}
