/**
* Room.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
  connection: 'room',

  attributes: {
    roomid: { type: 'string', defaultsTo: '' },
    songs: { type: 'array', defaultsTo: [] },
    currentSong: { type: 'string', defaultsTo: '' },
    users: {
      collection: 'user',
      via: 'room'
    }

  }
};
