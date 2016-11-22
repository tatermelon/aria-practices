/*
*   Copyright 2016 University of Illinois
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*
*   File:   menubuttonItemAction.js
*
*   Desc:   Menubutton Menuitem widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun and Nicholas Hoyt
*/

/*
*   @constructor MenubuttonItem
*
*   @desc
*       Object that configures menu item elements by setting tabIndex
*       and registering itself to handle pertinent events.
*
*       While menuitem elements handle many keydown events, as well as
*       focus and blur events, they do not maintain any state variables,
*       delegating those responsibilities to its associated menu object.
*
*       Consequently, it is only necessary to create one instance of
*       MenubuttonItem from within the menu object; its configure method
*       can then be called on each menuitem element.
*
*   @param domNode
*       The DOM element node that serves as the menu item container.
*       The menuObj PopupMenu is responsible for checking that it has
*       requisite metadata, e.g. role="menuitem".
*
*/
var Menubutton = function (domNode) {

  this.domNode   = domNode;
  this.popupMenu = false;

  this.hasFocus = false;
  this.hasHover = false;

  this.keyCode = Object.freeze({
    'TAB'      :  9,
    'RETURN'   : 13,
    'ESC'      : 27,
    'SPACE'    : 32,
    'PAGEUP'   : 33,
    'PAGEDOWN' : 34,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

Menubutton.prototype.init = function () {

  this.domNode.setAttribute('aria-haspopup', 'true');
  this.domNode.setAttribute('aria-expanded', 'false');



  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this) );
  this.domNode.addEventListener('click',      this.handleClick.bind(this) );
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this) );
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this) );
  this.domNode.addEventListener('mouseover',  this.handleMouseover.bind(this) );
  this.domNode.addEventListener('mouseout',   this.handleMouseout.bind(this) );

  // initialize pop up menus

  var popupMenu = document.getElementById(this.domNode.getAttribute("aria-controls"));


  if (popupMenu) {
    this.popupMenu = new PopupMenuLinks(popupMenu, this);
    this.popupMenu.init();
  }

};


Menubutton.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false, clickEvent;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      if (tgt.getAttribute('aria-expanded') === 'true' && this.popupMenu) {
        this.popupMenu.close();
      }
      else {
        this.popupMenu.open();
      }  
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToLastItem();
        flag = true;
      }
      break;

    case this.keyCode.DOWN:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
        flag = true;        
      }
      break;      

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};


Menubutton.prototype.handleClick = function (event) {
  if(this.domNode.getAttribute("aria-expanded")=="true"){
      this.popupMenu.close();
  }
  else{
    this.popupMenu.open();
  }
};

Menubutton.prototype.handleFocus = function (event) {
  this.popupMenu.hasFocus = true;
};

Menubutton.prototype.handleBlur = function (event) {
  this.popupMenu.hasFocus = false;
};

Menubutton.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  this.popupMenu.open();
};

Menubutton.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
};
