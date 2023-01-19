/* based on lgremote by simon. */

'use strict';

 function createRemote(container, clickHandler) {
  if ((typeof(container) !== 'object') || !(container instanceof HTMLElement)) {
    throw new Error('createRemote: invalid argument: container not an HTMLElement');
  }

  let buttonOffsetX = 5;
  let buttonOffsetY = 7;

  const remote = {
    width: 47,
    height: 169,
    scale: 4,
    color: '#141414',
    borderRadius: 1.5,
    styles: {
      position: 'relative',
      fontFamily: 'Arial'
    },
    buttons: [
      {
        id: 'power',
        key: 'POWER',
        x: 0,
        y: 0,
        width: 7,
        height: 7,
        color: '#EF0E0E',
        borderRadius: 7,
        styles: {
          backgroundImage: 'url("icons/power.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
        innerHTML: '<span style="font-size: 6px;display:inline-block;color:#333;transform:translate(110%,-15%);">&#x280f;</span>'
      },
      {
        id: 'inputs',
        key: 'INPUT_HUB',
        x: 31,
        y: 2,
        width: 5,
        height: 5,
        borderRadius: 5,
        styles: {
          backgroundImage: 'url("icons/inputs.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      },
      {
        id: 'caption',
        key: 'CC',
        x: 0,
        y: 11,
        width: 7,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;transform:scale(0.40,1) translate(-100%,0px);">CAPTION</span>'
      },
      {
        id: 'guide',
        key: 'GUIDE',
        x: 10,
        y: 11,
        width: 7,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;">?</span>'
      },
      {
        id: 'search',
        key: 'SEARCH',
        x: 20,
        y: 11,
        width: 7,
        height: 5,
        styles: {
          backgroundImage: 'url("icons/search.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      },
      {
        id: 'tv',
        key: 'LIVETV',
        x: 30,
        y: 11,
        width: 7,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;">TV</span>'
      },
      {
        id: '1',
        key: '1',
        x: 0,
        y: 19,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;">1</span>'
      },
      {
        id: '2',
        key: '2',
        x: 13.5,
        y: 19,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;">2</span>'
      },
      {
        id: '3',
        key: '3',
        x: 27,
        y: 19,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;">3</span>'
      },
      {
        id: '4',
        key: '4',
        x: 0,
        y: 27,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;">4</span>'
      },
      {
        id: '5',
        key: '5',
        x: 13.5,
        y: 27,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;">5</span>'
      },
      {
        id: '6',
        key: '6',
        x: 27,
        y: 27,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;">6</span>'
      },
      {
        id: '7',
        key: '7',
        x: 0,
        y: 35,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;">7</span>'
      },
      {
        id: '8',
        key: '8',
        x: 13.5,
        y: 35,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;">8</span>'
      },
      {
        id: '9',
        key: '9',
        x: 27,
        y: 35,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;">9</span>'
      },
      {
        id: 'list',
        key: 'LIST',
        x: 0,
        y: 43,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<div style="background-color:#FFF;width:90%;height:15%;margin:auto"></div><span style="font-size: 3px;display:inline-block;color:#FFF;transform:translate(0px,10%);">LIST</span>'
      },
      {
        id: '0',
        key: '0',
        x: 13.5,
        y: 43,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;">0</span>'
      },
      {
        id: 'flashback',
        key: 'FLASHBACK',
        x: 27,
        y: 43,
        width: 10,
        height: 6,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;transform:scale(0.60,1) translate(-45%,0px);">FLASHBK</span>'
      },
      {
        id: 'volumeup',
        key: 'VOLUMEUP',
        x: 0,
        y: 52,
        width: 10,
        height: 9.5,
        styles: {
          textAlign: 'center',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          borderBottom: 'none'
        },
        innerHTML: '<span style="font-size: 6px;display:inline-block;color:#333333;">+</span><span style="font-size: 6px;display:inline-block;color:#333;transform:translate(-150%,-110%);">\u2827</span>'
      },
      {
        id: 'volumedown',
        key: 'VOLUMEDOWN',
        x: 0,
        y: 61.5,
        width: 10,
        height: 9.5,
        styles: {
          textAlign: 'center',
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
          borderTop: 'none',
          zIndex: '2'
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;transform:translate(0px,-50%);">VOL</span><span style="font-size: 4px;display:inline-block;color:#333333;transform:scale(1, 1.2) translate(0px,-10%);">&#8212;</span>'
      },
      {
        id: 'channelup',
        key: 'CHANNELUP',
        x: 27,
        y: 52,
        width: 10,
        height: 9.5,
        styles: {
          textAlign: 'center',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          borderBottom: 'none'
        },
        innerHTML: '<span style="font-size: 6px;display:inline-block;color:#333333;transform:scale(2, 1);">^</span><span style="font-size: 6px;display:inline-block;color:#333;transform:translate(150%,-110%);">\u2809</span>'
      },
      {
        id: 'channeldown',
        key: 'CHANNELDOWN',
        x: 27,
        y: 61.5,
        width: 10,
        height: 9.5,  
        styles: {
          textAlign: 'center',
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
          borderTop: 'none',
          zIndex: '2'
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;transform:translate(0px, -75%)">CH</span><span style="font-size: 2px;display:inline-block;color:#FFF;transform:translate(0px, -100%)">PAGE</span><span style="font-size: 6px;display:inline-block;color:#333333;transform:scale(2, 1) translate(0px, -60%) rotate(180deg);">^</span>'
      },
      {
        id: 'favorites',
        key: 'FAVORITES',
        x: 13.5,
        y: 52,
        width: 10,
        height: 4.5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;transform:translate(0px, -10%)">FAV</span><span style="font-size: 3px;display:inline-block;color:#FFF;white-space:nowrap;transform:scale(0.75, 0.8) translate(-50%, -275%);">QUICK ACCESS</span>'
      },
      {
        id: 'info',
        key: 'INFO',
        x: 13.5,
        y: 59.5,
        width: 10,
        height: 4.5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;white-space:nowrap;transform: scale(0.9, 0.9) translate(-25%, -10%)">\u{1F6C8}INFO</span>'
      },
      {
        id: 'mute',
        key: 'MUTE',
        x: 13.5,
        y: 66.5,
        width: 10,
        height: 4.5,
        styles: {
          backgroundImage: 'url("icons/mute.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      },
      {
        id: 'netflix',
        key: 'NETFLIX',
        x: 0,
        y: 74,
        width: 10,
        height: 5,
        color: '#FFFFFF',
        styles: {
          backgroundImage: 'url("icons/netflix.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      },
      {
        id: 'home',
        key: 'HOME',
        x: 13.5,
        y: 74,
        width: 10,
        height: 5,
        color: '#FFFFFF',
        styles: {
          backgroundImage: 'url("icons/home.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      },
      {
        id: 'amazon',
        key: 'AMAZON',
        x: 27,
        y: 74,
        width: 10,
        height: 5,
        color: '#FFFFFF',
        styles: {
          backgroundImage: 'url("icons/amazon.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      },
      {
        id: 'settings',
        key: 'MENU',
        x: 0,
        y: 82,
        width: 10,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 4px;display:inline-block;color:#FFF;transform:translate(0px, -20%)">\u2699</span>'
      },
      {
        id: 'up',
        key: 'UP',
        x: 13.5,
        y: 82,
        width: 10,
        height: 7,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 5px;display:inline-block;color:#FFF;">\u25B2</span>'
      },
      {
        id: 'livezoom',
        key: 'LIVE_ZOOM',
        x: 27,
        y: 82,
        width: 10,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;transform:scale(0.7, 0.65) translate(-25%, -35%)">LIVE<br>ZOOM</span>'
      },
      {
        id: 'left',
        key: 'LEFT',
        x: 0,
        y: 92,
        width: 10,
        height: 7,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 5px;display:inline-block;color:#FFF;">\u25C4</span>'
      },
      {
        id: 'ok',
        key: 'ENTER',
        x: 14,
        y: 92,
        width: 9,
        height: 7,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;line-height:90%;">\u25C9<br>OK</span>'
      },
      {
        id: 'right',
        key: 'RIGHT',
        x: 27,
        y: 92,
        width: 10,
        height: 7,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 5px;display:inline-block;color:#FFF;">\u25BA</span>'
      },
      {
        id: 'back',
        key: 'BACK',
        x: 0,
        y: 104,
        width: 10,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;transform:scale(0.9, 0.9) translate(-15%, -10%)">BACK</span>'
      },
      {
        id: 'down',
        key: 'DOWN',
        x: 13.5,
        y: 102,
        width: 10,
        height: 7,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 5px;display:inline-block;color:#FFF;">\u25BC</span>'
      },
      {
        id: 'exit',
        key: 'EXIT',
        x: 27,
        y: 104,
        width: 10,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;transform:scale(0.9, 0.9) translate(-10%, -10%)">EXIT</span>'
      },
      {
        id: 'sap',
        key: 'SAP',
        x: 0,
        y: 113,
        width: 10,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;white-space:nowrap;transform:scale(0.9, 0.9) translate(-20%, -10%)">SAP/\u2732</span>'
      },
      {
        id: 'sleep',
        key: 'TIMER',
        x: 13.5,
        y: 113,
        width: 10,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;transform:scale(0.9, 0.9) translate(-20%, -5%)">SLEEP</span>'
      },
      {
        id: 'stop',
        key: 'STOP',
        x: 27,
        y: 113,
        width: 10,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 5px;display:inline-block;color:#FFF;transform:translate(0px, -30%)">\u25A0</span>'
      },
      {
        id: 'rewind',
        key: 'REWIND',
        x: 0,
        y: 122,
        width: 7,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-family:Segoe UI Symbol;font-size: 4px;display:inline-block;color:#FFF;transform:translate(-10%, -25%);">\u23EA</span>'
      },
      {
        id: 'play',
        key: 'PLAY',
        x: 10,
        y: 122,
        width: 7,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-size: 3px;display:inline-block;color:#FFF;">\u25B6</span><span style="font-size: 3px;display:inline-block;color:#FFF;white-space:nowrap;transform:scale(0.75, 0.8) translate(-60%, -300%);">MAGIC LINK</span>'
      },
      {
        id: 'pause',
        key: 'PAUSE',
        x: 20,
        y: 122,
        width: 7,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-family:Segoe UI Symbol;font-size: 4px;display:inline-block;color:#FFF;transform:translate(-10%, -25%);">\u23F8</span>'
      },
      {
        id: 'forward',
        key: 'FASTFORWARD',
        x: 30,
        y: 122,
        width: 7,
        height: 5,
        styles: {
          textAlign: 'center',
        },
        innerHTML: '<span style="font-family:Segoe UI Symbol;font-size: 4px;display:inline-block;color:#FFF;transform:translate(-10%, -25%);">\u23E9</span>'
      },
      {
        id: 'red',
        key: 'RED',
        x: 0,
        y: 131,
        width: 7,
        height: 5,
        color: '#EF0E0E',
        styles: {
          backgroundImage: 'url("icons/red.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      },
      {
        id: 'green',
        key: 'GREEN',
        x: 10,
        y: 131,
        width: 7,
        height: 5,
        color: '#33AA33',
        styles: {
          backgroundImage: 'url("icons/green.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      },
      {
        id: 'yellow',
        key: 'YELLOW',
        x: 20,
        y: 131,
        width: 7,
        height: 5,
        color: '#FFCC00',
        styles: {
          backgroundImage: 'url("icons/yellow.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      },
      {
        id: 'blue',
        key: 'BLUE',
        x: 30,
        y: 131,
        width: 7,
        height: 5,
        color: '#9999DD',
        styles: {
          backgroundImage: 'url("icons/blue.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      }
    ]
  }

  function applyStyle(el, obj) {   
    if (obj.innerHTML) {
      el.innerHTML = obj.innerHTML;
    }

    /* scale defaults to 1 if not set */
    const scale = obj.scale ?? 1;

    el.style.width = `${obj.width * scale}px`
    el.style.height = `${obj.height * scale}px`

    if (obj.color) {
      el.style.backgroundColor = obj.color;
    }

    if (obj.borderRadius) {
      el.style.borderRadius = `${obj.borderRadius * scale}px`;
    }

    /* apply individual styles */
    for (const [key, value] of Object.entries(obj.styles)) {
      el.style[key] = value;
    }
  }

  remote.el = container;

  applyStyle(remote.el, remote);

  /* create buttons */
  for (const btn of remote.buttons) {
    btn.scale = remote.scale;

    /* apply default attributes if button doesn't have them set */
    btn.color ??= remote.color;
    btn.borderRadius ??= remote.borderRadius;

    const el = document.createElement('button');

    applyStyle(el, btn)

    el.style.position = 'absolute';

    /* calculate position, scaling offset and individual button position */
    el.style.left = `${buttonOffsetX * remote.scale + btn.x * btn.scale}px`;
    el.style.top = `${buttonOffsetY * remote.scale + btn.y * btn.scale}px`;

    remote.el.appendChild(el);

    el.dataset.key = btn.key;

    el.addEventListener('click', clickHandler);

    btn.el = el;
  }

  /* scale font size for all <span>s */
  const spans = remote.el.getElementsByTagName('span');

  for (const span of spans) {
    if (span.style.fontSize) {
      const size = parseInt(span.style.fontSize);

      span.style.fontSize = `${size * remote.scale}px`;
    }
  }
}