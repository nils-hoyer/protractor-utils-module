'use strict';

const protractorImageComparison = require('protractor-image-comparison');

/**
 * Protractor Utils Helper Class
 */
class ProtractorUtilsModule {

    constructor(config, configImageComparison) {

        this.config = {
            wait: config && config.hasOwnProperty('wait') ? config.wait : 200,
            waitPresence: config && config.hasOwnProperty('waitPresence') ? config.waitPresence : 5000,
            waitInvisible: config && config.hasOwnProperty('waitInvisible') ? config.waitInvisible : 5000,
            waitClickable: config && config.hasOwnProperty('waitClickable') ? config.waitClickable : 10000,
            imageComparison: config && config.hasOwnProperty('imageComparison') ? config.imageComparison : {},
        };

        this.protractorImageComparison = new protractorImageComparison({
            baselineFolder: configImageComparison && configImageComparison.hasOwnProperty('baselineFolder') ?
                configImageComparison.baselineFolder : './images/expected/',
            screenshotPath: configImageComparison && configImageComparison.hasOwnProperty('screenshotPath') ?
                configImageComparison.screenshotPath : './images/given/',
        });

    };

    /**
     * function to open an url path to defined base url
     * @param path
     */
    get(path) {
        if(!browser.baseUrl) {
            throw new Error('unable to exeute get(). Please define config.baseUrl in protractor configuration file');
        }
        return browser.get(browser.baseUrl + path);
    }

    /**
     * extended selenium element.click function
     * @param element
     * @param options
     * @returns {ActionSequence | promise.Promise<void> | webdriver.promise.Promise.<void> | *}
     */
    click(element, options) {
        options = this._optionSetter(options);
        this._optionExecutor(element, options);
        if (!options.moveMouse) {
            return element.click(options.buttonType);
        } else {
            this.moveMouseTo(element, options);
            return element.getSize().then((size) => {
                const x = (options.moveMouse.x) ? size.width + options.moveMouse.x : 0;
                const y = (options.moveMouse.y) ? size.height + options.moveMouse.y : 0;
                return browser.actions()
                    .mouseMove({x:x, y:y})
                    .click(options.buttonType)
                    .perform();
            });
        }
    }

    /**
     * function to select an element of a dropdown list
     * @param element
     * @param byOption
     * @param optionNumber
     * @param options
     * @returns {ActionSequence|promise.Promise.<void>|webdriver.promise.Promise.<void>|*}
     */
    clickDropdown(element, byOption, optionNumber, options) {
        options = this._optionSetter(options);
        this.click(element, options);

        return this.click(element.all(byOption).get(optionNumber), options);
    }

    /**
     * extended selenium element.sendKeys function
     * @param element
     * @param text
     * @param options
     * @returns {promise.Promise<any>}
     */
    sendKeys(element, text, options) {
        options = this._optionSetter(options);
        this._optionExecutor(element, options);
        return element.clear().then(function() {
            return element.sendKeys(text);
        });
    }

    /**
     * extended selenium element.getText function
     * @param element
     * @param options
     * @returns {promise.Promise<string> | webdriver.promise.Promise.<string> | promise.Promise.<boolean> | webdriver.promise.Promise.<boolean>}
     */
    getText(element, options) {
        options = this._optionSetter(options);
        this._optionExecutor(element, options);
        return element.getText().then(function (text) {
            return text.replace(/\s/g, ' ');
        });
    }

    /**
     * extends selenium element.isSelected function
     * @param element
     * @param options
     * @returns {*|promise.Promise<boolean>|webdriver.promise.Promise.<boolean>}
     */
    isSelected(element, options) {
        options = this._optionSetter(options);
        this._optionExecutor(element, options);
        return element.isSelected();
    }

    /**
     * extended selenium element.isDisplayed function
     * @param element
     * @param options
     * @returns {webdriver.promise.Promise.<boolean>|promise.Promise<boolean>|*}
     */
    isDisplayed(element, options) {
        options = this._optionSetter(options);
        this._optionExecutor(element, options);
        return element.isDisplayed();
    }

    /**
     * function to wait until an element is invisible
     * @param element
     * @param options
     * @returns {Function}
     */
    isInvisible(element, options) {
        options = this._optionSetter(options);
        browser.wait(protractor.ExpectedConditions.invisibilityOf(element), options.waitInvisible)
        return protractor.ExpectedConditions.invisibilityOf(element)();
    }

    /**
     * Check if element has a given class
     * @param element
     * @param cls
     * @returns {promise.Promise<any>}
     */
    hasClass(element, cls, options) {
        options = this._optionSetter(options);
        this._optionExecutor(element, options);
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    }

    /**
     * function to wait until an element is clickable
     * @param element
     * @param options
     * @returns {boolean}
     */
    waitElementClickable(element, options) {
        options = this._optionSetter(options);
        return browser.wait(protractor.ExpectedConditions.elementToBeClickable(element), options.waitClickable).catch(() => {});
    }

    /**
     * function to wait until an element is present
     * @param element
     * @param options
     * @returns {Q.Promise<any> | Promise.<T> | promise.Promise<any>}
     */
    waitElementPresence(element, options) {
        options = this._optionSetter(options);
        return browser.wait(protractor.ExpectedConditions.presenceOf(element), options.waitClickable).catch(() => {});
    }

    /**
     * function to scroll element into viewport
     * @param element
     * @returns {promise.Promise.<T>|promise.Promise<any>}
     */
    scrollIntoView(element, options) {
        return browser.executeScript('arguments[0].scrollIntoView();', element.getWebElement());
    }

    /**
     * function to move mouse to element
     * @param element
     * @param options
     * @returns {promise.Promise<void>}
     */
    moveMouseTo(element, options) {
        options = this._optionSetter(options);
        return browser.actions().mouseMove(element).perform();
    }

    /**
     * function to clear cookies, session, storage
     * @returns {promise.Promise.<T>|promise.Promise<any>}
     */
    clearBrowserInstance() {
        browser.manage().deleteAllCookies();
        browser.executeScript('window.localStorage.clear()');
        return browser.executeScript('sessionStorage.clear()');
    }

    /**
     * extended image comparison function check screen
     * @param tag
     * @param options
     * @return {Promise}
     */
    checkScreen(tag, options) {
        options = this._optionSetter(options);
        this._optionExecutor(element(by.css('html')), options);
        return this.protractorImageComparison.checkScreen(tag, options.imageComparison);
    }

    /**
     * extended image comparison function check element
     * @param tag
     * @param element
     * @param options
     * @return {Promise}
     */
    checkElement(tag, element, options) {
        options = this._optionSetter(options);
        this._optionExecutor(element, options);
        return this.protractorImageComparison.checkElement(element, tag, options.imageComparison);
    }

    /**
     * opens a url in a new tab
     * @param url
     * @returns {promise.Promise.<T>|promise.Promise<any>}
     */
    newTab(url) {
        return browser.executeScript('return window.open(arguments[0], "_blank")', url);
    }

    /**
     * switch to specific browser tab
     * @param tab
     * @returns {promise.Promise<any>}
     */
    switchToTab(tab) {
        return browser.getAllWindowHandles().then(function(handles) {
            return browser.switchTo().window(handles[tab]);
        });
    }

    /**
     * switch to iFrame
     * @param options
     * @returns {*}
     */
    switchToFrame(options) {
        const ele = element(by.tagName('iframe'));
        options = this._optionSetter(options);
        this._optionExecutor(ele, options);
        return browser.switchTo().frame(ele.getWebElement());
    }

    /**
     * private function to set options {wait, waitClickable, scrollIntoView, moveMouse, listElement, imageComparison}
     * @param options
     * @returns {{wait: *, waitClickable: number, scrollIntoView: boolean, moveMouse: boolean, imageComparison: {}}}
     * @private
     */
    _optionSetter(options) {
        return {
            wait: options && options.hasOwnProperty('wait') ? options.wait : this.config.wait,
            waitPresence: options && options.hasOwnProperty('waitPresence') ? options.waitPresence : this.config.waitPresence,
            waitInvisible: options && options.hasOwnProperty('waitInvisible') ? options.waitInvisible : this.config.waitInvisible,
            waitClickable: options && options.hasOwnProperty('waitClickable') ? options.waitClickable : this.config.waitClickable,
            imageComparison: options && options.hasOwnProperty('imageComparison') ? options.imageComparison : this.config.imageComparison,

            scrollIntoView: options && options.hasOwnProperty('scrollIntoView') ? options.scrollIntoView : false,
            moveMouse: options && options.hasOwnProperty('moveMouse') ? options.moveMouse : false,
            buttonType: options && options.hasOwnProperty('buttonType') && options.buttonType === 'right'
                ? protractor.Button.RIGHT : protractor.Button.LEFT,
        };
    }

    /**
     * private function to execute options
     * @param element
     * @param options
     * @private
     */
    _optionExecutor(element, options) {
        if (options.wait !== false && options.wait !== 0) {
            browser.sleep(options.wait);
        }
        if (options.waitPresence !== false && options.waitPresence !== 0) {
            this.waitElementPresence(element, options);
        }
        if (options.waitClickable !== false && options.waitClickable !== 0) {
            this.waitElementClickable(element, options);
        }
        if (options.scrollIntoView) {
            this.scrollIntoView(element, options);
        }
        if (options.moveMouse) {
            this.moveMouseTo(element, options);
        }
    }

}

module.exports = ProtractorUtilsModule;