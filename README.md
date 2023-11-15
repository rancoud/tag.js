# tag.js

[![Test workflow](https://img.shields.io/github/actions/workflow/status/rancoud/tag.js/test.yml?branch=main)](https://github.com/rancoud/tag.js/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/rancoud/tag.js?logo=codecov)](https://codecov.io/gh/rancoud/tag.js)

JS Tag Manager take care of your tags by validating inputs, use feedbacks and add accessibility.  
Based on the work of [Orange a11y guidelines: Creating accessible "tags" 1/2](https://a11y-guidelines.orange.com/en/articles/tags/) and [Orange a11y guidelines: Creating accessible "tags" 2/2](https://a11y-guidelines.orange.com/en/articles/tags/2/).

## Installation
You need to download the js file from `dist` folder, then you can include it in your HTML at the end of your body.
```html
<script src="/tag.min.js"></script>
```
Then you need to add
```html
<div id="tag-dom"
     data-tag-form-input-id="form-edit-input-tag"
     data-tag-form-textarea-id="form-edit-textarea-tags"
     data-tag-item-class="block__link block__link--delete"
     data-tag-list-id="form-edit-ul-tags"
     data-tag-new-id="form-edit-ul-tags-li-add-tag">
    <ul id="form-edit-ul-tags">
        <li id="form-edit-ul-tags-li-add-tag">
            <input aria-labelledby="form-edit-label-tag" class="form__input" id="form-edit-input-tag" placeholder="Add a new tag" type="text">
        </li>
    </ul>
    <textarea aria-hidden="true" aria-label="List of tags" hidden id="form-edit-textarea-tags" name="form-edit-textarea-tags"></textarea>
</div>
```
```js
var domRoot = document.getElementById("tag-dom");
var err = new Tag(domRoot);
if (err instanceof Error) {
    console.error(err);
}
```
`Tag` accept second optional argument `window.screenReaderSpeak`, you can rely on [screen-reader-speak.js](https://github.com/rancoud/screen-reader-speak.js)

### Data on HTML
#### Mandatory
* `data-tag-form-input-id` input for new tag
* `data-tag-form-textarea-id` textarea where tags are already saved
* `data-tag-list-id` ul HTMLElement
* `data-tag-new-id` li which contains input for new tag

#### Optional
* `data-tag-aria-label` aria label
* `data-tag-srspeak-add` text for screen reader when add new tag
* `data-tag-srspeak-delete` text for screen reader when remove tag
* `data-tag-item-class` css value for tag
* `data-tag-li-class` css value for li
* `data-tag-new-keys` caracters used for separate words

## How to Dev
`npm test` or `docker buildx bake test` to test and coverage  
`npm run build` or `docker buildx bake build` to create dist js file minified  
`npm run jsdoc` or `docker buildx bake jsdoc` to generate documentation  
`npm run eslint` or `docker buildx bake lint` to run eslint  
`npm run eslint:fix` to run eslint and fix files
