 $(document).ready(function() {
$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
})
 	  //close nav dropdown when i click outside the div
$(document).on('click',function(){
  $('.collapse').collapse('hide');
});
});
