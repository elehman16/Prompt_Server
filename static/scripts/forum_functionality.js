/**
* Determines if the submit button should be active.
*/
function is_active_submit_but() {
  var data = get_form_data();
  if (data["out"] !== "" && data["int"] !== "" && data["cmp"] !== "" && data["ans"] !== "" && data["res"] !== "") {
    document.getElementById("final-prompt-submit-but").disabled = false;
  } else {
    document.getElementById("final-prompt-submit-but").disabled = true;
  }
}

function add_reasoning_from_highlight() {
  var text, range;
  [text, range] = getSelectedTextAndRange();
  var xml_i = -1;
  var xml_f = -1;
  if (range) {
    var node_i = parseInt(range.startContainer.parentNode.getAttribute('xml_i'));
    var node_f = parseInt(range.endContainer.parentNode.getAttribute('xml_i'));
    xml_i = node_i + range.startOffset;
    xml_f = node_f + range.endOffset;
  }
  $("#reasoning-resp").val(text);
  $("#reasoning-resp").attr('xml_offsets', xml_i + ':' + xml_f);
  return text;
}

/**
* Show a modal that is essentially a form for users to fill out information for.
*/
function add_prompt() {
  var initial_text = add_reasoning_from_highlight();
  if (initial_text != "") {
    document.getElementById("clear-text-but").disabled = false;
  }
  $("#addPromptModal").modal('show');
}

/**
* Clear the response section, and disable the clear button.
*/
function clear_resp() {
  $("#reasoning-resp").val("");
  is_active_submit_but();
  document.getElementById("clear-text-but").disabled = true;
}

/**
* Make modal visable when mouse click up AND something is selected.
* If so, make modal visable, save the text, and reset the button-up to null.
* Also, check if we should make the submit button available.
*/
function mouse_up_select_text() {
  var selected_text = add_reasoning_from_highlight();
  if (selected_text !== "") {
    $("#addPromptModal").modal('show'); // make modal visable
    document.onmouseup = null;
    is_active_submit_but();
    $("#reasoning-table-tag").css("background-color", "white");
    return ;
  }
}

/**
* Display the article for the user in order to select text.
*   1. Disable the visibility of the Modal.
*   2. Make modal visable when mouse click up AND something is selected.
*   3. Get the selected text and store it in the modal's response section.
*   4. Remove the window's mouse-up function.
*   5. Display the modal
*   6. Allow user to clear.
*/
function select_text() {
  $("#addPromptModal").modal('hide');
  $("#reasoning-table-tag").css("background-color", "yellow");
  document.onmouseup = mouse_up_select_text;
  document.getElementById("clear-text-but").disabled = false;
}

/**
* Make modal visable when mouse click up AND something is selected.
* If so, make modal visable, save the text, and reset the button-up to null.
* Also, check if we should make the submit button available.
*/
function mouse_up_select_text_out_cmp_int(type) {
  var selected_text = getSelectedText();
  if (selected_text !== "") {
    $("#addPromptModal").modal('show'); // make modal visable
    switch(type) {
      case "out":
        $("#outcome-resp").val(selected_text);
        $("#outcome-table-tag").css("background-color", "white"); // reset
        break;
      case "cmp":
        $("#comparator-resp").val(selected_text);
        $("#comparator-table-tag").css("background-color", "white"); // reset
        break;
      case "int":
        $("#intervention-resp").val(selected_text);
        $("#intervention-table-tag").css("background-color", "white"); // reset
        break;
    }

    document.onmouseup = null;
    is_active_submit_but();
    return ;
  }
}

/**
* Display the article for the user in order to select text.
*   1. Disable the visibility of the Modal.
*   2. Make modal visable when mouse click up AND something is selected.
*   3. Get the selected text and store it in the modal's response section.
*   4. Remove the window's mouse-up function.
*   5. Display the modal
*   6. Allow user to clear.
*/
function select_text_out_cmp_int(type) {
  $("#addPromptModal").modal('hide');
  switch(type) {
    case "out":
      $("#outcome-table-tag").css("background-color", "yellow");
      break;
    case "cmp":
      $("#comparator-table-tag").css("background-color", "yellow");
      break;
    case "int":
      $("#intervention-table-tag").css("background-color", "yellow");
      break;
  }

  document.onmouseup = (function() {
    mouse_up_select_text_out_cmp_int(type);
  });
}

// Adds the data to the table.
function addToTable() {
  var data = get_form_data();
  var tableRef = document.getElementById('data-table').getElementsByTagName('tbody')[0];

  // Insert a row in the table at the last row
  var newRow = tableRef.insertRow(tableRef.rows.length);

  // insert outcome
  var newCell = newRow.insertCell(0);
  var newText = document.createTextNode(data['out']);
  newCell.appendChild(newText);

  // insert comparison
  var newCell = newRow.insertCell(1);
  var newText = document.createTextNode(data['int']);
  newCell.appendChild(newText);

  // insert intervention
  var newCell = newRow.insertCell(2);
  var newText = document.createTextNode(data['cmp']);
  newCell.appendChild(newText);

  // insert answer
  var newCell = newRow.insertCell(3);
  var newText = document.createTextNode(data['ans']);
  newCell.appendChild(newText);

  // insert reason
  var newCell = newRow.insertCell(4);
  var newText = document.createTextNode(data['res']);
  newCell.appendChild(newText);
  
  var newCell = newRow.insertCell(5);
  newCell.style.display = 'none';
  var newText = document.createTextNode(data['xml']);
  newCell.appendChild(newText);
}

// reset the modal to have all fields blank
function reset_form() {
  $("#outcome-resp").val("");
  $("#intervention-resp").val("");
  $("#comparator-resp").val("");
  $("#reasoning-resp").val("");
  $('input[name=select]').attr('checked',false);
}

/**
* "Submit" the data, and add it to the table.
*   1. Add data to table.
*   2. Reset the table.
*   3. Close the Modal
*   4. Make sure all the rows are selectable.
*   5. Check if we can FULLY submit (to move on to the next article).
*/
function submit_text() {
  addToTable();
  reset_form();
  is_active_submit_but();
  $("#close-modal").click();
  selectable_table();
  can_submit();
}

// add functions to the buttons
document.getElementById("add-but").onclick = add_prompt;
document.getElementById("select-text-but").onclick = select_text;
document.getElementById("clear-text-but").onclick = clear_resp;
document.getElementById("final-prompt-submit-but").onclick = submit_text;
$("#cmp-select-text-but").click(function() { select_text_out_cmp_int("cmp"); });
$("#int-select-text-but").click(function() { select_text_out_cmp_int("int"); });
$("#out-select-text-but").click(function() { select_text_out_cmp_int("out"); });

// After typing, determine if we should make the submit button available
$("#outcome-resp").keyup(is_active_submit_but);
$("#intervention-resp").keyup(is_active_submit_but);
$("#comparator-resp").keyup(is_active_submit_but);
document.getElementById("sig-inc-but").onclick = is_active_submit_but;
document.getElementById("sig-dec-but").onclick = is_active_submit_but;
document.getElementById("no-sig-dif-but").onclick = is_active_submit_but;
