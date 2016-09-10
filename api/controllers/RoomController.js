/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var youtubedl = require('youtube-dl');

function generateRandomToken(cb) {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    cb(hex)
}

var offsets = [], users = [], songs = [], currentSong = []

module.exports = {

	generateCode: function(req, res){
		generateRandomToken(function (uuid){
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
    sails.sockets.broadcast(req.body.code, 'play', req.body)
  },

  pause: function(req, res){
    sails.sockets.broadcast(req.body.code, 'pause', req.body)
  },

  updateTime: function(req, res){
    sails.sockets.broadcast(req.body.code, 'updateTime', req.body)
  },

  currentTime: function(req, res){
    sails.sockets.broadcast(req.body.code, 'currentTime', req.body)
  },

  addSong: function(req, res){
    console.log('add song')
    var url = req.body.url
    var split = url.split('watch?v=')
    var videoid = split[1]
    var exists = false

    if (fs.existsSync('assets/audio/' + videoid + '.mp3')) {
      console.log(videoid)
      sails.sockets.broadcast(req.body.code, 'addSong', {url: '/audio/' + videoid + '.mp3', image: req.body.image, title: req.body.title, videoid: videoid})
    }
    else {
      var video = youtubedl(url, ['-x', '--extract-audio', '--audio-format=mp3', '--audio-quality=0'])
      // Will be called when the download starts.
      video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
      })

      video.on('complete', function(info){
        console.log('complete')
      })

      video.on('end', function(info){
        console.log('end')
        sails.sockets.broadcast(req.body.code, 'addSong', {url: '/audio/' + videoid + '.mp3', image: req.body.image, title: req.body.title, videoid: videoid})
      })

      video.pipe(fs.createWriteStream('assets/audio/' + videoid + '.mp3'));
    }

    if (!songs[req.body.code]){
      songs[req.body.code] = []
    }
    songs[req.body.code].push({url: '/audio/' + videoid + '.mp3', image: req.body.image, title: req.body.title, videoid: videoid})
    if (!currentSong[req.body.code])
      currentSong[req.body.code] = videoid
  },

  changeSong: function(req, res){
    console.log('change song')
    currentSong[req.body.code] = req.body.videoid
    sails.sockets.broadcast(req.body.code, 'changeSong', req.body)
  },

  join: function(req, res){
    sails.sockets.join(req, req.body.code)
    var s = []
    if (songs[req.body.code]){
      s = songs[req.body.code]
    }
    var c = false
    if (currentSong[req.body.code])
      c = currentSong[req.body.code]
    res.send({songs: s, currentSong: c})
    if (!users[req.body.code]){
      users[req.body.code] = 0
    }
    users[req.body.code]++
  }

};
