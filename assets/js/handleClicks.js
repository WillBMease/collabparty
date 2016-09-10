$('#enableContainer').click(function(){
  $('#song').get(0).play()
  $('#song').get(0).pause()
  $('#enableContainer').remove()
  mobileReady = true
})

$('#invite').click(function(){
	if (!open){
		$('.sidebar').css('left', '0px')
		open = true
	}
	else {
		$('.sidebar').css('left', '-200px')
		open = false
	}
})

$('#play').click(function(){
  clickPlay()
})
