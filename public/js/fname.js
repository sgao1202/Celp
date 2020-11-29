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