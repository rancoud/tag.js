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
        {name: "data-tag-form-input-id", optionName: "inputObj"},
        {name: "data-tag-form-textarea-id", optionName: "textareaObj"},
        {name: "data-tag-list-id", optionName: "listObj"},
        {name: "data-tag-new-id", optionName: "newObj"}
    ];
    var arias = [
        {name: "data-tag-aria-label", defaultValue: "Remove %s from the list", optionName: "ariaLabel"},
        {name: "data-tag-srspeak-add", defaultValue: "%s added", optionName: "srSpeakAdd"},
        {name: "data-tag-srspeak-delete", defaultValue: "%s deleted", optionName: "srSpeakDelete"}
    ];

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
