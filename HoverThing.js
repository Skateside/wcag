/**
 * An attempt to make some Hover/Focus content inline with WCAG (2.1) 1.4.13
 *
 * @class HoverThing
 */
class HoverThing {

    /**
     * @constructs HoverThing
     * @param      {Element} target
     *             Element that serves as the hover parent.
     * @param      {Object} [settings={}]
     *             Optional settings for the instance.
     */
    constructor(target, settings = {}) {

        /**
         * Hover parent element.
         * @type {Element}
         */
        this.target = target;

        /**
         * A flag to show whether or not the content is visible.
         * @type {Boolean}
         */
        this.isOpen = false;

        /**
         * Settings for the instance. See {@link HoverThing.defaults}.
         * @type {Object}
         */
        this.settings = Object.assign({}, HoverThing.defaults, settings);

        /**
         * A version of {@link HoverThing#hideOnEsc} that's always bound to the
         * current instance.
         * @type {Function}
         */
        this.boundHide = this.hideOnEsc.bind(this);

        this.addHandlers();

    }

    /**
     * Adds event handlers to {@link HoverThing#target}.
     */
    addHandlers() {

        let {
            target
        } = this;

        // Show on hover, hide on hover-off.
        target.addEventListener("mouseover", () => this.show());
        target.addEventListener("mouseout", () => this.delayHide());

        // Show on focus, hide on blur.
        target.addEventListener("focus", () => this.show());
        target.addEventListener("blur", () => this.delayHide());

        // Show on child focus, hide on child blur.
        target.addEventListener("focusin", () => this.show());
        target.addEventListener("focusout", () => this.delayHide());

    }

    /**
     * Makes the hover content visible.
     */
    show() {

        this.isOpen = true;
        this.target.classList.add(this.settings.activeClass);
        document.addEventListener("keyup", this.boundHide);

    }

    /**
     * Makes the hover content invisible.
     */
    hide() {

        this.isOpen = false;
        this.target.classList.remove(this.settings.activeClass);
        document.removeEventListener("keyup", this.boundHide);

    }

    /**
     * Calls {@link HoverThing#hide} after a set delay and if
     * {@link HoverThing#isOpen} hasn't become true since the hide request was
     * made.
     */
    delayHide() {

        this.isOpen = false;

        window.setTimeout(() => {

            if (!this.isOpen) {
                this.hide();
            }

        }, this.settings.hideDelay);

    }

    /**
     * Calls {@link HoverThing#hide} when the escape key is pressed.
     *
     * @param {Object} object
     *        Object with a "key" parameter.
     */
    hideOnEsc({ key }) {

        if (key === "Escape") {
            this.hide();
        }

    }

}

/**
 * Default settings for a {@link HoverThing} instance.
 * @type {Object}
 */
HoverThing.defaults = {

    /**
     * Class to add to {@link HoverThing#target} to make the content visible.
     * @type {String}
     */
    activeClass: "is-open",

    /**
     * Delay before {@link HoverThing#hide} is called from
     * {@link HoverThing#delayHide} in milliseconds.
     * @type {Number}
     */
    hideDelay: 100

};
