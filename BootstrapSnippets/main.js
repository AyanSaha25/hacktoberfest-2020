      
  VANTA.BIRDS({
  el: "#vantaBirds",
  mouseControls: true,
  touchControls: true,
  minHeight: 400.00,
  minWidth: 400.00,
  scale: 1.00,
  scaleMobile: 1.00,
  backgroundColor: 0x0,
  color2: 0x2fff00
});
  $("#form").click(function(){
  $("#form1").toggle(1000)
  $("#form").hide()
  $("#formm").hide()
});
$("#back").click(function(){
  $("#form").toggle(1000)
  $("#form1").hide()
  $("#formm").toggle(1000)
});