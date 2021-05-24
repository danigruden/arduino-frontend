import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment} from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class MicrocontrollerService {
  constructor(private http: HttpClient, public router: Router) {}

  setNewColor(red: number, green: number, blue: number){
    const newDigitData = {redBrightness: red, greenBrightness: green, blueBrightness: blue};
    return this.http.post<{ message:string, colorRGB: Array<{ r: number, g: number, b: number }> }>(BACKEND_URL + "/api/ledrgb", newDigitData);
  }

  setNewDisplayText(newText: string){
    const newDisplayText = {text: newText};
    return this.http.post<{message: string, newDisplayedText: string}>(BACKEND_URL + "/api/display", newDisplayText);
  }
}
