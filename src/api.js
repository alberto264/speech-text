export class Api {


  initialize(onEvent) {
    this.dispatch = onEvent;
  }

  startContinuousRecognition({ key, region, language }) {
    if (this.recognizer)
      throw new Error('Stop current recognition first');

    const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(key, region);
    speechConfig.speechRecognitionLanguage = language;
    const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    this.recognizer = new window.SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);


    this.recognizer.recognizing = (s, e) => {
      this.dispatch({ type: 'SET_TEXT', text: e.result.text });
    };
    // this.recognizer.recognized = (s, e) => {
    //   this.dispatch({ type: 'SET_TEXT', text: e.result.text });
    // };
    this.recognizer.canceled = () => {
      this.dispatch({ type: 'SET_CAPTURING', capturing: false });
      this.stopContinuousRecognition();
    };

    return new Promise((res, rej) => this.recognizer.startContinuousRecognitionAsync(res, rej));
  }

  stopContinuousRecognition() {
    if (!this.recognizer)
      throw new Error('Start recognition first');

    return new Promise((res, rej) => {
      this.recognizer.stopContinuousRecognitionAsync(() => {
        this.recognizer.close();
        this.recognizer = undefined;
        res(true);
      }, (err) => {
        this.recognizer.close();
        this.recognizer = undefined;
        rej(err);
      });
    });
  }

}