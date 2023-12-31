ssap-web
========

A hacky implementation of webOS remote control API on the web.

Instructions
------------

Save a copy of this repo locally (e.g. by cloning the repo or
[downloading it as a zip file](https://github.com/throwaway96/webos-ssap-web/archive/refs/heads/master.zip)).
Then open `index.html` in a web browser. Chrome/Chromium gets the most testing,
but Firefox should work as well.

How it works
------------

By default a server implementing SSAP on webOS prevents web origins from
accessing its websocket. However there are exceptions to allow communication
from chrome extensions *and `file://` origins*. Both `file://` and `data:`
origins present themselves to remote server as `Origin: null`. We use that to
allow http-based origin to communicate with SSAP server using a hidden iframe
with `src="data:..."` communicating back and forth with the main `http://`
frame. This is implemented in `wsproxy.js`.

Limitations
-----------

Currently this client can't be effectively used on `https://` origins due to
mixed content security policies. Alternatively, user can be requested to
manually approve self-signed certificate used for `wss://:3001` server exposed
by webOS.

License
-------

This software is licensed under the GNU Affero General Public License, version 3
or later. A copy of the GNU AGPL is included as COPYING.

Credits
-------

Derived from [webos-ssap-web](https://github.com/Informatic/webos-ssap-web),
copyright Piotr Dobrowolski.

Remote UI by [simon_34545](https://github.com/Simon34545).
