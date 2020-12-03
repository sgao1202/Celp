(function ($) {

    // Make rows clickable
    $(".clickable-row").mouseup( (event) => {
        let href = event.currentTarget.getAttribute('data-href')
        console.log(href);
        console.log(window.location);
        window.location = href;
    });
})(jQuery);

function fName(id,col) {
    let input, filter, table, row, i, txtValue;
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    rows = document.getElementsByClassName("clickable-row");
    for (i = 0; i < rows.length; i++) {
        row = rows[i];
        txtValue = row.cells[col].innerHTML;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}
function fNum(id,col,compareFn=(a,b)=>a>=b) {
    let input, filter, table, row, i, txtValue;
    input = document.getElementById(id);
    filter = parseFloat(input.value);
    rows = document.getElementsByClassName("clickable-row");
    for (i = 0; i < rows.length; i++) {
        row = rows[i];
        txtValue = parseFloat(row.cells[col].innerHTML);
        if (compareFn(txtValue,filter)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}

var rsb = document.getElementById("rsb");
var rsd = document.getElementById("rsd");
var psb = document.getElementById("psb");
var psd = document.getElementById("psd");
rsd.innerHTML = rsb.value;
psd.innerHTML = psb.value;
rsb.oninput = function() {
  rsd.innerHTML = this.value;
}
psb.oninput = function() {
  psd.innerHTML = this.value;
}