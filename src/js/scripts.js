$(document).ready(function() {
  $('[data-range]').each(function() {
    $(this).slider({
      range: true,
      min: 0,
      max: 500
    });
  });
});