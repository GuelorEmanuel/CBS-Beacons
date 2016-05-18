/*
 * SocketFactory: similar to a  singleton pattern: return the connected state.
 * by: Guelor Emanuel
 */
'use strict';

/*jshint sub:true*/

function SocketFactory(socketFactory) {

  return socketFactory({
    /* global io: true */
    ioSocket: io.connect('http://159.203.18.207:3000')
    //172.17.123.206
  });

}

module.exports = ['socketFactory', SocketFactory];
