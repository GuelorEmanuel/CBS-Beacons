# Canadian Blood Services proof of concept using Estimote beacons

getting started: client Side
--------------------
- setting up client environment

  ```sh
  sudo npm install -g cordova
  cd CBSClient
  npm install --global gulp-cli 
  npm install -g browserify
  npm install -g jshint
  sudo npm install -g cordova
  sudo npm install -g ionic
  npm install
  bower install
  ionic platform add android || ios
  ```
- building and running the app
  ```sh
   gulp
   ionic run android     // for building to a connected android device via usb
   ionic serve          // for browser testing ( check out ionic documentation)
  ```
- If the client side is unable to connect to the server when trying to login:
- Try to ping the the droplet, if unable to then this the server might have crashed or that the server is not longer being
- hosted on digital( try spinning up your own server).
  ```sh
  ping 159.203.18.207
```

Server Side
--------------------
- The node server is hosted on Digital ocean: the app connects to it by default.
- To start your own local server:
```sh
   cd cbs-beacons-server
   npm install     
   node server.js             
  ```
- Change the client Ip address in the app.js, socketService.js, and index.html page to point to your Ip address.


