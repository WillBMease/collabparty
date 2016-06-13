var context = new (window.AudioContext || window.webkitAudioContext ||
  window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext)();
if (context) {
  // Web Audio API is available.
} else {
  alert('browser not supported') ;
}


var ansT = []
visualizer = context.createAnalyser();
visualizer.connect(context.destination)
// ans.smoothingTimeConstant = 0.85;
visualizer.smoothingTimeConstant = .85
// console.log(ans);
// var soundData = new Uint8Array(ans.frequencyBinCount);
var timeData = new Uint8Array(visualizer.frequencyBinCount);

var frameSize = 256

var sampleAudio = function(){




}
var frameSkip = 4;

var frameSwitch = function() {
  if (frameSkip % 2 === 0){
    draw();

    frameSkip ++;
  }

  else {

    frameSkip ++;
  }

  requestAnimationFrame(frameSwitch);

}

      var canv = document.getElementById('freq');
      var visLine = canv.getContext('2d');


var draw = function(){
  // context.clearcanv();
  visLine.clearRect(0,0,canv.width,canv.height)
  // visualizer.fftSize = 512;
  visualizer.fftSize = 1024;

  // visualizer.fftSize = 2048
  visualizer.getByteTimeDomainData(timeData);

  visLine.beginPath()
  // console.log(visualizer.frequencyBinCount)

  for (var i = 0; i< visualizer.frequencyBinCount; i++){
    xPos = (i*1.171875);
    // xPos = i
    // xPos = (i*5)
    // xPos = i/2
    yPos = timeData[i]*0.5 + 10;
    // yPos = timeData[i] + 10;

    if (i == 0){
      // visLine.beginPath();
      // visLine.arc(xPos, 74, 5, 0, 2 * Math.PI, false);
      // visLine.fillStyle = 'white';
      // visLine.fill();
      // visLine.lineWidth = 5;
      // visLine.strokeStyle = 'white';
      // visLine.stroke();
      // visLine.closePath()

      visLine.moveTo(xPos,74)
      i = 30
      visLine.lineTo(xPos+i,74)
      // console.log(xPos + " " + yPos)
    }
    else if (i == 482){
      visLine.lineTo(xPos,74)
      // visLine.moveTo(xPos,74)
      i = 512
      visLine.lineTo(i*1.171875,74)

      // visLine.closePath()

      // visLine.beginPath();
      // visLine.arc(xPos+30, 74, 5, 0, 2 * Math.PI, false);
      // visLine.fillStyle = 'white';
      // visLine.fill();
      // visLine.lineWidth = 5;
      // visLine.strokeStyle = 'white';
      // visLine.stroke();
      // visLine.closePath()
    }
    else{
    visLine.lineTo(xPos, yPos)
    // $("#freq").drawRect({
    //  fillStyle:"#0000FF",
    //  x:xPos, y:(yPos),
    //  width:5,height:2,
    //  shadowBlur:2,
    //  shadowColor:"#0000FF",
    //  strokeWidth: 10,   // added starting here
    //  beginPath: true

    // })
    }
  }
        visLine.lineWidth = 1;
      visLine.strokeStyle = 'white';
      // visLine.shadowBlur = 3;
      // visLine.hei
      visLine.stroke();
      visLine.closePath()
  // context6.closePath()
}
frameSwitch();
