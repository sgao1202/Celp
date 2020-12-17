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
    let c = 0;
    for (i = 0; i < rows.length; i++) {
        row = rows[i];
        txtValue = row.cells[col].innerHTML;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            row.style.display = "";
            c=c+1;
        } else {
            row.style.display = "none";
        }
    }
    table = document.getElementsByClassName("m-5")[1];
    no_table= document.getElementById("no-result");
    if (c==0) {
        table.hidden=true;
        no_table.hidden=false;
    } else {
        table.hidden=false;
        no_table.hidden=true;
    }
}
function fNum(id,col,compareFn=(a,b)=>a>=b) {
    let input, filter, table, row, i, txtValue;
    input = document.getElementById(id);
    filter = parseFloat(input.value);
    rows = document.getElementsByClassName("clickable-row");
    let c = 0;
    for (i = 0; i < rows.length; i++) {
        row = rows[i];
        txtValue = parseFloat(row.cells[col].innerHTML);
        if (compareFn(txtValue,filter)) {
            row.style.display = "";
            c=c+1;
        } else {
            row.style.display = "none";
        }
    }
    table = document.getElementsByClassName("m-5")[1];
    no_table= document.getElementById("no-result");
    if (c==0) {
        table.hidden=true;
        no_table.hidden=false;
    } else {
        table.hidden=false;
        no_table.hidden=true;
    }
}

function fNum2() { // And Filter
    filter1 = parseFloat(document.getElementById('rsb').value);
    filter2 = parseFloat(document.getElementById('psb').value);
    rows = document.getElementsByClassName("clickable-row");
    let c = 0;
    for (i = 0; i < rows.length; i++) {
        row = rows[i];
        value1= parseFloat(row.cells[3].innerHTML);
        value2=	parseFloat(row.cells[4].innerHTML);
        if (filter1<=value1 && filter2>=value2) {
            row.style.display = "";
            c=c+1;
        } else {
            row.style.display = "none";
        }
    }
    table = document.getElementsByClassName("m-5")[1];
    no_table= document.getElementById("no-result");
    if (c==0) {
        table.hidden=true;
        no_table.hidden=false;
    } else {
        table.hidden=false;
        no_table.hidden=true;
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