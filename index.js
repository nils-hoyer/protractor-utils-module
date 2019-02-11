'use strict';

const ProtractorImageComparison = require('protractor-image-comparison');

/**
 * Protractor Utils Class
 */
class ProtractorUtilsModule {
    /**
     * Constructor
     * @param config
     * @param configImageComparison
     */
    constructor(config) {
        this.config = {
            explicitWait: config && config.hasOwnProperty('explicitWait') ? config.explicitWait : 200,
            implicitWait: config && config.hasOwnProperty('implicitWait') ? config.implicitWait : 5000,
            scrollIntoView: config && config.hasOwnProperty('scrollIntoView') ? config.scrollIntoView : false,
            moveMouse: config && config.hasOwnProperty('moveMouse') ? config.moveMouse : false,
            imageComparison: config && config.hasOwnProperty('imageComparison')
                ? config.imageComparison
                : {baselineFolder: './images/', screenshotPath: './images/'},
        };

        this._protractorImageComparison = new ProtractorImageComparison(this.config.imageComparison);
    };

    /**
     * extends selenium browser get function
     * @param path
     * @returns {promise.Promise.<any>}
     */
    get(path, options) {
        if (!browser.baseUrl) {
            throw new Error('config.baseUrl in conf.js is not defined');
        }

        return browser.get(browser.baseUrl + path);
    }

    /**
     * extends selenium element.click function
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    click(el, options) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        if (!options.moveMouse) {
            return el.click(options.buttonType);
        } else {
            this.moveMouseTo(el);

            return el.getSize().then((sizes) => {
                const x = (options.moveMouse && options.moveMouse.x) ? sizes.width + options.moveMouse.x : 0;
                const y = (options.moveMouse && options.moveMouse.y) ? sizes.height + options.moveMouse.y : 0;
                return browser.actions()
                    .mouseMove({x: x, y: y})
                    .click(options.buttonType)
                    .perform();
            });
        }
    }

    /**
     * extends selenium browser.actions.doubleClick function
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    doubleClick(el, options) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        return browser.actions().doubleClick(el).perform();
    }

    /**
     * extends browser.actions.mouseDown and drag an element
     * @param el
     * @returns {promise.Promise<any>}
     */
    drag(el, options) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        return browser.actions().mouseDown(el).perform();
    }

    /**
     * extends browser.actions.mouseMove and drop an element
     * @param el
     * @returns {promise.Promise<void>}
     */
    drop(el, options) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        return browser.actions().mouseMove(el).mouseUp().perform();
    }

    /**
     * function to swipe left or right
     * example: left (distance=-50), right (distance=50)
     * @param el
     * @param distance
     * @param options
     * @returns {promise.Promise.<any>}
     */
    swipe(el, distance, options) {
        options = this._optionGetter(options);
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
     * extends selenium element.sendKeys function
     * @param el
     * @param text
     * @param options
     * @returns {promise.Promise.<any>}
     */
    sendKeys(el, text, options) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        return el.clear().then(function() {
            return el.sendKeys(text);
        });
    }

    /**
     * function to send a key
     * example: sendKey(protractor.Key.ENTER)
     * @param key
     * @returns {promise.Promise<any>}
     */
    sendKey(key, options) {
        const elMock = element(by.css('html'));

        options = this._optionGetter(options);
        this._optionExecutor(elMock, options);

        return browser.actions()
            .sendKeys(key)
            .perform();
    }

    /**
     * extends selenium element.getText function
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    getText(el, options) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        return el.getText().then(function(text) {
            return text.replace(/\s/g, ' ');
        });
    }

    /**
     * function to get the text of an element from type input
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    getTextInput(el, options) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        return el.getAttribute('value');
    }

    /**
     * function to set the text of an element
     * @param el
     * @param replace
     * @returns {promise.Promise.<any>}
     */
    setText(el, replace) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        return browser.executeScript('arguments[0].innerText = \''+replace+'\'', el);
    }

    /**
     * function to set the text to element by regExp | string
     * @param el
     * @param search
     * @param replace
     * @returns {promise.Promise<any>}
     */
    setTextByRegEx(el, search, replace) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        return browser.executeScript('arguments[0].innerHTML = arguments[0].innerHTML.replace(' +
            search + ',' + '\'' + replace + '\'' +  ')', el);
    }

    /**
     * function to verify if an element is present
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    isPresent(el, options) {
        options = this._optionGetter(options);
        browser.wait(protractor.ExpectedConditions.presenceOf(el), options.implicitWait).catch(e => e);

        return protractor.ExpectedConditions.presenceOf(el)();
    }

    /**
     * function to verify if an element is not present
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    isNotPresent(el, options) {
        options = this._optionGetter(options);
        browser.wait(protractor.ExpectedConditions.stalenessOf(el), options.implicitWait).catch(e => e);

        return protractor.ExpectedConditions.stalenessOf(el)();
    }

    /**
     * function to verify if an element is visible
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    isVisible(el, options) {
        options = this._optionGetter(options);
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(el), options.implicitWait).catch(e => e);

        return protractor.ExpectedConditions.elementToBeClickable(el)();
    }

    /**
     * function to verify if an element is not visible
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    isNotVisible(el, options) {
        options = this._optionGetter(options);
        browser.wait(protractor.ExpectedConditions.invisibilityOf(el), options.implicitWait).catch(e => e);

        return protractor.ExpectedConditions.invisibilityOf(el)();
    }

    /**
     * function to verify if an element is selected
     * @param el
     * @param options
     * @returns {promise.Promise.<any>}
     */
    isSelected(el, options) {
        options = this._optionGetter(options);
        browser.wait(protractor.ExpectedConditions.elementToBeSelected(el), options.implicitWait).catch(e => e);

        return protractor.ExpectedConditions.elementToBeSelected(el)()
    }

    /**
     * function to verify if an element has the given text
     * @param el
     * @param text
     * @param options
     * @returns {promise.Promise.<any>}
     */
    hasText(el, text, options) {
        options = this._optionGetter(options);
        browser.wait(protractor.ExpectedConditions.textToBePresentInElement(el, text), options.implicitWait).catch(e => e);

        return protractor.ExpectedConditions.textToBePresentInElement(el, text)();
    }

    /**
     * function to check if an element has a given class
     * @param el
     * @param cls
     * @param options
     * @returns {promise.Promise.<any>}
     */
    hasClass(el, cls, options) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        return el.getAttribute('class').then(function(classes) {
            return classes.includes(cls);
        });
    }

    // TODO extend with setter und executer
    /**
     * function to scroll an element into viewport
     * @param el
     * @returns {promise.Promise.<any>}
     */
    scrollIntoView(el) {
        return browser.executeScript('arguments[0].scrollIntoView();', el.getWebElement());
    }

    // TODO extend with setter und executer
    /**
     * function to move mouse to element
     * @param el
     * @returns {promise.Promise.<any>}
     */
    moveMouseTo(el) {
        return browser.actions().mouseMove(el).perform();
    }

    // TODO extend with setter und executer
    /**
     * function to upload a file
     * @param filePath
     * @param indexOfElement
     * @returns {promise.Promise.<any>}
     */
    uploadFile(filePath, indexOfElement = 0) {
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
    openTab(url) {
        return browser.executeScript('return window.open(arguments[0], "_blank")', url);
    }

    /**
     * function to switch to tab by index
     * @param indexOfTab
     * @returns {promise.Promise.<any>}
     */
    switchToTab(indexOfTab) {
        return browser.getAllWindowHandles().then(function(handles) {
            return browser.switchTo().window(handles[indexOfTab]);
        });
    }

    /**
     * extends browser.switchTo.Frame
     * @param indexOfFrame
     * @param options
     * @returns {promise.Promise<any>}
     */
    switchToFrame(indexOfFrame, options) {
        indexOfFrame = indexOfFrame || 0;
        const ele = element.all(by.tagName('iframe')).get(indexOfFrame);

        options = this._optionGetter(options);
        this._optionExecutor(ele, options);

        return browser.switchTo().frame(ele.getWebElement())
            .then(browser.sleep(500));
    }

    /**
     * function to log element properties to console
     * @param el
     * @param options
     * @returns {promise.Promise<any>}
     */
    logElement(el, options) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options).then((r) => {
            const locator = el.locator();
            console.log('selector: ', locator.toString());
            element.all(locator).then((res) => console.log('elements: ', res.length));
            el.isPresent().then((res) => console.log('present: ', res));
            return el.isDisplayed().then(function(res) {
                console.log('visible: ', res);
                el.getText().then((res) => console.log('text: ', res.replace(/\s/g, ' ')));
                el.getLocation().then((res) => console.log('location: x ', res.x, ' y ', res.y));
                return el.getSize().then((res) => console.log('size: w ', res.width, ' h ', res.height));
            }).catch(() => console.log('visible: false'));
        });
    }

    /**
     * function to explicit wait an amount of time
     * @param ms
     * @param msg
     * @returns {promise.Promise<any>}
     */
    sleep(ms, msg) {
        if (!msg) throw new Error('no message defined');
        return browser.sleep(ms);
    }

    /**
     * extends protractor-image-comparison function to check full page screen
     * @param tag
     * @param options
     * @return {promise.Promise.<any>}
     */
    checkFullPageScreen(tag, options) {
        const elMock = element(by.css('html'));

        options = this._optionGetter(options);
        this._optionExecutor(elMock, options);

        return this._protractorImageComparison.checkFullPageScreen(tag, options.imageComparison);
    }

    /**
     * extends protractor-image-comparison function to check viewport screen
     * @param tag
     * @param options
     * @return {promise.Promise.<any>}
     */
    checkScreen(tag, options) {
        const elMock = element(by.css('html'));

        options = this._optionGetter(options);
        this._optionExecutor(elMock, options);

        return this._protractorImageComparison.checkScreen(tag, options.imageComparison);
    }

    /**
     * extends protractor-image-comparison function to check an element in the viewport
     * @param tag
     * @param el
     * @param options
     * @return {promise.Promise.<any>}
     */
    checkElement(tag, el, options) {
        options = this._optionGetter(options);
        this._optionExecutor(el, options);

        return this._protractorImageComparison.checkElement(el, tag, options.imageComparison);
    }

    /**
     * function to find an element by text for e.g. list items
     * @param searchText
     * @param ssSelector
     * @returns {ElementFinder}
     */
    byText(searchText, ssSelector = 'div, li, option') {
        return element(by.cssContainingText(ssSelector, searchText));
    }

    /**
     * function to find an array of element by text for e.g. missing css selector options
     * @param searchText
     * @param ssSelector
     * @returns {ElementArrayFinder}
     */
    byTextAll(searchText, ssSelector = 'div, li, option') {
        return element.all(by.cssContainingText(ssSelector, searchText));
    }

    /**
     * private function to merge target and source objects
     * @param target
     * @param source
     * @returns {any}
     * @private
     */
    _optionMerge(target, source) {
        return Object.assign(target, source);
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
    _optionGetter(options) {
        return {
            explicitWait: options && options.hasOwnProperty('explicitWait') ? options.explicitWait : this.config.explicitWait,
            implicitWait: options && options.hasOwnProperty('implicitWait') ? options.implicitWait : this.config.implicitWait,
            scrollIntoView: options && options.hasOwnProperty('scrollIntoView') ? options.scrollIntoView : this.config.scrollIntoView,
            moveMouse: options && options.hasOwnProperty('moveMouse') ? options.moveMouse : this.config.moveMouse,
            imageComparison: options && options.hasOwnProperty('imageComparison') ? options.imageComparison : this.config.imageComparison,
            buttonType: options && options.hasOwnProperty('buttonType') ? options.buttonType : protractor.Button.LEFT,
        };
    }

    /**
     * private function to execute options
     * @param el
     * @param options
     * @private
     */
    _optionExecutor(el, options) {
        const promiseArray = [];

        if (options.explicitWait) {
            promiseArray.push(browser.sleep(options.explicitWait));
        }
        if (options.implicitWait) {
            promiseArray.push(this.isVisible(el, options));
        }
        if (options.scrollIntoView) {
            promiseArray.push(this.scrollIntoView(el));
        }
        if (options.moveMouse) {
            promiseArray.push(this.moveMouseTo(el));
        }

        return Promise.all(promiseArray)
    }
}

module.exports = ProtractorUtilsModule;
