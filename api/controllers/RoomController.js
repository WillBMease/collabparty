/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
// var youtubedl = require('youtube-dl');
var youtubedl

var alphabet = ['A','B','C','D','E','F','G','H','J','K','M','N','P','Q','R','S','T','U','V','W','X','Y','Z']
var digits = [2,3,4,5,6,7,8,9]
var chosen = [alphabet, digits]

// Randomly generate pairing code for TV
function generateRandomToken(callback) {
  var roomid = ''
  for (var i = 0 ; i < 3 ; i++){
    var which = Math.round(Math.random())
    roomid += chosen[which][Math.floor(Math.random()*chosen[which].length)]
  }
  callback(roomid);
}

var offsets = [], users = [], songs = [], currentSong = []

module.exports = {

	generateCode: function(req, res){
		generateRandomToken(function (roomid){
      Room.findOne({roomid: roomid}).exec(function(err, room){
        if (err) return
        if (!room){
          Room.create({roomid: roomid, songs: [], currentSong: ''}).exec(function(err, created){
            if (err) return

          })
        }
      })
			req.socket.emit('receiveCode', {roomid: roomid})
		})
	},

	ping: function(req, res){
    req.body.server = +new Date()
		res.send(req.body)
	},

  storeOffset: function(req, res){
    User.findOne({userid: req.body.userid}).exec(function(err, user){
      if (err) return
      if (user){
        user.offset = req.body.offset
        user.save()
      }
    })
  },

  play: function(req, res){
    Room.findOne({roomid: req.body.roomid}).exec(function(err, room){
      if (err) return
      if (room){
        room.playing = true
        sails.sockets.broadcast(req.body.roomid, 'play', req.body)
        room.save()
      }
    })
  },

  pause: function(req, res){
    Room.findOne({roomid: req.body.roomid}).exec(function(err, room){
      if (err) return
      if (room){
        room.playing = false
        sails.sockets.broadcast(req.body.roomid, 'pause', req.body)
        room.save()
      }
    })
  },

  updateTime: function(req, res){
    sails.sockets.broadcast(req.body.roomid, 'updateTime', req.body)
  },

  currentTime: function(req, res){
    sails.sockets.broadcast(req.body.roomid, 'currentTime', req.body)
  },

  addSong: function(req, res){
    var url = req.body.url
    var split = url.split('watch?v=')
    var videoid = split[1]
    var exists = false

    if (fs.existsSync('assets/audio/' + videoid + '.mp3')) {
      sails.sockets.broadcast(req.body.roomid, 'addSong', {url: '/audio/' + videoid + '.mp3', image: req.body.image, title: req.body.title, videoid: videoid})
    }
    else {
      var video = youtubedl(url, ['-x', '--extract-audio', '--audio-format=mp3', '--audio-quality=0'])
      // Will be called when the download starts.
      video.on('info', function(info) {
        console.log('Download started');
      })

      video.on('complete', function(info){
        console.log('complete')
      })

      video.on('end', function(info){
        sails.sockets.broadcast(req.body.roomid, 'addSong', {url: '/audio/' + videoid + '.mp3', image: req.body.image, title: req.body.title, videoid: videoid})
      })

      video.pipe(fs.createWriteStream('assets/audio/' + videoid + '.mp3'));
    }

    Room.findOne({roomid: req.body.roomid}).exec(function(err, room){
      if (err) return
      if (room){
        room.songs.push({url: '/audio/' + videoid + '.mp3', image: req.body.image, title: req.body.title, videoid: videoid})
        room.currentSong = videoid
        room.save()
      }
    })
  },

  changeSong: function(req, res){
    Room.findOne({roomid: req.body.roomid}).exec(function(err, room){
      if (err) return
      if (room){
        room.currentSong = req.body.videoid
        sails.sockets.broadcast(req.body.roomid, 'changeSong', req.body)
        room.save()
      }
    })
  },

  join: function(req, res){
    sails.sockets.join(req, req.body.roomid)

    Room.findOne({roomid: req.body.roomid}).exec(function(err, room){
      if (err) return
      if (room){
        User.findOne({userid: req.body.userid}).exec(function(err, user){
          if (err) return
          if (user){
            user.room = room.id
            res.send(room)
            user.save()
          }
          else {
            var obj = {
              userid: req.body.userid,
              offset: req.body.offset,
              room: room.roomid
            }
            User.create(obj).exec(function(err, created){
              if (err) return
              res.send(room)
            })
          }
        })
      }
    })
  }

};
