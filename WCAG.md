# WCAG 2.1

Three levels:

- **A** 😒 We should be doing this anyway.
- **AA** 😃 This will be the new law, takes a bit more care.
- **AAA** 😍 God-like accessibility. Even W3C acknowledge that scoring AAA across the board is very difficult.

## 1. Perceivable

### 1.1 Text Alternatives

#### 1.1.1 Non-text Content (Level A)

```html
<img src="/path/to/image" alt="Describe the image">

<figure>
    <img src="/path/to/image" alt="">
    <figcaption>Describe the image</figcaption>
</figure>

<!-- `aria-labelledby` needed for Chrome and Firefox -->
<!-- https://bugs.chromium.org/p/chromium/issues/detail?id=231654 -->
<!-- https://bugzilla.mozilla.org/show_bug.cgi?id=1151648 -->
<svg role="image" aria-labelledby="svg-title">
    <title id="svg-title">Describe the image</title>
</svg>

<iframe src="/path/to/content">
    <!-- Fallback image -->
    <img src="/path/to/image" alt="Describe the image">
</iframe>
```

For an image that purely decorative.

```html
<img src="/path/to/image" alt="">

<svg aria-hidden="true">
    <use xlink:href="#icon-reference"></use>
</svg>

<i class="fa fa-icon" aria-hidden="true"></i>
```

### 1.2 Time-based Media

Ignoring this since we don't tend to do much of it.
Worth knowing that videos should have captions.

**1.2.2 Captions (Prerecorded) (Level A)** - have captions for videos.
**1.2.3 Audio Description of Media Alternative (Prerecorded) (Level A)** - have alt text.

### 1.3 Adaptable

#### 1.3.1 Info and Relationships (Level A)

Use WAI-ARIA landmark roles to identify content area - [`role` attribute](https://www.w3.org/TR/wai-aria/#landmark_roles).

```html
<html>
<body>

    <header role="banner"><!-- Header, logo etc. --></header>
    <nav role="navigation"></nav>
    <div role="alert"><!-- Success / error alerts --></div>
    <section><!-- Hero - note no `role` --></section>
    <main role="main"><!-- Main content --></main>
    <footer role="contentinfo"><!-- Footer, copyright etc. --></footer>

</body>
</html>
```

#### 1.3.2 Meaningful Sequence (Level A)

##### Working with bi-directional text.

Use `&lrm;` and `&rlm;` (Left-Right Mark / Right-Left Mark) when working with bi-directional text.
Here, the exclamation point should be on the left since it's part of the Arabic text. With `&rlm;` we call tell the browser when the direction will change.

```html
<p>The title is "<span lang="ar">مفتاح معايير الويب!</span>" in Arabic.</p>
<p>The title is "<span lang="ar">مفتاح معايير الويب!&rlm;</span>" in Arabic.</p>
```

Use `dir` attribute to correct bi-directional text.

```html
<p>The title is "<span lang="he">פעילות הבינאום, W3C</span>" in Hebrew.</p>
<p>The title is "<span lang="he" dir="rtl">פעילות הבינאום, W3C</span>" in Hebrew.</p>
```

##### Make sure the DOM order and the visual order match.

Consider using [BreakPoints](https://gist.github.com/james-jlo-long/fe69c667463d127063617a2b4d5a54c5) if that needs to change.

```js
var breakpoints = new BreakPoints({
    md: 576
    // ...
});

var nodeToMove = document.querySelector("...");
var parentNode = nodeToMove.closest("...");

function moveNode(matches) {

    if (matches) {
        parentNode.appendChild(nodeToMove);
    } else {
        parentNode.insertBefore(nodeToMove, parentNode.firstChild);
    }

}

breakpoints.on("change", "md", function (e) {
    moveNode(e.detail.matches);
});
moveNode(breakpoints.matches("md"));
```

Pro tip: **don't reorder items using CSS** because the tab order will not be updated. Re-order them in JavaScript instead.

##### Using `tabIndex` to define order.

**Don't do it.** Re-arrange the DOM or you'll be stuck setting the `tabIndex` of _every_ focusable element.
2 exceptions:

```html
<span tabindex="-1">I can gain focus but I'm not in the tab order.</span>
<span tabindex="0">I am part of the natural tab order.</span>
```

And you can set these in JavaScript.

```js
element.tabIndex = -1;
element.tabIndex = 0;
```

#### 1.3.3 Sensory Characteristics (Level A)

Don't just rely on colour/sound/shape for understanding operating content.

```html
<!-- Good examples: -->
<button type="button">Go</button>
<button type="button">Next</button>
<button type="button">Submit</button>
```

#### 1.3.4 Orientation (Level AA)

Content doesn't force the user to see it in a certain orientation (rotating your phone will update the layout).

#### 1.3.5 Identify Input Purpose (Level AA)

Make sure inputs have labels.

```html
<label for="input-id">Descriptive label</label>
<input type="text" id="input-id">

<input type="text" aria-label="Descriptive label">

<p id="text-id">Descriptive text</p>
<input type="text" aria-labelledby="text-id">
```

#### 1.3.6 Identify Purpose (Level AAA)

Make sure the purpose of things like icons can be programmatically determined.

```html
<button type="button" title="Add field">
    <i class="fa fa-plus" aria-hidden="true"></i>
</button>
```

### 1.4 Distinguishable

#### 1.4.1 Use of Colour (Level A)

##### Colour isn't the only visual means for showing information.

```html
<!-- Bad -->
<input type="text">
<input type="text" class="is-error">

<!-- Better -->
<input type="text" aria-invalid="true">

<!-- Best -->
<label for="input-id">Descriptive label</label>
<input type="text" id="input-id" aria-invalid="true" aria-errormessage="error-id">
<label for="input-id" id="error-id">Descriptive error message</label>
```

```css
input.is-error {
    border-color: red;
}

input[aria-invalid="true"] {
    border-color: red;
}
```

```html
<!-- Bad -->
<div role="alert" class="error">Lorem ipsum dolor ...</div>

<!-- Good -->
<div role="alert" class="error">
    <i class="fa fa-warning" aria-label="Warning!"></i>
    Lorem ipsum dolor ...
</div>
```

##### Contrast Ratio

Use a contrast ratio between text and background of at least 3:1 for large text (18px or 14px/bold) and 4.5:1 for normal text (based on luminosity).
(This is mainly one for the designers.)

Rules:

3:1 for Text (A)
4.5:1 for Text (AA - 1.4.4)
7:1 for Text (AAA - 1.4.6)

```css
.bad {
    background-color: #fff;
    color: #f60;
    /* 2.94:1 */
}

.good-for-titles { /* Text: A, Titles: AA */
    background-color: #fff;
    color: #ff6000;
    /* 3.03:1 */
}

.good-for-text { /* Text: AA, Titles: AAA */
    background-color: #fff;
    color: #cc4e00;
    /* 4.51:1 */
}

.awesome-for-text { /* Text: AAA, Titles: AAA */
    background-color: #fff;
    color: #ae1900;
    /* 7.15:1 */
}
```

Logos are exempt from this.

#### 1.4.2 Audio Control (Level A)

If a sound plays for more than 3 seconds, allow the user to pause/stop it.

#### 1.4.3 Contrast (Minimum) (Level AA)

Text should have a contrast of at least 4.5:1 except:

- Large text (18px or 14px/bold) at least 3:1.
- Incidental text (not visible to anyone, pure decoration, part of a picture etc.)
- Logos

#### 1.4.4 Resize text (Level AA)

Should be able to zoom to 200% without loss of functionality.

#### 1.4.5 Images of Text (Level AA)

If we can do it in text instead of images, we should. Except:

- Customisable: Image is customisable to the user's requirements.
- Essential: The presentation of the image is essential to the information being given.

Logos are considered "Essential".
See 1.4.9 for Level AAA standards.

#### 1.4.6 Contrast (Enhanced) (Level AAA)

Text should have a contrast of 7:1 except:

- Large text (18px or 14px/bold) 4.5:1
- Incidental
- Logos

#### 1.4.7 Low or No Background Audio (Level AAA)

If you have background audio that:

1. Contains primarily speech in the foreground
2. is not audio for CAPTCHA and
3. is not vocalisation as expression (singing, rapping etc.)

then make sure at least 1 of the following is true:

- The audio does not contain background sounds.
- The background sounds can be turned off.
- The background sounds are at least 20 dB lower than the foreground (except for occasional sounds lasting for only 1 or 2 seconds).

#### 1.4.8 Visual Presentation (Level AAA)

For a large block of text, the user should be able to do the following:

1. Foreground and background colours can be selected by the user.
2. Width is no more than 80 characters.
3. Text is not justified (aligned to left and right margins).
4. Line spacing is at least 1.5 and paragraph spacing is at least 1.5 times larger.
5. Text can be resized without assistive technology up to 200% without requiring a horizontal scrollbar.

#### 1.4.9 Images of Text (No Exception) (Level AAA)

Images of text should be purely for decoration unless the presentation is essential.
Logos are exceptions.

#### 1.4.10 Reflow (Level AA)

Content can be displayed without loss of functionality or information and without horizontal and vertical scroll bars for:

- Vertical scrolling at a width of 320px.
- Horizontal scrolling at a height of 256px.

Except where two-dimensional scrolling is necessary for usage or meaning.

#### 1.4.11 Non-text Contrast (Level AA)

Have a contrast ratio of at least 3:1 against adjacent colours for:

- User Interface Components (except inactive components or components that are styled through the device not the author).
- Graphical Objects

#### 1.4.12 Text Spacing (Level AA)

If these style properties are supported, no loss of content or functionality should occur if we set the following and change nothing else:

- Line height 1.5 times the font size. (`line-height: 1.5`)
- Spacing following paragraphs at least 2 times the font size. (`margin-bottom: 2em`)
- Letter spacing to at least 0.12 times the font size. (`letter-spacing: 0.12em`)
- Word spacing to at least 0.16 times the font size. (`word-spacing: 0.16em`)

#### 1.4.13 Content on Hover or Focus (Level AA)

If something appears on hover or focus then the following should be true:

- Dismissable: user should be able to dismiss the content without moving the mouse cursor. Exception: error messages or content that doesn't obscure/replace other content.
- Hoverable: user should be able to hover over the content without the content disappearing.
- Persistent: content remains visible until the hover/focus is lost, the user dismisses it or the information is no longer valid.

```html
<!-- Show HoverThing example -->
<script src="./HoverThing.js"></script>
<script>
var hoverThing = new HoverThing(document.querySelector(".js--hover-thing"));
</script>
```

## 2. Operarable

### 2.1 Keyboard Accessible

#### 2.1.1 Keyboard (Level A)

Make widgets that can be used with the keyboard, but don't stop them being used by a mouse.
There are [WAI-ARIA bestpractices](https://www.w3.org/TR/wai-aria-practices-1.1/) that show most generic widgets with mouse and keyboard support.

Some pro tips to make this easier:

- Anchors (`<a>`) and buttons (`<button>`) fire their "click" handler when they have focus and the Enter key is pressed.
- [`e.key` works in everything we need it to](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) and is much easier to remember than `e.which` (some IE mistakes, but they're easy to work with).
- Order of key events: "keydown", "keypress", "keyup". "keypress" can act slightly differently from "keydown"/"keyup" - don't be afraid to swap one for the another if your widget isn't responding correctly.

#### 2.1.2 No Keyboard Trap (Level A)

If pressing tab at the end of a widget takes you to the beginning of the widget rather than the next thing, you've built a keyboard trap.

Modals are exceptions since they _should_ be keyboard traps _and_ closable using the "Esc" key. The focus should be returned to the trigger element and the tabbing can continue as normal.

#### 2.1.3 Keyboard (No Exception) (Level AAA)

All functionality of the content is operable through the keyboard without requiring specific timings for individual keystrokes.

#### 2.1.4 Character Key Shortcuts (Level A)

If you have keyboard shortcuts using only a letter, punctuation, number or symbol character then at least 1 of the following is true:

- You can turn it off.
- You can remap them to use one or more non-printable characters.
- It's only active when a component is focussed.

### 2.2 Enough Time
