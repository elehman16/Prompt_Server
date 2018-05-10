// Make all the rows in the table selectable.
function selectable_table() {
  $("#data-table-body tr").click(function() {

    if ($(this).hasClass('selected')) {
      $("#edit-but").click();
      return;
    }
     $(this).addClass('selected').siblings().removeClass('selected');
     document.getElementById("delete-but").disabled = false;
     document.getElementById("edit-but").disabled = false;
     document.getElementById("copy-but").disabled = false;
  });
}

// determines if the user is able to submit - if so, enable the submit button
function can_submit() {
  var valid_submit = document.getElementById("data-table-body").children.length > 0;
  if (valid_submit) {
    document.getElementById("submit-but").disabled = false;
  } else {
    document.getElementById("submit-but").disabled = true;
  }
}

// Gets the highlighted row and removes it - reset the edit + delete buttons.
function delete_prompt_row() {
  var highlighted = document.getElementsByClassName("selected")[0];
  highlighted.parentNode.removeChild(highlighted);
  document.getElementById("delete-but").disabled = true;
  document.getElementById("edit-but").disabled = true;
  document.getElementById("copy-but").disabled = true;

  can_submit();
}

// If the user doesn't edit, and decides to close to prompt, then reset everything.
function edit_prompt_on_close() {
  reset_form();
  document.getElementById("final-prompt-submit-but").onclick = submit_text;
  document.getElementsByClassName("selected")[0].classList.remove('selected');
  document.getElementById("close-modal").onclick = null;
}

// Update the row based on the modal's data.
function update_row() {
  var highlighted = document.getElementsByClassName("selected")[0].children;
  var data = get_form_data();

  // change data
  highlighted[0].innerHTML = data['out'];
  highlighted[1].innerHTML = data['int'];
  highlighted[2].innerHTML = data['cmp'];
  highlighted[3].innerHTML = data['ans'];
  highlighted[4].innerHTML = data['res'];

  // reset
  document.getElementById("final-prompt-submit-but").onclick = submit_text;
  reset_form();
  $("#close-modal").click();
  document.getElementById("close-modal").onclick = null;
}

/**
* Helper function that copies the selected row to the form.
*/
function copy_to_form() {
  var highlighted = document.getElementsByClassName("selected")[0].children;

  // Put highlighted's data into the form
  $("#outcome-resp").val(highlighted[0].innerHTML);
  $("#intervention-resp").val(highlighted[1].innerHTML);
  $("#comparator-resp").val(highlighted[2].innerHTML);
  $("#reasoning-resp").val(highlighted[4].innerText);

  switch (highlighted[3].innerHTML) {
    case "Significantly increased":
      $("#sig-inc-but").click();
      break;
    case "Significantly decreased":
      $("#sig-dec-but").click();
      break;
    case "No significant difference":
      $("#no-sig-dif-but").click();
      break;
  }
}

// Edit the row if there is a mistake
function edit_prompt_row() {
  copy_to_form();

  // Change the submit button function for our purposes
  document.getElementById("final-prompt-submit-but").onclick = update_row;
  document.getElementById("close-modal").onclick = edit_prompt_on_close;

  // show the modal
  $("#addPromptModal").modal('show');

  // epilogue - remove the highlighted field and reset the buttons
  document.getElementById("delete-but").disabled = true;
  document.getElementById("edit-but").disabled = true;
  document.getElementById("copy-but").disabled = true;
}

/**
* Copies the row selected and then adds it in.
*/
function copy_row() {
  copy_to_form();
  submit_text();
  document.getElementsByClassName("selected")[0].classList.remove('selected');

  // epilogue - remove the highlighted field and reset the buttons
  document.getElementById("delete-but").disabled = true;
  document.getElementById("edit-but").disabled = true;
  document.getElementById("copy-but").disabled = true;
}

/**
* Check if we can finally submit.
*/
function can_final_submit(data) {
  var all_data = new Set();
  var not_abstract = false;
  // check if there are duplicates
  for (var i = 0; i < data.length; i++) {
    var str = data[i][0] + data[i][1] + data[i][2] + data[i][3] + data[i][4] + data[i][5];
    if (data[i][5] !== 'Abstract') {
      not_abstract = true;
    }

    if (all_data.has(str)) {
      $("#error-body").text("You cannot submit duplicate prompts.");
      $("#error-modal").modal("show");
      return false;
    } else {
      all_data.add(str);
    }
  }


  // there are only prompts from the abstract AND there is more the abstract tab
  var not_abstract = not_abstract || document.getElementsByClassName("tabcontent").length <= 2;
  if (!not_abstract) {
    $("#error-body").text("You must have prompts generated from different sections.");
    $("#error-modal").modal("show");
  }

  return not_abstract;
}


/**
* Send the data to the python code.
*/
function submit() {
  var table = document.getElementById("data-table-body").children;
  var table_data = [];

  for (var i = 0; i < table.length; i++) {
    var row = table[i].children;
    var row_data = [];
    for (var j = 0; j < row.length; j++) {
      var col = row[j];
      row_data.push(col.innerHTML);
      // if at the end, then find in which tab the string is
      if (j == row.length - 1) {
        row_data.push(which_tab(col.innerHTML));
      }
    }

    table_data.push(row_data);
  }

  if (can_final_submit(table_data)) {
    post("/submit/", {"userid": document.getElementById("userid").innerHTML,
                      "id": document.getElementById("pmc").innerHTML,
                      "pmid": document.getElementById("id").innerHTML,
                      "prompts": JSON.stringify(table_data),
                      "rowID": document.getElementById("rowID").innerHTML});
  }

}

document.getElementById("delete-but").onclick = delete_prompt_row;
document.getElementById("edit-but").onclick = edit_prompt_row;
document.getElementById("copy-but").onclick = copy_row;
document.getElementById("submit-but").onclick = submit;
