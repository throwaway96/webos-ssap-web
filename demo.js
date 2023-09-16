/*
Copyright 2022-2023 throwaway96 (https://github.com/throwaway96) 

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/* Copyright 2021 Piotr Dobrowolski <informatic at hackerspace dot pl> */

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

function log(msg) {
  const l = document.querySelector('#log');
  l.innerText = '[' + new Date() + '] ' + msg + '\n' + l.innerText;
}

let client = null;
let lastImageUri = null;

let inputSocket = null;
document.addEventListener('keydown', (evt) => {
  const keys = {
    'Enter': 'ENTER',
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT',
    'ArrowUp': 'UP',
    'ArrowDown': 'DOWN',
    'Escape': 'BACK',
    'Home': 'HOME',
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    'Delete': 'EXIT',
    'ContextMenu': 'MENU',
    'e': 'EZ_ADJUST',
    'h': 'MYAPPS',
    'i': 'IN_START',
    'm': 'MUTE',
  };

  if (evt.key in keys) {
    /* XXX: is there a better way to do this? */
    /* stop scrolling */
    if ((evt.key === 'ArrowDown') || (evt.key === 'ArrowUp')) {
      evt.preventDefault();
    }

    sendKey(keys[evt.key]);
  } else {
    console.log("unrecognized key: '" + evt.key + "'");
  }
});

function sendKey(keyName) {
  if (!isInputSocketOpen()) {
    console.log("would send key: " + keyName);
    return;
  }

  console.log("sending key: " + keyName);
  inputSocket.send(Object.entries({type: 'button', name: keyName}).map(([k, v]) => `${k}:${v}`).join('\n') + '\n\n');
}

/* prevent menu key from opening context menu */
document.addEventListener('keyup', (evt) => {
    if (evt.key == 'ContextMenu') {
      evt.preventDefault();
    }
});

const keypadButtons = document.querySelectorAll('button.keypad');
const keypadClickHandler = (evt) => {
  if ((typeof(evt) !== 'object') || !(evt instanceof Event)) {
    console.error('keypadHandler: weird event (evt not Event object): ' + evt);
    return;
  }

  const target = evt.target;

  if ((typeof(target) !== 'object') || !(target instanceof HTMLElement)) {
    console.error('keypadHandler: weird event (evt.target not HTMLElement object): ' + evt);
    return;
  }

  let dataset = target.dataset;

  if (!('key' in dataset)) {
    /* hack for <span>s on remote */
    dataset = target.parentElement.dataset;

    if (!('key' in dataset)) {
      console.error('keypadHandler: key not set: ' + evt);
      return;
    }
  }

  sendKey(dataset.key);
};

for (let button of keypadButtons) {
  button.addEventListener('click', keypadClickHandler);
}

const reqDiv = document.getElementById('request');

/* stop keydown events in request form from bubbling and being sent via ssap */
reqDiv.addEventListener('keydown', (evt) => {
  evt.stopPropagation();
});


const reqList = document.getElementById('reqs');
const reqSend = document.getElementById('req_send');
const reqEndpoint = document.getElementById('req_endpoint');
const reqPayload = document.getElementById('req_payload');
const respStatus = document.getElementById('resp_status');
const respPayload = document.getElementById('resp_payload');

function reqListHandler(evt) {
  let sel = reqList.options[reqList.selectedIndex];
  if (sel.value === 'custom') {
    reqEndpoint.disabled = false;
    reqPayload.disabled = false;
  } else {
    reqEndpoint.disabled = true;
    reqPayload.disabled = true;

    reqEndpoint.value = sel.dataset['endpoint'];
    reqPayload.value = sel.dataset['payload'];
  }
}

reqList.addEventListener('change', reqListHandler);
reqListHandler();

function sendRequest(uri, payload) {
    if (!isSSAPConnected()) {
    console.warn('syncRequest: SSAP not connected');
    return;
  }

  respStatus.value = 'sending...';

  client.request({
    uri: uri,
    payload: payload, 
  }).then((res) => {
    let statusMsg = '???';

    if (res.type === 'error') {
      statusMsg = 'error: ' + res.error;
    } else if (res.type === 'response') {
      statusMsg = 'response';
    }

    respStatus.value = statusMsg;
    respPayload.value = JSON.stringify(res.payload);
  }).catch((error) => {
    throw new Error('sendRequest: error: ' + error);
  });
}

reqSend.addEventListener('click', (evt) => {
  const uri = reqEndpoint.value;
  const payload = JSON.parse(reqPayload.value);

  sendRequest(uri, payload);
});

const ipInput = document.getElementById("ip");
const connectButton = document.getElementById("connect");
const discButton = document.getElementById("disconnect");

/* connect on enter in ip input */
ipInput.addEventListener('keypress', (evt) => {
  if ((typeof(evt) === 'object') && ( evt instanceof KeyboardEvent) && (evt.key === 'Enter')) {
    connectButton.click();
  }
});

/* TODO: move this into SSAPClient */
let ssapConnected = false;

function isSSAPConnected() {
  return (client !== null) && ssapConnected;
}

function onSSAPConnect() {
  log('connected');
  console.log('SSAP connected');

  ssapConnected = true;
  setControlState(true);
}

function onSSAPDisconnect() {
  ssapConnected = false;
  setControlState(false);

  log('disconnected');
  console.log('SSAP disconnected');
}

function setControlState(connected) {
  reqSend.disabled = !connected;
  connectButton.disabled = connected;
  discButton.disabled = !connected;
}

function isInputSocketOpen() {
  return (inputSocket instanceof WebSocket) && (inputSocket.readyState === 1);
}

function onInputSocketOpen() {
  log('input open');
  console.log('input socket opened');
}

function onInputSocketClose() {
  log('input closed');
  console.log('input socket closed');
}

createRemote(document.getElementById('remote'), keypadClickHandler);

discButton.addEventListener('click', async () => {
  if (client === null) {
    console.warn("tried to disconnect while client is null");
    return;
  }

  onSSAPDisconnect();
  client.close();
  client = null;
});

connectButton.addEventListener('click', async () => {
  if (client !== null) {
    console.warn("tried to connect while client is not null");
    return;
  }

  connectButton.disabled = true;

  const target = document.querySelector('#ip').value;

  try {
    client = new SSAPClient(target, window.localStorage['client-key-' + target]);
    log('connecting...');
    await client.connect();
    log('registering...');
    let manifest = defaultAppManifest;

    try {
      manifest = JSON.parse(window.localStorage['ssap-app-manifest']);
      log("using custom manifest");
    } catch (err) {}
    
    window.localStorage['client-key-' + target] = await client.register(manifest);

    onSSAPConnect();

    if (document.querySelector(':focus')) document.querySelector(':focus').blur();

    (async () => {
      const sock = await client.request({
        uri: 'ssap://com.webos.service.networkinput/getPointerInputSocket'
      });

      inputSocket = new WebSocket(sock.payload.socketPath);
      inputSocket.onopen = onInputSocketOpen;
      inputSocket.onerror = (err) => log('input err ' + err.msg);
      inputSocket.onclose = onInputSocketClose;
    })();

    while (true) {
      if (client === null) {
        /* disconnected */
        break;
      }

      const res = await client.request({
        uri: 'ssap://tv/executeOneShot',
        payload: {},
      });

      lastImageUri = res.payload.imageUri;

      const oldb = document.querySelector('.capture .back');
      if (oldb) {
        oldb.remove();
      }

      const oldf = document.querySelector('.capture .front');
      if (oldf) {
        oldf.classList.remove('front');
        oldf.classList.add('back');
      }

      // This is bad. We do some """double-buffering""" of dynamically-generated
      // SVG objects in order to bust Chrome's cache for preview image. `imageUri`
      // here is static for all responses, and doesn't accept any extra query
      // arguments. This hack seems to solve it on Chrome. (Firefox seems to
      // update the <img> if hash-part of an URL changes)
      const newf = document.createElement('object');
      newf.classList.add('front');
      newf.setAttribute('type', 'image/svg+xml');
      newf.setAttribute('data', 'data:image/svg+xml;base64,' + btoa(`<svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg"><image width="1920" height="1080" href="${res.payload.imageUri}#${Date.now()}" /></svg>`)); // res.payload.imageUri + '#' + Date.now());
      document.querySelector('.capture').appendChild(newf);

      await wait(100);
    }
  } catch (err) {
    log('error: ' + err); console.info(err); 
    onSSAPDisconnect();
    client.close();
    client = null;
  }
});

function getLastImageUri() {
  return lastImageUri;
}
