/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var youtubedl = require('youtube-dl');

var alphabet = ['A','B','C','D','E','F','G','H','J','K','M','N','P','Q','R','S','T','U','V','W','X','Y','Z']
var digits = [2,3,4,5,6,7,8,9]
var chosen = [alphabet, digits]

// Randomly generate pairing code for TV
 function generateUUID(callback) {
    var uuid = ''
    for (var i = 0 ; i < 5 ; i++){
      var which = Math.round(Math.random())
      uuid += chosen[which][Math.floor(Math.random()*chosen[which].length)]
    }
    callback(uuid);
}

var offsets = []

module.exports = {

	generateCode: function(req, res){
		generateUUID(function (uuid){
			req.socket.emit('receiveCode', {uuid: uuid})
		})
	},

	ping: function(req, res){
    req.body.server = +new Date()
		res.send(req.body)
	},

  storeOffset: function(req, res){
    offsets[req.body.id] = req.body.offset
  },

  play: function(req, res){
    console.log('play')
    sails.sockets.broadcast(req.body.code, 'play', req.body)
  },

  pause: function(req, res){
    console.log('pause')
    sails.sockets.broadcast(req.body.code, 'pause', req.body)
  },

  updateTime: function(req, res){
    console.log('updateTime')
    sails.sockets.broadcast(req.body.code, 'updateTime', req.body)
  },

  currentTime: function(req, res){
    sails.sockets.broadcast(req.body.code, 'currentTime', req.body)
  },

  addSong: function(req, res){
    console.log('add song')
    var url = req.body.url
    var video = youtubedl(url, ['-x', '--extract-audio', '--audio-format'])

    console.log(video)
    // Will be called when the download starts.
    video.on('info', function(info) {
      console.log('Download started');
      console.log('filename: ' + info.filename);
      console.log('size: ' + info.size);
    })

    video.on('complete', function(info){
      console.log('complete')
    })

    video.on('end', function(info){
      console.log('end')
    })

    var split = url.split('watch?v=')
    video.pipe(fs.createWriteStream('assets/audio/' + split[1] + '.mp3'));
    sails.sockets.broadcast(req.body.code, 'addSong', {url: '/audio/' + split[1] + '.mp3'})
  },

  join: function(req, res){
    sails.sockets.join(req, req.body.code)
  }

};
