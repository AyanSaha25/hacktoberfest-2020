$(function () {
    var roles = ["Weeb", "Gamer", "Student", "Coder", "VITian"];
    var count = 0;
    var $typeSpan = $("#intro .content h2 span").typist({
      text: roles[count]
    });
    setInterval(() => {
        $typeSpan
          .typistRemove(roles[count++ % roles.length].length)
          .typistPause(800)
          .typistAdd(roles[count % roles.length])
          .typistPause(1000);
      }, 3000);
    $(".navbar").hide();
    $(window).scroll(function () {
        if ($(window).scrollTop() > 40) {
            $(".navbar").slideDown(200);
        } else {
            $(".navbar").slideUp(100);
        }
    });
});