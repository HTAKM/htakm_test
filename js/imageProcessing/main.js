var currentOp = "noOperation";

function changeTabs(event) {
    var target = $(event.target);
    if (target.prop("tagName") !== "A") {
        target = target.parents("a");
    }

    target.tab("show");
    target.toggleClass("active");
    target.parents(".nav-item").find(".nav-link").toggleClass("active");
    target.parents("li").find("span.title").html(target.html());
    currentOp = target.attr("href").substring(1);
    event.preventDefault();
}

$(function() {
    // imageProc.init("input", "output", "input-image");
    $('a.basicOp-dropdown-item').on("click", changeTabs);
});