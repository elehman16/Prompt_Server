"use-strict";

/**
* Returns the text of whatever the user selected for the drop-down menu.
* i.e. "Significantly increased/decreased... etc."
*/
function getCheckBoxSelection() {
  var selected = document.getElementsByName('select');
  var ans = "";
  for (var i = 0; i < selected.length; i++){
    if (selected[i].checked) {
        ans = selected[i].value;
        break;
    }
  }

  return ans;
}

/**
* Retrieves the following information from the modal (form) in a dictionary:
*   1. Outcome
*   2. Intervention
*   3. Comparator
*   4. Answer
*   5. Reasoning
*/
function get_form_data() {
  var data = {};
  data["out"] = $("#outcome-resp").val();
  data["int"] = $("#intervention-resp").val();
  data["cmp"] = $("#comparator-resp").val();
  data["ans"] = getCheckBoxSelection();
  data["res"] = $("#reasoning-resp").val();
  return data;
}

/**
* Displays the information in the tab when clicked on.
*
* @param evt represents what happend with the tab.
* @param name represents which tab to open.
*/
function openTab(evt, name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
}

/**
* Used to break down a Text into a readable format (see data-definition below).
*
* @param orig_tab represents the parent HTML element if it exists.
* @param text is of the following data definition:
* Text is one of:
*    - Array of Text
*    - ['title', 'paragraph']
*    - ['title', Text]
*/
function breakDownText(text, orig_tab) {
  var copy = orig_tab;
  if (text.length != 2 || Array.isArray(text[0])) { // there are multiple sections here if this is the case
    for (var i = 0; i < text.length; i++) {
      breakDownText(text[i], orig_tab); // break each of these larger sections down
    }                                  // this is likely the beginnining with all tab headers
  } else {
    if (orig_tab === undefined) { // If there is no title for this section, make one.
      var title = text[0];
      var tab = document.getElementById(title);
      var title_element = document.createElement("h3");
      title_element.innerHTML = title;
      tab.appendChild(title_element);
      orig_tab = tab;
    }

    if (Array.isArray(text[1])) { // If there is a sub-section under this section, break it down
      breakDownText(text[1], orig_tab);
    } else { // otherwise add to it
      if (copy !== undefined) {
        var title = text[0];
        var title_element = document.createElement("h4");
        title_element.innerHTML = title;
        orig_tab.appendChild(title_element);
      }

      var text_element = document.createElement("p");
      text_element.innerHTML = text[1];
      orig_tab.appendChild(text_element);
    }
  }

}

/**
* Get the text that was highlighted by the user.
*/
function getSelectedText() {
    var text = "";

    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }

    window.getSelection().removeAllRanges();

    text = text.trim();
    return text;
}

/**
* Check that the string is already highlighted.
*
* @param highlighted represents that the user wants to add to the highlighted list.
*/
function isAlreadyHighlighted(highlighted) {
    var highlights = getFinalText();
    for (var i = 0; i < highlights.length; i++) {
        if (highlights[i].includes(highlighted)) {
            return true;
        }
    }

    return false;
}

/**
* Returns an array of all the text that has been highlighted by the user.
*/
function getFinalText() {
    var results = [];
    var annotations = $("#selected li");
    annotations.each(function(idx, li) {
        results.push($(li).text());
    });
    return results;
}

/**
* When the user moves mouse onto this button, change the color.
*/
function hover_over(item) {
  item.style.background = "#ccc";
}

/**
* When the user moves mouse away from this button, change the color.
*/
function hover_away(item) {
   var names = item.className;
   if (names.includes('active')) {
     return ;
   }

   item.style.background = "#f1f1f1";
}
