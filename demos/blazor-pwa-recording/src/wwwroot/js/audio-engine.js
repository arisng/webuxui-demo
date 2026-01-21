class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.chunks = [];
  }

  async start() {
    this.startTime = Date.now();
    const mimeTypes = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/wav'];
    let selectedMimeType = null;
    for (let type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        selectedMimeType = type;
        break;
      }
    }
    if (!selectedMimeType) {
      throw new Error('No supported MIME type found');
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType });
    this.chunks = [];
    this.mediaRecorder.ondataavailable = (event) => {
      this.chunks.push(event.data);
    };
    this.mediaRecorder.start();
  }

  stop() {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.mediaRecorder.mimeType });
        resolve(blob);
      };
      this.mediaRecorder.stop();
    });
  }
}

class AudioStore {
  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open('AudioStore', 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('Recordings')) {
          db.createObjectStore('Recordings', { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });

    if ('storage' in navigator && 'persist' in navigator.storage) {
      navigator.storage.persist();
    }
  }

  async save(blob, duration) {
    const db = await this.dbPromise;
    const tx = db.transaction('Recordings', 'readwrite');
    const store = tx.objectStore('Recordings');
    const id = Date.now();
    return new Promise((resolve, reject) => {
      const request = store.add({ id, blob, duration, timestamp: new Date() });
      request.onsuccess = () => resolve(id);
      request.onerror = reject;
    });
  }

  async getAll() {
    const db = await this.dbPromise;
    const tx = db.transaction('Recordings', 'readonly');
    const store = tx.objectStore('Recordings');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = reject;
    });
  }

  async delete(id) {
    const db = await this.dbPromise;
    const tx = db.transaction('Recordings', 'readwrite');
    const store = tx.objectStore('Recordings');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = resolve;
      request.onerror = reject;
    });
  }

  async get(id) {
    const db = await this.dbPromise;
    const tx = db.transaction('Recordings', 'readonly');
    const store = tx.objectStore('Recordings');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = reject;
    });
  }
}

const audioStore = new AudioStore();
let currentAudio = null;
let currentPlayingId = null;

const recorder = new AudioRecorder();

function play(id, dotnetRef) {
  if (currentPlayingId === id && currentAudio) {
    if (currentAudio.paused) {
      currentAudio.play();
    } else {
      currentAudio.pause();
    }
    return;
  }
  if (currentAudio) {
    currentAudio.pause();
    URL.revokeObjectURL(currentAudio.src);
    currentAudio = null;
  }
  audioStore.get(id).then(recording => {
    if (recording) {
      const url = URL.createObjectURL(recording.blob);
      currentAudio = new Audio(url);
      currentAudio.addEventListener('ended', () => {
        currentPlayingId = null;
        if (currentAudio) {
          URL.revokeObjectURL(currentAudio.src);
          currentAudio = null;
        }
        dotnetRef.invokeMethodAsync('OnPlaybackEnded');
      });
      currentAudio.addEventListener('timeupdate', () => {
        if (dotnetRef) {
          dotnetRef.invokeMethodAsync('OnTimeUpdate', id.toString(), currentAudio.currentTime * 1000);
        }
      });
      currentAudio.play();
      currentPlayingId = id;
    }
  });
}

function stopPlayback() {
  if (currentAudio) {
    currentAudio.pause();
    URL.revokeObjectURL(currentAudio.src);
    currentAudio = null;
    currentPlayingId = null;
  }
}

window.AudioApp = {
  startRecording: () => recorder.start(),
  stopRecording: async () => {
    const blob = await recorder.stop();
    const duration = Date.now() - recorder.startTime;
    const id = await audioStore.save(blob, duration);
    return { id: id.toString(), dateTime: new Date().toISOString(), durationMs: duration, isPlaying: false, progress: 0 };
  },
  getRecordings: async () => {
    const recordings = await audioStore.getAll();
    return recordings.map(r => ({ id: r.id.toString(), dateTime: r.timestamp, durationMs: r.duration, isPlaying: false, progress: 0 }));
  },
  deleteRecording: (id) => audioStore.delete(parseInt(id)),
  playRecording: (id, dotnetRef) => play(parseInt(id), dotnetRef),
  stopPlayback: () => stopPlayback()
};