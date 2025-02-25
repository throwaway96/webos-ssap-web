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

const defaultAppManifest = {"manifestVersion":1,"appVersion":"1.1","signed":{"created":"20140509","appId":"com.lge.test","vendorId":"com.lge","localizedAppNames":{"":"LG Remote App","ko-KR":"\ub9ac\ubaa8\ucee8 \uc571","zxx-XX":"\u041b\u0413 R\u044d\u043cot\u044d A\u041f\u041f"},"localizedVendorNames":{"":"LG Electronics"},"permissions":["TEST_SECURE","CONTROL_INPUT_TEXT","CONTROL_MOUSE_AND_KEYBOARD","READ_INSTALLED_APPS","READ_LGE_SDX","READ_NOTIFICATIONS","SEARCH","WRITE_SETTINGS","WRITE_NOTIFICATION_ALERT","CONTROL_POWER","READ_CURRENT_CHANNEL","READ_RUNNING_APPS","READ_UPDATE_INFO","UPDATE_FROM_REMOTE_APP","READ_LGE_TV_INPUT_EVENTS","READ_TV_CURRENT_TIME"],"serial":"2f930e2d2cfe083771f68e4fe7bb07"},"permissions":["LAUNCH","LAUNCH_WEBAPP","APP_TO_APP","CLOSE","TEST_OPEN","TEST_PROTECTED","CONTROL_AUDIO","CONTROL_DISPLAY","CONTROL_INPUT_JOYSTICK","CONTROL_INPUT_MEDIA_RECORDING","CONTROL_INPUT_MEDIA_PLAYBACK","CONTROL_INPUT_TV","CONTROL_POWER","READ_APP_STATUS","READ_CURRENT_CHANNEL","READ_INPUT_DEVICE_LIST","READ_NETWORK_STATE","READ_RUNNING_APPS","READ_TV_CHANNEL_LIST","WRITE_NOTIFICATION_TOAST","READ_POWER_STATE","READ_COUNTRY_INFO","READ_SETTINGS","CONTROL_TV_SCREEN","CONTROL_TV_STANBY","CONTROL_FAVORITE_GROUP","CONTROL_USER_INFO","CHECK_BLUETOOTH_DEVICE","CONTROL_BLUETOOTH","CONTROL_TIMER_INFO","STB_INTERNAL_CONNECTION","CONTROL_RECORDING","READ_RECORDING_STATE","WRITE_RECORDING_LIST","READ_RECORDING_LIST","READ_RECORDING_SCHEDULE","WRITE_RECORDING_SCHEDULE","READ_STORAGE_DEVICE_LIST","READ_TV_PROGRAM_INFO","CONTROL_BOX_CHANNEL","READ_TV_ACR_AUTH_TOKEN","READ_TV_CONTENT_STATE","READ_TV_CURRENT_TIME","ADD_LAUNCHER_CHANNEL","SET_CHANNEL_SKIP","RELEASE_CHANNEL_SKIP","CONTROL_CHANNEL_BLOCK","DELETE_SELECT_CHANNEL","CONTROL_CHANNEL_GROUP","SCAN_TV_CHANNELS","CONTROL_TV_POWER","CONTROL_WOL"],"signatures":[{"signatureVersion":1,"signature":"eyJhbGdvcml0aG0iOiJSU0EtU0hBMjU2Iiwia2V5SWQiOiJ0ZXN0LXNpZ25pbmctY2VydCIsInNpZ25hdHVyZVZlcnNpb24iOjF9.hrVRgjCwXVvE2OOSpDZ58hR+59aFNwYDyjQgKk3auukd7pcegmE2CzPCa0bJ0ZsRAcKkCTJrWo5iDzNhMBWRyaMOv5zWSrthlf7G128qvIlpMT0YNY+n/FaOHE73uLrS/g7swl3/qH/BGFG2Hu4RlL48eb3lLKqTt2xKHdCs6Cd4RMfJPYnzgvI4BNrFUKsjkcu+WD4OO2A27Pq1n50cMchmcaXadJhGrOqH5YmHdOCj5NSHzJYrsW0HPlpuAx/ECMeIZYDh6RMqaFM2DXzdKX9NmmyqzJ3o/0lkk/N97gfVRLW5hA29yeAwaCViZNCP8iC9aO0q9fQojoa7NQnAtw=="}]};

class SSAPClient {
  constructor(target, key, useTLS = false) {
    this.target = target;
    this.key = key;
    this.useTLS = useTLS;
    this.pendingRequests = new Map();
  }

  close() {
    this.conn.close();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.conn = new ProxyWebSocket(this.useTLS ? `wss://${this.target}:3001` : `ws://${this.target}:3000`);
      this.conn.onopen = () => resolve();
      this.conn.onclose = () => reject(new Error('Connection closed'));
      this.conn.onerror = (err) => reject(new Error('Connection error'));
      this.conn.onmessage = (evt) => this.handleMessage(evt.data);
    });
  }

  handleMessage(msg) {
    const m = JSON.parse(msg);
    if (this.pendingRequests.has(m.id)) {
      const {resolve, reject, type} = this.pendingRequests.get(m.id);
      if (type === 'register' && m.type !== 'registered') {
        console.info('register confirmation...');
      } else {
        this.pendingRequests.delete(m.id);
        resolve(m);
      }
    } else {
      console.warn('Unexpected message', m);
    }
  }

  request(msg) {
    return new Promise((resolve, reject) => {
      const p = {
        type: 'request',
        id: this.genid(),
        payload: {},
        ...msg,
      };
      this.pendingRequests.set(p.id, {resolve, reject, type: p.type});
      this.conn.send(JSON.stringify(p));
    });
  }

  genid() {
    return String(Math.floor(Math.random() * 10000000));
  }

  async register(appManifest = defaultAppManifest) {
    const result = await this.request({
      "type": "register",
      "payload": {
        "forcePairing": false,
        "pairingType": "PROMPT",
        "manifest": appManifest,
        "client-key": this.key,
      },
    });
    return result.payload['client-key'];
  }
}
