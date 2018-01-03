'use strict';

const protractorImageComparison = require('protractor-image-comparison');

/**
 * Protractor Utils Helper Class
 */
class ProtractorUtilsModule {

    constructor(config, configImageComparison) {

        this.config = {
            wait: config && config.hasOwnProperty('wait') ? config.wait : 500,
            waitPresence: config && config.hasOwnProperty('waitPresence') ? config.waitPresence : 10000,
            waitClickable: config && config.hasOwnProperty('waitClickable') ? config.waitClickable : 10000,
            scrollIntoView: config && config.hasOwnProperty('scrollIntoView') ? config.scrollIntoView : false,
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
        return element.click();
    }

    /**
     * function to select an element of a dropdown list
     * @param element
     * @param elementOption
     * @param elementOptionNumber
     * @param options
     * @returns {ActionSequence|promise.Promise.<void>|webdriver.promise.Promise.<void>|*}
     */
    clickDropdown(element, elementOption, elementOptionNumber, options) {
        options = this._optionSetter(options);
        this.click(element, options);
        return this.click(element.all(elementOption).get(elementOptionNumber), options);
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
    scrollIntoView(element) {
        return browser.executeScript('arguments[0].scrollIntoView();', element.getWebElement());
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
     * private function to set options {wait, waitClickable, scrollIntoView, moveMouse, listElement, imageComparison}
     * @param options
     * @returns {{wait: *, waitClickable: number, scrollIntoView: boolean, moveMouse: boolean, imageComparison: {}}}
     * @private
     */
    _optionSetter(options) {
        return {
            wait: options && options.hasOwnProperty('wait') ? options.wait : this.config.wait,
            waitPresence: options && options.hasOwnProperty('waitPresence') ? options.waitPresence : this.config.waitPresence,
            waitClickable: options && options.hasOwnProperty('waitClickable') ? options.waitClickable : this.config.waitClickable,
            scrollIntoView: options && options.hasOwnProperty('scrollIntoView') ? options.scrollIntoView : this.config.scrollIntoView,
            imageComparison: options && options.hasOwnProperty('imageComparison') ? options.imageComparison : this.config.imageComparison,
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
        if (options.scrollIntoView) {
            this.scrollIntoView(element);
        }
        if (options.waitPresence !== false && options.waitPresence !== 0) {
            this.waitElementPresence(element, options);
        }
        if (options.waitClickable !== false && options.waitClickable !== 0) {
            this.waitElementClickable(element, options);
        }
    }

}

module.exports = ProtractorUtilsModule;