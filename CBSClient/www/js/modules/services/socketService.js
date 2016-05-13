'use strict';

/*jshint sub:true*/

function SocketService(socketFactory) {

  return socketFactory({
    /* jshint ignore:start */
    ioSocket: io.connect('http://159.203.18.207:3000/api')
    //172.17.123.206
    /* jshint ignore:end */
  });

}

module.exports = ['socketFactory', SocketService];
