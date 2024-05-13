/**
 * tag.js (v1.0.0)
 * https://github.com/rancoud/tag.js
 * 
 * MIT License
 * 
 * Copyright (c) 2023 Rancoud
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function () {
  "use strict";

  /**
   * Options for TagManager created by Tag.
   *
   * @typedef  Options
   * @property {HTMLElement}         inputObj      - input for new tag
   * @property {HTMLTextAreaElement} textareaObj   - tags already saved
   * @property {HTMLUListElement}    listObj       - ul HTMLElement
   * @property {HTMLElement}         newObj        - li which contains input for new tag
   * @property {string}              ariaLabel     - aria label
   * @property {string}              srSpeakAdd    - text for screen reader when add new tag
   * @property {string}              srSpeakDelete - text for screen reader when remove tag
   * @property {string}              itemClass     - css value for tag
   * @property {string}              liClass       - css value for li
   * @property {string[]}            keys          - caracter used for separate words
   * @property {object}              events        - events binding
   * @property {Function}            speakFn       - screen-reader-speak function
   */

  /* global Options */
  /**
   * Get HTML Element.
   *
   * @param {string} attributeName - attribute name
   * @param {string} elementID     - id
   * @returns {(TypeError|Error|HTMLElement)}
   */
  function getHTMLElement(attributeName, elementID) {
    /** @type {(HTMLElement|null)} */
    var htmlElementObject;

    if (typeof elementID !== "string") {
      return new TypeError("Invalid attribute " + attributeName + ", expect string, get " + typeof elementID);
    }

    htmlElementObject = document.getElementById(elementID);
    if (!htmlElementObject) {
      return new Error("DOM element " + elementID + " not found");
    }

    return htmlElementObject;
  }

  /**
   * Tag is mean to check attributes and options and create Tag Manager instance.
   *
   * @class Tag
   * @param {HTMLElement} rootDom                     - rootDom
   * @param {Function}    [screenReaderSpeakFunction] - screenReaderSpeak Function
   * @returns {(Error|undefined)}
   */
  function Tag(rootDom, screenReaderSpeakFunction) {
    /** @type {number} */
    var idx = 0;
    /** @type {number} */
    var len;
    /** @type {(TypeError|Error|HTMLElement)} */
    var htmlElementObject;
    /** @type {(string|null)} */
    var attributeValue;
    /** @type {Options} */
    var options = {
      inputObj: null,
      textareaObj: null,
      listObj: null,
      newObj: null,
      ariaLabel: "",
      srSpeakAdd: "",
      srSpeakDelete: "",
      itemClass: "",
      liClass: "",
      keys: null,
      events: null,
      speakFn: null
    };
    var mandatoryHTMLElement = [
    { name: "data-tag-form-input-id", optionName: "inputObj" },
    { name: "data-tag-form-textarea-id", optionName: "textareaObj" },
    { name: "data-tag-list-id", optionName: "listObj" },
    { name: "data-tag-new-id", optionName: "newObj" }];

    var arias = [
    { name: "data-tag-aria-label", defaultValue: "Remove %s from the list", optionName: "ariaLabel" },
    { name: "data-tag-srspeak-add", defaultValue: "%s added", optionName: "srSpeakAdd" },
    { name: "data-tag-srspeak-delete", defaultValue: "%s deleted", optionName: "srSpeakDelete" }];


    if (!(rootDom instanceof HTMLElement)) {
      return Error("error");
    }

    for (len = mandatoryHTMLElement.length; idx < len; ++idx) {
      htmlElementObject = getHTMLElement(mandatoryHTMLElement[idx].name, rootDom.getAttribute(mandatoryHTMLElement[idx].name) || null);
      if (!(htmlElementObject instanceof HTMLElement)) {
        return htmlElementObject;
      }

      options[mandatoryHTMLElement[idx].optionName] = htmlElementObject;
    }

    for (idx = 0, len = arias.length; idx < len; ++idx) {
      attributeValue = rootDom.getAttribute(arias[idx].name) || arias[idx].defaultValue;
      if (attributeValue.indexOf("%s") === -1) {
        return new Error("Attribute " + arias[idx].name + " missing \"%s\"");
      }

      options[arias[idx].optionName] = attributeValue;
    }

    options.itemClass = rootDom.getAttribute("data-tag-item-class") || "";
    options.liClass = rootDom.getAttribute("data-tag-li-class") || "";

    attributeValue = rootDom.getAttribute("data-tag-new-keys") || ",";
    options.keys = attributeValue.split("|");

    if (typeof screenReaderSpeakFunction === "function") {
      options.speakFn = screenReaderSpeakFunction;
    } else if (screenReaderSpeakFunction !== undefined) {
      return new Error();
    }

    // eslint-disable-next-line no-new
    new TagManager(rootDom, options);
  }

  /**
   * TagManager.
   *
   * @class TagManager
   * @param {HTMLElement} rootDom - rootDom
   * @param {Options}     options - options
   * @returns {undefined}
   */
  function TagManager(rootDom, options) {
    /** @type {Options} */
    this.options = options;

    this.options.events = {
      keypress: this.tryToAddTagOnKeypress.bind(this),
      click: this.tryToDeleteTag.bind(this)
    };

    this.options.inputObj.addEventListener("keypress", this.options.events.keypress);
    this.options.listObj.addEventListener("click", this.options.events.click);
  }

  TagManager.prototype.tryToAddTagOnKeypress = function tryToAddTagOnKeypress(event) {
    /** @type {number} */
    var idxKeys = 0;
    /** @type {number} */
    var maxKeys = this.options.keys.length;

    for (; idxKeys < maxKeys; ++idxKeys) {
      /* istanbul ignore else */
      if (this.options.keys[idxKeys] === event.key) {
        this.add(event.target.value.trim());

        event.target.value = "";
        event.preventDefault();

        break;
      }
    }
  };

  TagManager.prototype.tryToDeleteTag = function tryToDeleteTag(event) {
    /** @type {(HTMLElement|null)} */
    var btn;

    event.preventDefault();

    btn = event.target.closest("button");
    if (btn === null) {
      return;
    }

    this.remove(btn.parentElement, btn.textContent);
  };

  TagManager.prototype.add = function add(text) {
    /** @type {Text} */
    var textNode;
    /** @type {HTMLLIElement} */
    var li;
    /** @type {HTMLSpanElement} */
    var span;
    /** @type {HTMLButtonElement} */
    var button;

    textNode = document.createTextNode(text);
    if (textNode.textContent === "") {
      return;
    }

    li = document.createElement("li");
    li.setAttribute("class", this.options.liClass);

    span = document.createElement("span");
    span.classList.add("sr-only");
    span.appendChild(document.createTextNode(text));

    button = document.createElement("button");
    button.setAttribute("aria-label", this.options.ariaLabel.replace("%s", textNode.textContent));
    button.setAttribute("class", this.options.itemClass);
    button.appendChild(document.createTextNode(text));

    li.appendChild(span);
    li.appendChild(button);

    this.options.listObj.insertBefore(li, this.options.newObj);

    if (this.options.speakFn !== null) {
      this.options.speakFn.call(window, this.options.srSpeakAdd.replace("%s", textNode.textContent));
    }

    this.refreshTextarea();
  };

  TagManager.prototype.remove = function remove(tagObj, text) {
    /** @type {Text} */
    var textNode = document.createTextNode(text);

    tagObj.remove();

    if (this.options.speakFn !== null) {
      this.options.speakFn.call(window, this.options.srSpeakDelete.replace("%s", textNode.textContent));
    }

    this.refreshTextarea();
  };

  TagManager.prototype.refreshTextarea = function refreshTextarea() {
    /** @type {string[]} */
    var text = [];
    /** @type {Element[]} */
    var tags = this.options.listObj.querySelectorAll(".sr-only");
    /** @type {number} */
    var idxTags = 0;
    /** @type {number} */
    var maxTags = tags.length;

    for (; idxTags < maxTags; ++idxTags) {
      text.push(tags[idxTags].textContent);
    }

    this.options.textareaObj.value = text.join("\n");
  };

  Object.freeze(Tag.prototype);
  Object.freeze(Tag);

  window.Tag = Tag;

})();