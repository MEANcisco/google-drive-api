import { Injectable, EventEmitter } from "@angular/core";
import { Observable, of } from "rxjs";
import { AppRepository } from './repository.service';

const CLIENT_ID =
  "81838757196-k27ooqhtctsqlctlj0h2tp3l8patpbhh.apps.googleusercontent.com";
const API_KEY = "AIzaSyDUej4TFbemSbvvMbsqTg9yH8N2VtW_I4k";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];
const SCOPES = "https://www.googleapis.com/auth/drive";

@Injectable()
export class GapiSession {
  googleAuth: gapi.auth2.GoogleAuth;
  constructor(private appRepository: AppRepository) {}

  initClient(): Observable<any> {
    return of(
      gapi.load("client:auth2", () => {
        return of(
          gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
          })
        ).subscribe(_ => {
          this.googleAuth = gapi.auth2.getAuthInstance();
        });
      })
    );
  }

  signIn(): Observable<any> {
    return of(
      this.googleAuth.signIn({
        prompt: "consent"
      })
    ).subscribe((googleUser: gapi.auth2.GoogleUser) => {
      this.appRepository.User.add(googleUser.getBasicProfile());
    });
  }
}
