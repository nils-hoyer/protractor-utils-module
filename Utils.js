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
            explicitWait: config && config.hasOwnProperty('explicitWait') ? config.explicitWait : 200,
            implicitWait: config && config.hasOwnProperty('implicitWait') ? config.implicitWait : 10000,
            imageComparison: config && config.hasOwnProperty('imageComparison') ? config.imageComparison : {},
            scrollIntoView: config && config.hasOwnProperty('scrollIntoView') ? config.scrollIntoView : false,
            moveMouse: config && config.hasOwnProperty('moveMouse') ? config.moveMouse : false,
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
     * function to send special key
     * @param key
     * @returns {promise.Promise<any>}
     */
    sendKey(key) {
        switch (key.toLowerCase()) {
            case 'enter':
                key = protractor.Key.ENTER;
                break;
        }
        return browser.actions()
            .sendKeys(key)
            .perform();
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
     * function to set value to element
     * @param el
     * @param replace
     * @returns {promise.Promise.<any>}
     */
    setText(el, replace) {
        return browser.executeScript('arguments[0].innerText = \''+replace+'\'', el);
    }

    /**
     * function to set value to element by regExp
     * @param el
     * @param search
     * @param replace
     * @returns {promise.Promise<any>}
     */
    setTextByRegEx(el, search, replace) {
        return browser.executeScript('arguments[0].innerHTML = arguments[0].innerHTML.replace(' +
            search + ',' + '\'' + replace + '\'' +  ')', el);
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
     * function to explicitWait until an element is invisible
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    isInvisible(el, options) {
        options = this._optionSetter(options);
        browser.wait(protractor.ExpectedConditions.invisibilityOf(el), options.implicitWait).catch(() => {});
        return protractor.ExpectedConditions.invisibilityOf(el)();
    }

    /**
     * function to explicitWait until an element contain a given text
     * @param el
     * @param text
     * @param options
     * @returns {promise.Promise.<any>}
     */
    hasText(el, text, options) {
        options = this._optionSetter(options);
        browser.wait(protractor.ExpectedConditions.textToBePresentInElement(el, text), options.implicitWait).catch(() => {});
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
     * function to explicitWait until an element is present
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    waitElementPresence(el, options) {
        options = this._optionSetter(options);
        return browser.wait(protractor.ExpectedConditions.presenceOf(el), options.implicitWait).catch(() => {});
    }

    /**
     * function to explicitWait until an element is clickable
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    waitElementClickable(el, options) {
        options = this._optionSetter(options);
        return browser.wait(protractor.ExpectedConditions.elementToBeClickable(el), options.implicitWait).catch(() => {});
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
     * function to wait for the element to be visible and then drags the element
     * @param element
     * @returns {promise.Promise<any>}
     */
    drag(element) {
        return browser.actions().mouseDown(element || {x: element.x, y: element.y}).perform();
    }

    /**
     * function to wait for the element to be visible and then drops the element
     * @param element
     * @returns {promise.Promise<void>}
     */
    drop(element) {
        return browser.actions().mouseMove(element).mouseUp().perform();
    }

    /**
     * function to switch to iFrame
     * @param indexOfFrame
     * @param options
     * @returns {promise.Promise<any>}
     */
    switchToFrame(indexOfFrame, options) {
        indexOfFrame = indexOfFrame || 0;
        const ele = element.all(by.tagName('iframe')).get(indexOfFrame);
        options = this._optionSetter(options);
        this._optionExecutor(ele, options);
        return browser.switchTo().frame(ele.getWebElement())
            .then(browser.sleep(500));
    }

    /**
     * function to print element properties
     * @param el
     * @param options
     * @returns {promise.Promise<any>}
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
     * function to explicit wait an amount of time
     * @param ms
     * @param msg
     * @returns {promise.Promise<any>}
     */
    sleep(ms, msg) {
        if (!msg) throw new Error('parameter msg is missing');
        return browser.sleep(ms);
    }

    /**
     * private function to set options
     * @param options
     * @returns {{explicitWait: (number|*),
     * implicitWait: (number|*),
     * imageComparison: ({}|*|ProtractorUtilsModule.config.imageComparison),
     * scrollIntoView: boolean,
     * moveMouse: boolean,
     * buttonType: *}}
     * @private
     */
    _optionSetter(options) {
        return {
            explicitWait: options && options.hasOwnProperty('explicitWait') ? options.explicitWait : this.config.explicitWait,
            implicitWait: options && options.hasOwnProperty('implicitWait') ? options.implicitWait : this.config.implicitWait,
            imageComparison: options && options.hasOwnProperty('imageComparison') ? options.imageComparison : this.config.imageComparison,
            scrollIntoView: options && options.hasOwnProperty('scrollIntoView') ? options.scrollIntoView : this.config.scrollIntoView,
            moveMouse: options && options.hasOwnProperty('moveMouse') ? options.moveMouse : this.config.moveMouse,
            buttonType: options && options.hasOwnProperty('buttonType') && options.buttonType === 'right' ? protractor.Button.RIGHT : protractor.Button.LEFT,
        };
    }

    /**
     * private function to execute options
     * @param el
     * @param options
     * @private
     */
    _optionExecutor(el, options) {
        if (options.explicitWait) {
            browser.sleep(options.explicitWait);
        }
        if (options.implicitWait) {
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
