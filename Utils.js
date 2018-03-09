'use strict';

const ProtractorImageComparison = require('protractor-image-comparison');

/**
 * Protractor Utils Helper Class
 */
class ProtractorUtilsModule {
    /**
     * Constructor
     * @param config
     * @param configImageComparison
     */
    constructor(config, configImageComparison) {
        this.config = {
            wait: config && config.hasOwnProperty('wait') ? config.wait : 200,
            waitPresence: config && config.hasOwnProperty('waitPresence') ? config.waitPresence : 5000,
            waitInvisible: config && config.hasOwnProperty('waitInvisible') ? config.waitInvisible : 5000,
            waitClickable: config && config.hasOwnProperty('waitClickable') ? config.waitClickable : 10000,
            imageComparison: config && config.hasOwnProperty('imageComparison') ? config.imageComparison : {},
        };

        this.protractorImageComparison = new ProtractorImageComparison({
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
        if (!browser.baseUrl) {
            throw new Error('unable to exeute get(). Please define config.baseUrl in protractor configuration file');
        }
        return browser.get(browser.baseUrl + path);
    }

    /**
     * extended selenium element.click function
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    click(el, options) {
        options = this._optionSetter(options);
        this._optionExecutor(el, options);
        if (!options.moveMouse) {
            return el.click(options.buttonType);
        } else {
            this.moveMouseTo(el);
            return el.getSize().then((size) => {
                const x = (options.moveMouse.x) ? size.width + options.moveMouse.x : 0;
                const y = (options.moveMouse.y) ? size.height + options.moveMouse.y : 0;
                return browser.actions()
                    .mouseMove({x: x, y: y})
                    .click(options.buttonType)
                    .perform();
            });
        }
    }

    /**
     * function to double click an element
     * @param element
     * @param options
     * @returns {promise.Promise.<any>}
     */
    doubleClick(element, options) {
        options = this._optionSetter(options);
        this._optionExecutor(element, options);
        return browser.actions().doubleClick(element).perform();
    }

    /**
     * function to select an element of a dropdown list
     * @param el
     * @param byOption
     * @param optionNumber
     * @param options
     * @returns {promise.Promise.<any>}
     */
    clickDropdown(el, byOption, optionNumber, options) {
        options = this._optionSetter(options);
        this.click(el, options);
        return this.click(el.all(byOption).get(optionNumber), options);
    }

    /**
     * function to swipe left (distance=-50) or right (distance=50)
     * @param el
     * @param distance
     * @param options
     * @returns {promise.Promise.<any>}
     */
    swipe(el, distance, options) {
        options = this._optionSetter(options);
        this._optionExecutor(el, options);
        return browser.driver
            .actions()
            .mouseDown(el)
            .mouseMove({
                x: distance,
                y: 0,
            })
            .mouseUp().perform();
    }

    /**
     * extended selenium element.sendKeys function
     * @param el
     * @param text
     * @param options
     * @returns {promise.Promise.<any>}
     */
    sendKeys(el, text, options) {
        options = this._optionSetter(options);
        this._optionExecutor(el, options);
        return el.clear().then(function() {
            return el.sendKeys(text);
        });
    }

    /**
     * extended selenium element.getText function
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    getText(el, options) {
        options = this._optionSetter(options);
        this._optionExecutor(el, options);
        return el.getText().then(function(text) {
            return text.replace(/\s/g, ' ');
        });
    }

    /**
     * extends selenium element.isSelected function
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    isSelected(el, options) {
        options = this._optionSetter(options);
        this._optionExecutor(el, options);
        return el.isSelected();
    }

    /**
     * extended selenium element.isPresent function
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    isPresent(el, options) {
        options = this._optionSetter(options);
        this._optionExecutor(el, options);
        return el.isPresent();
    }

    /**
     * extended selenium element.isDisplayed function
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    isDisplayed(el, options) {
        options = this._optionSetter(options);
        this._optionExecutor(el, options);
        return el.isDisplayed();
    }

    /**
     * function to wait until an element is invisible
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    isInvisible(el, options) {
        options = this._optionSetter(options);
        browser.wait(protractor.ExpectedConditions.invisibilityOf(el), options.waitInvisible).catch(() => {});
        return protractor.ExpectedConditions.invisibilityOf(el)();
    }

    /**
     * function to wait until an element contain a given text
     * @param el
     * @param text
     * @param options
     * @returns {promise.Promise.<any>}
     */
    hasText(el, text, options) {
        options = this._optionSetter(options);
        browser.wait(protractor.ExpectedConditions.textToBePresentInElement(el, text), options.waitClickable).catch(() => {});
        return protractor.ExpectedConditions.textToBePresentInElement(el, text)();
    }

    /**
     * function to heck if element has a given class
     * @param el
     * @param cls
     * @param options
     * @returns {promise.Promise.<any>}
     */
    hasClass(el, cls, options) {
        options = this._optionSetter(options);
        this._optionExecutor(el, options);
        return el.getAttribute('class').then(function(classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    }

    /**
     * function to wait until an element is present
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    waitElementPresence(el, options) {
        options = this._optionSetter(options);
        return browser.wait(protractor.ExpectedConditions.presenceOf(el), options.waitClickable).catch(() => {});
    }

    /**
     * function to wait until an element is clickable
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    waitElementClickable(el, options) {
        options = this._optionSetter(options);
        return browser.wait(protractor.ExpectedConditions.elementToBeClickable(el), options.waitClickable).catch(() => {});
    }

    /**
     * function to scroll element into viewport
     * @param el
     * @returns {promise.Promise.<any>}
     */
    scrollIntoView(el) {
        return browser.executeScript('arguments[0].scrollIntoView();', el.getWebElement());
    }

    /**
     * function to move mouse to element
     * @param el
     * @returns {promise.Promise.<any>}
     */
    moveMouseTo(el) {
        return browser.actions().mouseMove(el).perform();
    }

    /**
     * function to upload a file
     * @param filePath
     * @param indexOfElement
     * @returns {promise.Promise.<any>}
     */
    uploadFile(filePath, indexOfElement) {
        indexOfElement = indexOfElement || 0;
        const el = element.all(by.css('input[type="file"]')).get(indexOfElement);
        const dirname = __dirname.split('/').reverse().splice(2).reverse().join('/');
        const absolutePath = require('path').resolve(dirname, filePath);
        const remote = require('../../node_modules/selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
        browser.executeScript(
            'arguments[0].style.visibility = "visible";' +
            'arguments[0].style.height = "1px";' +
            'arguments[0].style.width = "1px";' +
            'arguments[0].style.opacity = 1',
            el.getWebElement());
        return el.sendKeys(absolutePath);
    }

    /**
     * extended image comparison function check screen
     * @param tag
     * @param options
     * @return {promise.Promise.<any>}
     */
    checkScreen(tag, options) {
        options = this._optionSetter(options);
        this._optionExecutor(element(by.css('html')), options);
        return this.protractorImageComparison.checkScreen(tag, options.imageComparison);
    }

    /**
     * extended image comparison function check element
     * @param tag
     * @param el
     * @param options
     * @return {promise.Promise.<any>}
     */
    checkElement(tag, el, options) {
        options = this._optionSetter(options);
        this._optionExecutor(el, options);
        return this.protractorImageComparison.checkElement(el, tag, options.imageComparison);
    }

    /**
     * function to clear cookies, session, storage
     * @returns {promise.Promise.<any>}
     */
    clearBrowserInstance() {
        browser.manage().deleteAllCookies();
        browser.executeScript('window.localStorage.clear()');
        return browser.executeScript('sessionStorage.clear()');
    }

    /**
     * function to open a url in a new tab
     * @param url
     * @returns {promise.Promise.<any>}
     */
    newTab(url) {
        return browser.executeScript('return window.open(arguments[0], "_blank")', url);
    }

    /**
     * switch to specific browser tab
     * @param indexOfTab
     * @returns {promise.Promise.<any>}
     */
    switchToTab(indexOfTab) {
        return browser.getAllWindowHandles().then(function(handles) {
            return browser.switchTo().window(handles[indexOfTab]);
        });
    }

    /**
     * function to switch to iFrame
     * @param indexOfFrame
     * @param options
     * @returns {promise.Promise<any>}
     */
    switchToFrame(indexOfFrame, options) {
        indexOfFrame = indexOfFrame || 0;
        const el = element.all(by.tagName('iframe')).get(indexOfFrame);
        this._optionExecutor(el, options);
        return browser.switchTo().frame(el.getWebElement());
    }

    /**
     * function to print element properties
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    printElement(el, options) {
        options = this._optionSetter(options);
        this._optionExecutor(el, options);
        const locator = el.locator();
        console.log('locator: ', locator.toString());
        element.all(locator).then((res) => console.log('findElements: ', res.length));
        el.isPresent().then((res) => console.log('isPresent: ', res));
        return el.isDisplayed().then(function(res) {
            console.log('isDisplayed: ', res);
            el.getText().then((res) => console.log('getText: ', res.toString()));
            el.getLocation().then((res) => console.log('getLocation: x ', res.x, ' y ', res.y));
            return el.getSize().then((res) => console.log('getSize: w ', res.width, ' h ', res.height));
        }).catch(() => console.log('isDisplayed: false'));
    }

    /**
     * private function to set options {wait, waitClickable, scrollIntoView, moveMouse, listElement, imageComparison}
     * @param options
     * @returns {{wait: (number|*), waitPresence: (number|*), waitInvisible: (number|*), waitClickable: (number|*),
     * imageComparison: ({}|*|ProtractorUtilsModule.config.imageComparison), scrollIntoView: boolean, moveMouse: boolean, buttonType: *}}
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
     * @param el
     * @param options
     * @private
     */
    _optionExecutor(el, options) {
        if (options.wait) {
            browser.sleep(options.wait);
        }
        if (options.waitPresence) {
            this.waitElementPresence(el, options);
        }
        if (options.waitClickable) {
            this.waitElementClickable(el, options);
        }
        if (options.scrollIntoView) {
            this.scrollIntoView(el);
        }
        if (options.moveMouse) {
            this.moveMouseTo(el);
        }
    }
}

module.exports = ProtractorUtilsModule;
