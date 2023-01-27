// const AC = new (window.AudioContext || window.webkitAudioContext)();
let currentPlayPosition = 0;
const fudge = 0.3;
let play = 0;
let started = false;

//audio is the html audio component that
//has been loaded
class AudioContextPlus {
  //we really only want to
  //instantiate this thing once
  //and then update which audio source
  //is connected/which file is playing

  audioHTML;
  AC; //AudioContext
  AA; //analyser
  lastNonZeroData = null;
  initialized = false;
  AudioSource = null;
  canVisualize = false;
  play = false;
  audioBuffers = {};
  sources = [];

  constructor() {
    this.init();
  }

  init() {
    this.AC = new AudioContext();
    this.AA = this.AC.createAnalyser();
    this.AA.fftSize = 2048;

    if (this.AC) this.initialized = true;
  }

  changeAudio(audioHTML) {
    if (!this.initialized) {
      this.init();
    }

    //we can only createMediaElementSource once but we need an audio
    //element, so wait for just the first time
    if (!this.AudioSource && this.canVisualize)
      this.AudioSource = this.AC.createMediaElementSource(audioHTML);
    //once we connect an audio element to createMediaElementSource
    //it is stuck there forever, good news is that we can
    //create a different audio element to deal with it
    //console.log('xxxxxxxxxxxx',this.AudioSource)

    if (this.canVisualize) {
      console.log(" connecting new audio ", audioHTML);
      this.AudioSource.connect(this.AA);
      this.AA.connect(this.AC.destination);
    } else {
      //disconnecting/deleting does not prevent
      //the AudioSource from getting Cors error once it
      //has already been connected once to analyzer
    }
  }

  getTimeDomainData() {
    if (this.AA && this.initialized) {
      let dataArray = new Uint8Array(this.AA.fftSize);
      this.AA.getByteTimeDomainData(dataArray);
      return dataArray;
    }
    return null;
  }

  getFrequencyData() {
    if (this.AA && this.initialized) {
      let dataArray = new Uint8Array(this.AA.fftSize);
      this.AA.getByteFrequencyData(dataArray);
      return dataArray;
    }
    return null;
  }
  //would it be worth it to get Float32 data?

  saveGoodData(nonZeroData) {
    this.lastNonZeroData = [...nonZeroData];
    //console.log('zzzzzzzz',this.lastNonZeroData[10])
  }

  setCanVisualize(input) {
    this.canVisualize = input;
  }

  async createAudioBuffers(data, audio, fileId) {
    //atob is base64 string to binary
    //formData PUT with an audio file runs btoa at some point
    const raw = window.atob(data);

    const ab = new ArrayBuffer(raw.length);
    //ab is the backing store for binaryData

    const binaryData = new Uint8Array(ab);
    for (let i = 0; i < raw.length; i++) {
      binaryData[i] = raw.charCodeAt(i);
    }
    const blob = new Blob([binaryData], { type: "audio/mpeg" });

    //we do not need the blob and regular audio elements if we
    //are sending the binary array buffers straight to audio context
    //this is just for playing around
    const audioURL = window.URL.createObjectURL(blob);
    audio.src = audioURL;

    //here is the AudioContext way of doing things with sound...
    const source = this.AC.createBufferSource();

    //wait for both with Promises.all at some point
    const xxx = await this.AC.decodeAudioData(ab);

    source.buffer = xxx;
    source.connect(this.AC.destination);

    // save them so we can use them later on button click
    this.audioBuffers[fileId] = source;
  }

  playSound(source, time, fudge) {
    //connect to gainNodes to control relative volume
    source.connect(this.AC.destination);
    source.start(time, Math.max(currentPlayPosition + fudge, 0));
  }

  async play2(fileId1, fileId2) {
    if (play === 1) {
      play = 0;
      await this.AC.suspend();
      return;
    }

    // controls all specified songs at once
    this.AC.resume();

    play = 1;

    if (!started) {
      const startTime = this.AC.currentTime + 0.5;

      this.sources.length = 0; //reset the array
      const src1 = this.AC.createBufferSource();
      console.log("fileId1 typeof: ", typeof fileId1);
      console.log("fileId2 typeof: ", typeof fileId2);

      console.log("fileId1 : ", fileId1);
      console.log("fileId2 : ", fileId2);
      console.log(this.audioBuffers);
      console.log(this.audioBuffers[fileId1]);
      console.log(this.audioBuffers[fileId2]);
      src1.buffer = this.audioBuffers[fileId1];
      const src2 = this.AC.createBufferSource();
      src2.buffer = this.audioBuffers[fileId2];
      this.sources.push(src1, src2);

      this.playSound(src1, startTime, 0);
      this.playSound(src2, startTime, fudge);

      started = true;
    }
  }
}

export default AudioContextPlus;
