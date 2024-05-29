/* global Tag */

require("./screen-reader-speak");

const dateNow = 1479427200000;

jest.useFakeTimers({now: dateNow});

describe("tag", function() {
    beforeEach(function() {
        document.body.innerHTML = ``;

        require("../src/tag");

        jest.clearAllTimers();
    });

    it("should work", () => {
        document.body.innerHTML = `
<div class="form__element"
    data-tag-aria-label="Remove %s from the list"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    data-tag-item-class="block__link block__link--delete"
    data-tag-li-class="tag__item"
    data-tag-list-id="form-edit-ul-tags"
    data-tag-new-id="form-edit-ul-tags-li-add-tag"
    data-tag-new-keys=" |,|Enter"
    data-tag-srspeak-add="%s added"
    data-tag-srspeak-delete="%s deleted"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag).not.toBeInstanceOf(Error);

        const inputObj = document.getElementById("form-edit-input-tag");
        const textareaObj = document.getElementById("form-edit-textarea-tags");
        const listObj = document.getElementById("form-edit-ul-tags");

        const eventKeypress = new Event("keypress");
        eventKeypress.key = " ";

        inputObj.value = "mytag";
        inputObj.dispatchEvent(eventKeypress);

        jest.advanceTimersByTime(100);
        expect(document.body.querySelector("div[aria-live]").textContent).toBe("mytag added");
        jest.advanceTimersByTime(1000);

        let allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(2);
        expect(textareaObj.value).toBe("Cube\nmytag");
        expect(allTags[1].querySelector("button").getAttribute("aria-label")).toBe("Remove mytag from the list");

        allTags[0].querySelector("button").click();
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(1);
        expect(textareaObj.value).toBe("mytag");

        jest.advanceTimersByTime(100);
        expect(document.body.querySelector("div[aria-live]").textContent).toBe("Cube deleted");
        jest.advanceTimersByTime(1000);

        inputObj.value = "      ";
        inputObj.dispatchEvent(eventKeypress);
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(1);
        expect(textareaObj.value).toBe("mytag");

        inputObj.value = "   abc   ";
        inputObj.dispatchEvent(eventKeypress);
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(2);
        expect(textareaObj.value).toBe("mytag\nabc");

        listObj.click();
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(2);
        expect(textareaObj.value).toBe("mytag\nabc");

        jest.clearAllTimers();
    });

    it("should return error on attribute data-tag-form-input-id", () => {
        document.body.innerHTML = `
<div class="form__element"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag).toBeInstanceOf(TypeError);
        expect(tag.message).toBe("Invalid attribute data-tag-form-input-id, expect string, get object");

        document.body.innerHTML = `
<div class="form__element"
    data-tag-form-input-id="form-edit-input-tag"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag2 = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag2).toBeInstanceOf(Error);
        expect(tag2.message).toBe("DOM element form-edit-input-tag not found");
    });

    it("should return error on attribute data-tag-form-textarea-id", () => {
        document.body.innerHTML = `
<div class="form__element"
    data-tag-form-input-id="form-edit-input-tag"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag).toBeInstanceOf(TypeError);
        expect(tag.message).toBe("Invalid attribute data-tag-form-textarea-id, expect string, get object");

        document.body.innerHTML = `
<div class="form__element"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag2 = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag2).toBeInstanceOf(Error);
        expect(tag2.message).toBe("DOM element form-edit-textarea-tags not found");
    });

    it("should return error on attribute data-tag-list-id", () => {
        document.body.innerHTML = `
<div class="form__element"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag).toBeInstanceOf(TypeError);
        expect(tag.message).toBe("Invalid attribute data-tag-list-id, expect string, get object");

        document.body.innerHTML = `
<div class="form__element"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    data-tag-list-id="form-edit-ul-tags"
    id="tag-dom">
    <ul class="tag__items">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag2 = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag2).toBeInstanceOf(Error);
        expect(tag2.message).toBe("DOM element form-edit-ul-tags not found");
    });

    it("should return error on attribute data-tag-new-id", () => {
        document.body.innerHTML = `
<div class="form__element"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    data-tag-list-id="form-edit-ul-tags"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag).toBeInstanceOf(TypeError);
        expect(tag.message).toBe("Invalid attribute data-tag-new-id, expect string, get object");

        document.body.innerHTML = `
<div class="form__element"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    data-tag-list-id="form-edit-ul-tags"
    data-tag-new-id="form-edit-ul-tags-li-add-tag"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag2 = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag2).toBeInstanceOf(Error);
        expect(tag2.message).toBe("DOM element form-edit-ul-tags-li-add-tag not found");
    });

    it("should return error on attribute data-tag-aria-label", () => {
        document.body.innerHTML = `
<div class="form__element"
    data-tag-aria-label="aze"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    data-tag-item-class="block__link block__link--delete"
    data-tag-li-class="tag__item"
    data-tag-list-id="form-edit-ul-tags"
    data-tag-new-id="form-edit-ul-tags-li-add-tag"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag).toBeInstanceOf(Error);
        expect(tag.message).toBe(`Attribute data-tag-aria-label missing "%s"`);
    });

    it("should return error on attribute data-tag-srspeak-add", () => {
        document.body.innerHTML = `
<div class="form__element"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    data-tag-item-class="block__link block__link--delete"
    data-tag-li-class="tag__item"
    data-tag-list-id="form-edit-ul-tags"
    data-tag-new-id="form-edit-ul-tags-li-add-tag"
    data-tag-srspeak-add="aze"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag).toBeInstanceOf(Error);
        expect(tag.message).toBe(`Attribute data-tag-srspeak-add missing "%s"`);
    });

    it("should return error on attribute data-tag-srspeak-delete", () => {
        document.body.innerHTML = `
<div class="form__element"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    data-tag-item-class="block__link block__link--delete"
    data-tag-li-class="tag__item"
    data-tag-list-id="form-edit-ul-tags"
    data-tag-new-id="form-edit-ul-tags-li-add-tag"
    data-tag-srspeak-delete="aze"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag).toBeInstanceOf(Error);
        expect(tag.message).toBe(`Attribute data-tag-srspeak-delete missing "%s"`);
    });

    it("should work (minimum options)", () => {
        document.body.innerHTML = `
<div class="form__element"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    data-tag-list-id="form-edit-ul-tags"
    data-tag-new-id="form-edit-ul-tags-li-add-tag"
    data-tag-li-class="tag__item"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag).not.toBeInstanceOf(Error);

        const inputObj = document.getElementById("form-edit-input-tag");
        const textareaObj = document.getElementById("form-edit-textarea-tags");
        const listObj = document.getElementById("form-edit-ul-tags");

        const eventKeypress = new Event("keypress");
        eventKeypress.key = ",";

        inputObj.value = "mytag";
        inputObj.dispatchEvent(eventKeypress);

        jest.advanceTimersByTime(100);
        expect(document.body.querySelector("div[aria-live]").textContent).toBe("mytag added");
        jest.advanceTimersByTime(1000);

        let allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(2);
        expect(textareaObj.value).toBe("Cube\nmytag");
        expect(allTags[1].querySelector("button").getAttribute("aria-label")).toBe("Remove mytag from the list");

        allTags[0].querySelector("button").click();
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(1);
        expect(textareaObj.value).toBe("mytag");

        jest.advanceTimersByTime(100);
        expect(document.body.querySelector("div[aria-live]").textContent).toBe("Cube deleted");
        jest.advanceTimersByTime(1000);

        inputObj.value = "      ";
        inputObj.dispatchEvent(eventKeypress);
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(1);
        expect(textareaObj.value).toBe("mytag");

        inputObj.value = "   abc   ";
        inputObj.dispatchEvent(eventKeypress);
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(2);
        expect(textareaObj.value).toBe("mytag\nabc");

        listObj.click();
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(2);
        expect(textareaObj.value).toBe("mytag\nabc");

        jest.clearAllTimers();
    });

    it("should work (full options)", () => {
        document.body.innerHTML = `
<div class="form__element"
    data-tag-aria-label="Suppression du tag %s de la liste"
    data-tag-form-input-id="form-edit-input-tag"
    data-tag-form-textarea-id="form-edit-textarea-tags"
    data-tag-item-class="myclass_1 myclass_2"
    data-tag-li-class="tag__item"
    data-tag-list-id="form-edit-ul-tags"
    data-tag-new-id="form-edit-ul-tags-li-add-tag"
    data-tag-new-keys="8"
    data-tag-srspeak-add="Ajout du tag %s"
    data-tag-srspeak-delete="Suppression du tag %s"
    id="tag-dom">
    <ul class="tag__items" id="form-edit-ul-tags">
        <li class="tag__item"><span class="sr-only">Cube</span><button aria-label="Remove Cube from the list" class="block__link block__link--delete">Cube</button></li>
        <li class="tag__add" id="form-edit-ul-tags-li-add-tag">
            <div class="form__element">
                <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
            </div>
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags">Cube</textarea>
</div>`;

        const tag = new Tag(document.getElementById("tag-dom"), window.screenReaderSpeak);
        expect(tag).not.toBeInstanceOf(Error);

        const inputObj = document.getElementById("form-edit-input-tag");
        const textareaObj = document.getElementById("form-edit-textarea-tags");
        const listObj = document.getElementById("form-edit-ul-tags");

        const eventKeypress = new Event("keypress");
        eventKeypress.key = "8";

        inputObj.value = "mytag";
        inputObj.dispatchEvent(eventKeypress);

        jest.advanceTimersByTime(100);
        expect(document.body.querySelector("div[aria-live]").textContent).toBe("Ajout du tag mytag");
        jest.advanceTimersByTime(1000);

        let allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(2);
        expect(textareaObj.value).toBe("Cube\nmytag");
        expect(allTags[1].querySelector("button").getAttribute("aria-label")).toBe("Suppression du tag mytag de la liste");

        allTags[0].querySelector("button").click();
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(1);
        expect(textareaObj.value).toBe("mytag");

        jest.advanceTimersByTime(100);
        expect(document.body.querySelector("div[aria-live]").textContent).toBe("Suppression du tag Cube");
        jest.advanceTimersByTime(1000);

        inputObj.value = "      ";
        inputObj.dispatchEvent(eventKeypress);
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(1);
        expect(textareaObj.value).toBe("mytag");

        inputObj.value = "   abc   ";
        inputObj.dispatchEvent(eventKeypress);
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(2);
        expect(textareaObj.value).toBe("mytag\nabc");

        listObj.click();
        allTags = listObj.querySelectorAll("li.tag__item");
        expect(allTags.length).toBe(2);
        expect(textareaObj.value).toBe("mytag\nabc");

        jest.clearAllTimers();
    });
});
