$(function(){
	$('.btn-list').click(function(e){
		var id = $(this).attr('id');
		console.log("This is an id",id);
		$('#btn-save').attr('id',id);
		$('#myModal').modal('show');
	}); 
	$('#btn-save').click(function(e){
		var id = $(this).attr('id');
		console.log(id);
		$('#frm-sub').attr('action', 'subscribe/' + id);
		$('#frm-sub').submit();
	});
});