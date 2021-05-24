import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  constructor() { }

  private textDataUpdated = new Subject<string>();
  private colorDataUpdated = new Subject<{r: number, g: number, b: number}>();
  private soundDataUpdated = new Subject<{current: number, highest: number}>();
  private tempDataUpdated = new Subject();

  private socket;
  setupSocketConnection() {
    this.socket = io(BACKEND_URL);
    this.socket.on('message', text => {
      this.textDataUpdated.next(text);
    });
    this.socket.on('colorRGB', color => {
      this.colorDataUpdated.next(color);
    });
    this.socket.on('soundLoudness', sound => {
      this.soundDataUpdated.next(sound);
    });
    this.socket.on('currentTemp', temp => {
      this.tempDataUpdated.next(temp);
    })
  }

  getSocketTextListener() {
    return this.textDataUpdated.asObservable();
  }
  getSocketRGBListener() {
    return this.colorDataUpdated.asObservable();
  }
  getSocketSoundListener() {
    return this.soundDataUpdated.asObservable();
  }
  getSocketTempListener() {
    return this.tempDataUpdated.asObservable();
  }
}
