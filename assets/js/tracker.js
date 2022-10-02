const MIN_BUFFER_SIZE = 3;
const WAIT_MS = 1000;
const DEBOUNCE_MS = 250;

class TrackItem {
  constructor(event, tags) {
    this.event = event;
    this.tags = tags || [];
    this.url = window.location.href;
    this.ts = new Date();
  }
}

class Buffer {
  constructor() {}

  read() {
    return JSON.parse(window.localStorage.getItem('buffer') || '[]');
  }

  save(buffer) {
    window.localStorage.setItem('buffer', JSON.stringify(buffer));
  }

  add(event, tags) {
    const item = new TrackItem(event, tags);
    const result = this.read();
    result.push(item);

    this.save(result);
  }

  remove(length) {
    const result = this.read();
    result.splice(0, length);

    this.save(result);
  }
}

class Debounce {
  constructor(enabled = true) {
    this.timeoutId = null;
    this.enabled = enabled;
  }

  exec(call) {
    if (this.enabled) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(async () => {
        await call();
      }, DEBOUNCE_MS);
    } else {
      (async () => {
        await call();
      })();
    }
  }
}

class Tracker {
  constructor() {
    this.buffer = new Buffer();
    this.lastSendMs = null;
    this.isInProgress = false;
    this.debounce = new Debounce(true);
  }

  track(event, ...tags) {
    this.buffer.add(event, tags);
    this.debounce.exec(async () => {
      await this.validate();
    });
  }

  async validate() {
    const buffer = this.buffer.read();
    const currentMs = new Date().getTime();

    if (buffer.length === 0) {
      return;
    }

    const passedBySize = buffer.length >= MIN_BUFFER_SIZE;
    const passedByTime =
      !this.lastSendMs || currentMs - this.lastSendMs >= WAIT_MS;

    if (!this.isInProgress && (passedBySize || passedByTime)) {
      await this.send();

      return;
    }

    const waitTime =
      WAIT_MS - (this.isInProgress ? 0 : currentMs - this.lastSendMs);

    setTimeout(async () => {
      if (this.isInProgress) {
        await this.validate();
      } else {
        await this.send();
      }
    }, waitTime);
  }

  async send() {
    this.lastSendMs = new Date().getTime();
    const buffer = this.buffer.read();
    const length = buffer.length;

    if (length === 0) {
      return;
    }

    const post = () =>
      new Promise((resolve) => {
        this.isInProgress = true;

        try {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'http://localhost:8001/track');

          xhr.setRequestHeader('Accept', 'application/x-www-form-urlencoded');
          xhr.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded',
          );

          xhr.onload = () => {
            this.isInProgress = false;
            resolve(xhr.status === 200);
          };

          xhr.send(`buffer=${encodeURIComponent(JSON.stringify(buffer))}`);
        } catch (e) {
          this.isInProgress = false;
          resolve(false);
        }
      });
    const result = await post();

    if (result) {
      this.buffer.remove(length);
    }
  }
}

window.tracker = new Tracker();
