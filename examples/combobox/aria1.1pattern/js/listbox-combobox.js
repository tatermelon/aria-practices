/**
 * @constructor
 *
 * @desc
 *  Combobox object representing the state and interactions for a combobox
 *  widget
 *
 * @param comboboxNode
 *  The DOM node pointing to the combobox
 * @param input
 *  The input node
 * @param listbox
 *  The listbox node to load results in
 * @param searchFn
 *  The search function. The function accepts a search string and returns an
 *  array of results.
 */
aria.ListboxCombobox = function (comboboxNode, input, listbox, searchFn) {
  this.combobox = comboboxNode;
  this.input = input;
  this.listbox = listbox;
  this.searchFn = searchFn;
  this.activeIndex = -1;
  this.resultsCount = 0;

  this.setupEvents();
};

aria.ListboxCombobox.prototype.setupEvents = function() {
  this.input.addEventListener('keyup', this.checkKey.bind(this));
  this.input.addEventListener('keydown', this.setActiveItem.bind(this));
  this.listbox.addEventListener('click', this.clickItem.bind(this));
};

aria.ListboxCombobox.prototype.checkKey = function(event) {
  var key = event.which || event.keyCode;

  switch (key) {
    case aria.KeyCode.UP:
    case aria.KeyCode.DOWN:
    case aria.KeyCode.ESC:
    case aria.KeyCode.RETURN:
      event.preventDefault();
      return;
    default:
      this.updateResults(event);
  }
};

aria.ListboxCombobox.prototype.updateResults = function() {
  var searchString = this.input.value;
  var results = this.searchFn(searchString);

  this.listbox.innerHTML = null;
  this.activeIndex = -1;
  this.input.setAttribute(
    'aria-activedescendant',
    ''
  );

  if (results.length) {
    for (var i = 0; i < results.length; i++) {
      var resultItem = document.createElement('li');
      resultItem.className = 'result';
      resultItem.setAttribute('role', 'option');
      resultItem.setAttribute('id', 'result-item-' + i);
      resultItem.innerText = results[i];
      this.listbox.appendChild(resultItem);
    }
    aria.Utils.removeClass(this.listbox, 'hidden');
    this.combobox.setAttribute('aria-expanded', 'true');
    this.resultsCount = results.length;
  } else {
    aria.Utils.addClass(this.listbox, 'hidden');
    this.combobox.setAttribute('aria-expanded', 'false');
    this.resultsCount = 0;
  }
};

aria.ListboxCombobox.prototype.setActiveItem = function(evt) {
  var key = event.which || event.keyCode;
  var activeIndex = this.activeIndex;

  if (this.resultsCount < 1) {
    return;
  }

  var prevActive = document.getElementById('result-item-' + activeIndex);
  var activeItem;

  switch (key) {
    case aria.KeyCode.UP:
      if (activeIndex <= 0) {
        activeIndex = this.resultsCount - 1;
      } else {
        activeIndex--;
      }
      break;
    case aria.KeyCode.DOWN:
      if (activeIndex === -1 || activeIndex >= this.resultsCount - 1) {
        activeIndex = 0;
      } else {
        activeIndex++;
      }
      break;
    case aria.KeyCode.ESC:
      activeIndex = -1;
      break;
    case aria.KeyCode.RETURN:
      activeItem = document.getElementById('result-item-' + activeIndex);
      this.selectItem(activeItem);
      return;
    default:
      return;
  }

  event.preventDefault();

  activeItem = document.getElementById('result-item-' + activeIndex);
  this.activeIndex = activeIndex;

  if (prevActive) {
    aria.Utils.removeClass(prevActive, 'focused');
  }

  if (activeItem) {
    this.input.setAttribute(
      'aria-activedescendant',
      'result-item-' + activeIndex
    );
    aria.Utils.addClass(activeItem, 'focused');
  } else {
    this.input.setAttribute(
      'aria-activedescendant',
      ''
    );
  }
};

aria.ListboxCombobox.prototype.clickItem = function(evt) {
  if (evt.target && evt.target.nodeName == 'LI') {
    console.log('selected item', evt.target)
    this.selectItem(evt.target);
  }
};

aria.ListboxCombobox.prototype.selectItem = function(item) {
  if (item) {
    this.input.value = item.innerText;
    this.listbox.innerHTML = null;
    this.activeIndex = -1;
    aria.Utils.addClass(this.listbox, 'hidden');
    this.combobox.setAttribute('aria-expanded', 'false');
    this.resultsCount = 0;
  }
};
