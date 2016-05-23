/* Search Result Area */
$('.content .results-cover').click(function(event) {
	event.preventDefault();
	$('.search .field').addClass('required');
	$('.search .field').focus();
});
/* /Search Result Area */

/* If search field is empty */
$('.search .submit').click(function(){
	if( !$('.search .field').val() ) {
		$('.search .field').addClass('required');
		$('.search .field').focus();
	}
	else {
		$('.search .field').removeClass('required');
	}
});
/* /If search field is empty */

/* Add to Favorite */
$('.favorite').click(function(event) {
	event.preventDefault();
	$(this).toggleClass('active');
});
/* /Add to Favorite */



// not work
$('#cover-favorite-coverrrrr').click(function(e)
{
    e.preventDefault();
});
