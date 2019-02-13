# WCAG 2.1

Three levels:

- **A** 😒 We should be doing this anyway.
- **AA** 😃 This will be the new law, takes a bit more care.
- **AAA** 😍 God-like accessibility. Even W3C acknowledge that scoring AAA across the board is very difficult.

## 1. Perceivable

Present things in a way that users can perceive.

### 1.1 Text Alternatives

Provide text-alternatives for non-text thngs.

#### 1.1.1 Non-text Content - Level A

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

Provide alternatives for time-based media.

#### 1.2.1 Audio-only and Video-only - Level A

For pre-recorded audio-only or video-only, the following are true unless the audio/video is an alternative for existing text:

- **Pre-recorded Audio-only**: an alternative is provided that has the same content.
- **Pre-recorded Video-only**: either an alternative or an audio track with the same content.

#### 1.2.2 Captions (Pre-recorded) - Level A

Captions are provided for all pre-recorded audio unless it's an alternative for text and clearly labelled.

#### 1.2.3 Audio Description or Media Alternative (Pre-recorded) - Level A

Alternative text or audio description of the video is provided unless the video is an alternative for text and clearly labelled.

#### 1.2.4 Captions (Live) - Level AA

Captions are provided for live streams in synchronised media.

#### 1.2.5 Audio Description (Pre-recorded) - Level AA

Provide an audio description for all pre-recorded video content in synchronised media.

#### 1.2.6 Sign Language (Pre-recorded) - Level AAA

Sign language is provided for all pre-recorded audio content in synchronised media.

#### 1.2.7 Extended Audio Description - Level AAA

Provide audio description like **1.2.5 (AA)** but pause the main media when necessary to provide full description.

#### 1.2.8 Media Alternative (Pre-recorded) - Level AAA

Provide an alternative for all pre-recorded time-based media (video and audio).

#### 1.2.9 Audio-only (Live) - Level AAA

Have live captioning of live audio.

This probably involves a human operator listening to the live audio and using a special keyboard to enter the text with only a minimal delay.

### 1.3 Adaptable

Allow content to be presented in different ways / layouts without losing content.

#### 1.3.1 Info and Relationships - Level A

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

#### 1.3.2 Meaningful Sequence - Level A

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

breakpoints.on("change", "md", function (e) {

    if (e.detail.matches) {
        parentNode.appendChild(nodeToMove);
    } else {
        parentNode.insertBefore(nodeToMove, parentNode.firstChild);
    }

}, true);
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

#### 1.3.3 Sensory Characteristics - Level A

Don't just rely on colour/sound/shape for understanding operating content.

```html
<!-- Good examples: -->
<button type="button">Go</button>
<button type="button">Next</button>
<button type="button">Submit</button>
```

#### 1.3.4 Orientation - Level AA

Content doesn't force the user to see it in a certain orientation (rotating your phone will update the layout).

#### 1.3.5 Identify Input Purpose - Level AA

Make sure inputs have labels.

```html
<label for="input-id">Descriptive label</label>
<input type="text" id="input-id">

<input type="text" aria-label="Descriptive label">

<p id="text-id">Descriptive text</p>
<input type="text" aria-labelledby="text-id">
```

#### 1.3.6 Identify Purpose - Level AAA

Make sure the purpose of things like icons can be programmatically determined.

```html
<button type="button" title="Add field">
    <i class="fa fa-plus" aria-hidden="true"></i>
</button>
```

### 1.4 Distinguishable

Make it easy for users to tell the difference between foreground and background.

#### 1.4.1 Use of Colour - Level A

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

###### Rules:

- 3:1 for Text (A)
- 4.5:1 for Text (AA - 1.4.4)
- 7:1 for Text (AAA - 1.4.6)

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

#### 1.4.2 Audio Control - Level A

If a sound plays for more than 3 seconds, allow the user to pause/stop it.

#### 1.4.3 Contrast (Minimum) - Level AA

Text should have a contrast of at least 4.5:1 except:

- Large text (18px or 14px/bold) at least 3:1.
- Incidental text (not visible to anyone, pure decoration, part of a picture etc.)
- Logos

#### 1.4.4 Resize text - Level AA

Should be able to zoom to 200% without loss of functionality.

#### 1.4.5 Images of Text - Level AA

If we can do it in text instead of images, we should. Except:

- Customisable: Image is customisable to the user's requirements.
- Essential: The presentation of the image is essential to the information being given.

Logos are considered "Essential".
See **1.4.9 (AAA)** for Level AAA standards.

#### 1.4.6 Contrast (Enhanced) - Level AAA

Text should have a contrast of 7:1 except:

- Large text (18px or 14px/bold) 4.5:1
- Incidental
- Logos

#### 1.4.7 Low or No Background Audio - Level AAA

If you have background audio that:

1. Contains primarily speech in the foreground
2. is not audio for CAPTCHA and
3. is not vocalisation as expression (singing, rapping etc.)

then make sure at least 1 of the following is true:

- The audio does not contain background sounds.
- The background sounds can be turned off.
- The background sounds are at least 20 dB lower than the foreground (except for occasional sounds lasting for only 1 or 2 seconds).

#### 1.4.8 Visual Presentation - Level AAA

For a large block of text, the user should be able to do the following:

1. Foreground and background colours can be selected by the user.
2. Width is no more than 80 characters.
3. Text is not justified (aligned to left and right margins).
4. Line spacing is at least 1.5 and paragraph spacing is at least 1.5 times larger.
5. Text can be resized without assistive technology up to 200% without requiring a horizontal scrollbar.

#### 1.4.9 Images of Text (No Exception) - Level AAA

Images of text should be purely for decoration unless the presentation is essential.
Logos are exceptions.

#### 1.4.10 Reflow - Level AA

Content can be displayed without loss of functionality or information and without horizontal and vertical scroll bars for:

- Vertical scrolling at a width of 320px.
- Horizontal scrolling at a height of 256px.

Except where two-dimensional scrolling is necessary for usage or meaning.

#### 1.4.11 Non-text Contrast - Level AA

Have a contrast ratio of at least 3:1 against adjacent colours for:

- User Interface Components (except inactive components or components that are styled through the device not the author).
- Graphical Objects

#### 1.4.12 Text Spacing - Level AA

If these style properties are supported, no loss of content or functionality should occur if we set the following and change nothing else:

- Line height 1.5 times the font size. (`line-height: 1.5`)
- Spacing following paragraphs at least 2 times the font size. (`margin-bottom: 2em`)
- Letter spacing to at least 0.12 times the font size. (`letter-spacing: 0.12em`)
- Word spacing to at least 0.16 times the font size. (`word-spacing: 0.16em`)

#### 1.4.13 Content on Hover or Focus - Level AA

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

## 2. Operable

Users must be able to operate the UI and/or navigation.

### 2.1 Keyboard Accessible

Make functionality available from the keyboard.

#### 2.1.1 Keyboard - Level A

Make widgets that can be used with the keyboard, but don't stop them being used by a mouse.
There are [WAI-ARIA bestpractices](https://www.w3.org/TR/wai-aria-practices-1.1/) that show most generic widgets with mouse and keyboard support.

Some pro tips to make this easier:

- Anchors (`<a>`) and buttons (`<button>`) fire their "click" handler when they have focus and the Enter key is pressed.
- [`e.key` works in everything we need it to](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) and is much easier to remember than `e.which` (some IE mistakes, but they're easy to work with).
- Order of key events: "keydown", "keypress", "keyup". "keypress" can act slightly differently from "keydown"/"keyup" - don't be afraid to swap one for the another if your widget isn't responding correctly.

Warning: this also needs to work with custom UI elements (input boxes, radio buttons, dropdowns etc.) See the [form element test page](form-elements.html). (Fun fact: [multiple select by keyboard isn't possible](https://bugs.chromium.org/p/chromium/issues/detail?id=125585))

#### 2.1.2 No Keyboard Trap - Level A

If pressing tab at the end of a widget takes you to the beginning of the widget rather than the next thing, you've built a keyboard trap.

Modals are exceptions since they _should_ be keyboard traps _and_ closable using the "Esc" key. The focus should be returned to the trigger element and the tabbing can continue as normal.

#### 2.1.3 Keyboard (No Exception) - Level AAA

All functionality of the content is operable through the keyboard without requiring specific timings for individual keystrokes.

#### 2.1.4 Character Key Shortcuts - Level A

If you have keyboard shortcuts using only a letter, punctuation, number or symbol character then at least 1 of the following is true:

- You can turn it off.
- You can remap them to use one or more non-printable characters.
- It's only active when a component is focussed.

### 2.2 Enough Time

Give users enough time to absorb the content.

#### 2.2.1 Timing Adjustable - Level A

If you have content that changes after a set time, at least one of the following is true:

- User can turn off the time limit.
- User can adjust the time limit up to 10 times the default.
- User is warned at least 20 seconds before the change and allowed to extend.
- The time limit is part of a real-time event and there is no alternative (eg: auction).
- The time limit is essential and extending would invalidate the activity.
- The time limit is more than 20 hours.

Pro tip: focus on autoplay carousel to pause the scrolling.

#### 2.2.2 Pause, Stop, Hide - Level A

Blinking, moving, scrolland or auto-updating information, all of the following are true:

- Moving, blinking, scrolling: where it **starts automatically**, **lasts more than 5 seconds** and **presented in parallel with other content** then let the user pause, stop or hide it.
- Auto-updating that **starts automatically** **presented in parallel with other content** then let the user pause, stop or hide or control the frequency of the updates.

This is for things like Twitter feeds rather than things like the `<blink>` tag.

#### 2.2.3 No Timing - Level AAA

Timing is not an essential part except for synchronised media and real-time events.

#### 2.2.4 Interruptions - Level AAA

Interruptions can be postponed or suppressed by the user unless in an emergency.

`aria-live="assertive"` for an emergency.
`aria-live="polite"` or `aria-live="off"` for other things.

#### 2.2.5 Re-authenticating - Level AAA

When the session expires, the user can continue without loss of data after re-authenticating.

#### 2.2.6 Timeouts - Level AAA

Warn user if inactivity could cause loss of data, unless the data is preserved for more than 20 hours.

### 2.3 Seizures and Physical Reactions

Don't do things that'll give people seizures and/or physical reactions.

#### 2.3.1 Three Flashes or Below Threshold - Level A

Don't make something flash more than three times a second.

#### 2.3.2 Three Flashes - Level AAA

Don't make anything that flashes more than three times a second.

#### 2.3.3 Animation from Interactions - Level AAA

Motion animation triggered by interaction can be disabled unless it's essential.

```css
@media screen and (prefers-reduced-motion) {
    .my-element {
        transition: none;
    }
}
```

A couple of interesting posts:

- [Toggle animation (CSS custom properties)](https://www.kirupa.com/html5/toggling_animations_on_off.htm)
- [Introduction to the Reduced Motion Media Query](https://css-tricks.com/introduction-reduced-motion-media-query/)

### 2.4 Navigable

Make it easy for people to navigate your site and work out where they are.

#### 2.4.1 Bypass Blocks - Level A

Allow users to bypass content that's repeated on multiple web pages.

Tricks include:

- "Skip to content" links.
- ARIA landmarks.
- Collapsed elements.

"Skip to content" links don't have to be initially visible. We do this on Digigraphie:

```html
<html>
<!-- head ... -->
<body>
<ul class="nav-access" aria-label="Short-cuts">
    <li><a href="#main-content" class="nav-access__link">Skip to main content</a></li>
</ul>
<!-- header, nav, hero ... -->
<main id="main-content" role="main" tabindex="-1" aria-label="Main content">
    <!-- ... -->
</main>
<!-- teasers, footer ... -->
</body>
</html>
```

```css
.nav-access {
    left: 0;
    position: absolute;
    top: -20rem;
    width: 100%;
    z-index: 1070; /* same as a tooltip - on top of everything */
}

.nav-access__link {

    /*
    @extend .btn;
    @extend .btn-torange;
    @extend .btn-block;
    */

    left: 0;
    position: absolute;
    top: 0;

}

.nav-access__link:focus {
    top: 20rem;
}
```

[Bootstrap 4 has classes to do this.](https://getbootstrap.com/docs/4.2/utilities/screenreaders/)

```html
<a class="sr-only sr-only-focusable" href="#content">Skip to main content</a>
```

It works by changing `position:absolute` to `position:static` so it might affect general layout - be sure to test or wrap the link in a `position:absolute` parent.

#### 2.4.2 Page Titles - Level A

Make sure pages have a `<title>` tag.

```html
<html>
<head>
    <title>My page</title>
    <!-- ... -->
</head>
<body>
<!-- ... -->
</body>
</html>
```

#### 2.4.3 Focus Order - Level A

Make sure the focus order (`tabIndex`) matches the visual order.

#### 2.4.4 Link Purpose (In Context) - Level A

The purpose of each link can be determined from the link text (and programmatically determined link context) alone. Exception: link is intentionally ambiguous.

```html
<!-- BAD examples -->
<a href="...">Click here</a>
<a href="...">Find out more</a>
<button type="button">Buy now</button>

<!-- GOOD examples -->
<a href="...">Click here to contact us</a>
<a href="...">Find out more <span class="sr-only">about the SuperProduct 2000</span></a>
<button type="button" aria-label="Add the SuperProduct 2000 to your shopping cart">Buy now</button>
```

Bootstrap `sr-only` class (makes content visible to screen readers but not to sighted users):

```css
/* v4.3 */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

#### 2.4.5 Multiple Ways - Level AA

More than one way to get to a web page within a set of pages. Exception: page is a step or part of a larger process (paginated link, checkout step etc.).

Ways we can achieve this:

- Sitemap.
- Site search.
- Table of contents.
- Links like previous/next article.

We don't need every technique, different techniques will be appropriate to different websites.

#### 2.4.6 Headings and Labels - Level AA

Headings and labels should be descriptive.

```html
<!-- BAD examples -->
<h1>Page</h1>
<h2>Product</h2>

<!-- GOOD examples -->
<h1>Contact Us</h1>
<h2>Acme SuperProduct 2000</h2>
```

#### 2.4.7 Focus Visible - Level AA

Users should be able to tell which element is focused when using a keyboard.

Things we can do to make that happen:

- Don't add `outline: none;` to the style sheet (unless there's something else to identify the element on focus).
- Making sure links (and buttons etc.) have `:hover` _and_ `:focus` styles.
    ```css
    a:hover,
    a:focus {
        /* ... */
    }
    ```

A keyboard-only visible focus:

```css
/* https://twitter.com/leaverou/status/1045768279753666562?lang=en */
:focus:not(:focus-visible) {
    outline: none;
}
```

For older browsers:

```html
<a href="..." class="my-link">
    <span class="my-link__focus-hider" tabindex="-1">
        Click here to go somewhere
    </span>
</a>
```

```css
.my-link {
    /* No padding, no border */
}

.my-link:focus {
    outline: 2px solid pink;
}

.my-link__focus-hider {
    padding: 1em;
    width: 100%;
    height: 100%;
}
/* no `.my-link__focus-hider:focus` styles */
```

If `.my-link` has padding, `.my-link__focus-hider` needs corresponding negative margin and padding. This is much more fiddly than simply avoiding padding on `.my-link`.

```css
.my-link {
    padding: 1em;
}

.my-link__focus-hider {
    margin: -1em;
    padding: 1em;
}
```

Has the minor side-effect of tabbing backwards from the `focus-hider` will select the parent link instead of the previous one.

#### 2.4.8 Location - Level AAA

Let users know where they are within a set of web pages.

For example:

- Site map.
- Breadcrumb trail.
- Highlighted link (for example: in a sidebar).

We don't need all of these techniques - different techniques work for different websites.

```html
<nav aria-label="Breadcrumbs">
    <h2>You are here:</h2>
    <ul>
        <li><a href="/">Acme Company</a> &#8594;</li>
        <li><a href="/electronics/">Electronics</a> &#8594;</li>
        <li><a href="/electronics/computers/">Computers</a> &#8594;</li>
        <li>Laptops</li>
    </ul>
</nav>
```

(`&#8594;` renders as a right-pointing arrow →)

Protip for highlighted link: use `aria-current` instead of an "active" class.

```html
<!-- Was: -->
<ul>
    <li><a href="...">Computers</a></li>
    <li><a href="..." class="active">Games Consoles</a></li>
    <li><a href="...">Music Players</a></li>
    <li><a href="...">Televisions</a></li>
</ul>

<!-- Now: -->
<ul>
    <li><a href="...">Computers</a></li>
    <li><a href="..." aria-current="page">Games Consoles</a></li>
    <li><a href="...">Music Players</a></li>
    <li><a href="...">Televisions</a></li>
</ul>
```

```css
/* Was */
.breadcrumb .active { /* ... */ }

/* Now */
.breadcrumb [aria-current="page"] { /* ... */ }
```

#### 2.4.9 Link Purpose (Link Only) - Level AAA

Make sure that links can be identified from link text alone.

See **2.4.4 (A)** for examples

#### 2.4.10 Section Headings - Level AAA

Use section headings to organise the content.

### 2.5 Input Modalities

Make it easy for users to use your site with any input device they prefer.

#### 2.5.1 Pointer Gestures - Level A

Inputs that require multipoint of path-based gestures ("stretch to zoom" etc.) should be available through single pointer gestures ("click to zoom" etc.).

#### 2.5.2 Pointer Cancellation - Level A

It should be possible to cancel a single pointer gesture. For any single pointer functionality, at least one of the following is true:

- No Down Event: "mousedown" and "keydown" aren't used to execute things.
- Abort or Undo: The user can abort the operation or undo the action.
- Up Reversal: the "mouseup" or "keyup" would abort or undo the related "mousedown" or "keydown" action.
- Essential: there's no alternative.

Protip: "click" events only trigger when "mousedown" and "mouseup" happen on the same element - dragging the cursor off the link/button before releasing would abort the action. Typing in an input field doesn't count ("essential").

#### 2.5.3 Label in Name - Level A

UI components with labels should contain the text that's presented visually.

Just use sensible labels. Things like an `aria-label` replacement for "buy now" should probably start with "buy now" etc.

#### 2.5.4 Motion Actuation - Level A

Any functionality that can be operated by device motion or user motion can also be operated by user interface. Exceptions:

- Supported Interface: the motions is used to operate functionality through and accessibility suported interface.
- Essential: no other options.

Good examples: iPhone's "shake to undo" feature is complemented by the delete button on its virtual keyboard.

#### 2.5.5 Target Size - Level AAA

The thing you're clicking/tapping should be at least 44 x 44 pixels. Exceptions:

- Equivalent: there's an equivalent that's large enough.
- Inline: it's inline with a block of text (links etc.)
- User Agent Control: the size is determined by the user agent (checkboxes etc.)
- Essential: the size is essential to the information being conveyed.

#### 2.5.6 Concurrent Input Mechanisms - Level AAA

The web doesn't limit the use of different input mechanisms. For example: a mouse and/or keyboard can be used to navigate a website.

## 3 Understandable

Users must be able to understand your site.

### 3.1 Readable

Make text content readable and understandable.

#### 3.1.1 Language of Page - Level A

Make sure the language of the page can be programmatically determined.

```html
<!-- HTML 5 -->
<!doctype html>
<html lang="fr">

<!-- XHTML 1.1 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
   "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr">
```

For "XHTML transitional" use `xml:lang` and `lang` attributes.

The format should be a lower-case ISO2 code.

```html
<html lang="en">
<html lang="fr">
<html lang="da">
<html lang="el">
```

The script subtag can also be added to define the script that's being used.

```html
<html lang="ja-Kana"><!-- Japanese written in Katakana -->
<html lang="ru-Cyrl"><!-- Russian written in Cyrillic -->
```

The region subtag can be added. It's usually the ISO2 code for the country in upper-case but not always.

```html
<html lang="en-GB">
<html lang="fr-CA">
<html lang="da-DK">
<html lang="el-GR">

<html lang="es-013"><!-- Central American Spanish -->
```

They can be combined.

```html
<html lang="ru-Cyrl-BY"><!-- Russian written in Cyrillic spoken in Belarus -->
```

If you're unsure, look it up. The language itself is usually enough.

#### 3.1.2 Language of Parts - Level AA

Make sure any foreign words in the code is wrapped in an element with a `lang` attribute. Exceptions:

- Technical terms. ("Nasopharyngitis")
- Proper names. ("Vladimir Putin")
- Words/phrases of an indeterminate language. ("Lorem ipsum dolor sit amet ...")
- Words/phrases that are part of the vernacular. ("status quo")

Examples:

```html
<p>... so I said <span lang="zh-CN">新年快乐</span> and left.</p>

<ul>
    <li><a href="?locale=1" lang="fr">France</a></li>
    <li><a href="?locale=2" lang="de">Deutschland</a></li>
    <li><a href="?locale=3" lang="it">Italia</a></li>
    <li><a href="?locale=4" lang="es">España</a></li>
    <li><a href="?locale=5" lang="en">UK</a></li>
</ul>
```

#### 3.1.3 Unusual Words - Level AAA

Avoid using jargon or idioms. If you use them, provide a way for explaining them. Examples are a glossary or a definition list.

#### 3.1.4 Abbreviations - Level AAA

Add a mechanism for explaining the expanded form or meaning of an abbreviation.

```html
<!-- Do it in copy -->
<p>The United Nations High Commissioner for Human Rights (UNHCR) was established in 1950 to provide protection and assistance to refugees.</p>

<!-- Do it in markup * -->
<p>Reading the <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> is really boring.</p>
```

( * ) Be aware that the `title` tooltip actually fails **1.4.13 (AA)**. CSS-Tricks shared an article describing [an alternative approach](https://bitsofco.de/revisiting-the-abbr-element/) to satisfy these points, if necessary.

#### 3.1.5 Reading Level - Level AAA

If text is too complex for a "lower secondary education level" (roughly 11 years old / Year 7) then provide a text summary or graphs/diagrams to illustrate complex data.

#### 3.1.6 Pronunciation - Level AAA

If the pronunciation of a word is ambiguous or there are multiple possible meaning, include an explanation.

```html
<p> 慶應大学 (けいおうだいがく) </p>
```

### 3.2 Predictable

Make the website work in a predictable way.

#### 3.2.1 On Focus - Level A

Don't open a dialog or cause a "change of context" when an element gains focus.

#### 3.2.2 On Input - Level A

Don't open a dialog or cause a "change of context" when an input is used, unless it's obvious that a change will occur.

```html
<div>
    <div>
        <label for="how">How did you find us?</label>
        <select name="how" id="how">
            <option value="">Please select</option>
            <option value="1">It came to me in a dream</option>
            <option value="2">Someone shouted it from a passing car</option>
            <option value="3">I saw it carved into a dead porcupine</option>
            <option value="4">Other (please explain below)</option>
        </select>
        <input type="text" name="how-other" id="how-other" aria-label="Please explain how you found us" hidden>
    </div>
</div>
<script>
var other = document.getElementById("how-other");
document.getElementById("how").addEventListener("change", function () {
    other.hidden = this.value < 4;
});
</script>
```

#### 3.2.3 Consistent Navigation - Level AA

Keep the navigation in the same place and the same order throughout the website.

"Same order" doesn't mean that there can't be sub-navigation. It means that other elements aren't re-ordered.

- Home
- What is this?
    - Why am I here?
    - How did you get here?
    - Can I go now?
- Contact us

#### 3.2.4 Consistent Identification - Level AA

Components that have the same functionality also have the same name/icon/short-cut key etc.

#### 3.2.5 Change of Request - Level AAA

Changes of context are initiated only by user request or a mechanism is available to turn them off.

### 3.3 Input Assistance

Help users avoid and correct mistakes.

#### 3.3.1 Error Identification - Level A

In an input field detects an error, the input element is identified and the error is described in text.

This is exactly what jQuery Validate does.

#### 3.3.2 Labels or Instructions - Level A

Include instructions if you require user input. The input `<label>` is probably sufficient. If a certain format is needed, write it on the page (not enough to add it to the `placeholder` attribute). Same with complex interactivity.

#### 3.3.3 Error Suggestion - Level AA

If there's an error with the input and suggestions for the correction are known then tell the user unless it would jeopardise the security or purpose.

Good examples:

- Please enter a valid e-mail address.
- This field is required.
- Your password must contain at least 8 letters, a capital, a plot, a protagonist with good character development, a twist & a happy ending.

#### 3.3.4 Error Prevention (Legal, Financial, Data) - Level AA

For web pages that would cause legal or financial commitments, modify or delete user-controllable data in data storage systems or that submit user test responses, at least one of the following is true:

- **Reversible**: Submissions can be reversed.
- **Checked**: Data entered is checked and the user has the opportunity to correct the information.
- **Confirmed**: A mechanism is available for reviewing, confirming and correcting the data before finalising the submission.

#### 3.3.5 Help - Level AAA

Context-sensitive help is available.

#### 3.3.6 Error Prevention (All) - Level AAA

For any submitted information, at least one of the following is true.

- **Reversible**: Submissions can be reversed.
- **Checked**: Data entered is checked and the user has the opportunity to correct the information.
- **Confirmed**: A mechanism is available for reviewing, confirming and correcting the data before finalising the submission.

We can get **Checked** by having client-side and server-side validation.

### 4.1 Compatible

Maximise compatibility with current/future user agents and assistive technologies.

#### 4.1.1 Parsing - Level A

For HTML:

- Elements that need them have complete start and end tags.
- Nested according to specs (only within valid parents, only contain valid children).
- No duplicate attributes.
- IDs are unique.

_tl;dr_: write valid HTML.

#### 4.1.2 Name, Role, Value - Level A

Make sure user agents can work out names and roles where appropriate (input, links etc.). Notification of state changes are available to user agents and assistive technologies.

```html
<!-- An input element with an error: -->
<input type="text" name="my-input" class="error" aria-invalid="true">
```

#### 4.1.3 Status Messages - Level AA

Make sure user agents and assistive technologies can read status messages.

AJAX add-to-cart means a cart should have `role="status"`

```html
<div id="basket" role="status">
    <p>3 items</p>
    <ul>
        <li><!-- ... --></li>
        <li><!-- ... --></li>
        <li><!-- ... --></li>
    </ul>
</div>
```

Same as search results.

```html
<p role="status">27 results found</p>
```

If a form has an area for containing all the validation errors, it should have `role="alert"` and `aria-atomic="true"`

```html
<form method="post" action="" id="my-form">
    <div id="errors" role="alert" aria-atomic="true"></div>
    <p>
        <label for="first">First name (required)</label>
        <input name="first" id="first" type="text">
    </p>
    <!-- ... -->
</form>

<script>
document.getElementById("my-form").addEventListener("submit", function (e) {

    var error;

    if (document.getElementById("first").value === "") {

        error = document.createElement("p");
        error.textContent = "Please enter your first name.";
        document.getElementById("errors").appendChild(error);

        // Also include:
        // aria-invalid="true" on <input>
        // id="..." on error and aria-errormessage="..." on input

    }

    // ...

});
</script>
```
