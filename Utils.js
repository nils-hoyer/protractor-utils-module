const protractorImageComparison = require('protractor-image-comparison');

/**
 * extended selenium element.click function
 * @param element
 * @param options
 */
function click(element, options) {
    options = optionSetter(options);
    optionExecutor(element, options);
    return element.click();
}

/**
 * function to select an element of a dropdown list
 * @param element
 * @param elementOption
 * @param elementOptionNumber
 * @param options
 */
function clickDropdown(element, elementOption, elementOptionNumber, options) {
    options = optionSetter(options);
    click(element, options);
    return click(element.all(elementOption).get(elementOptionNumber), options);
}

/**
 * extended selenium element.sendKeys function
 * @param element
 * @param text
 * @param options
 */
function sendKeys(element, text, options) {
    options = optionSetter(options);
    optionExecutor(element, options);
    return element.clear().then(function() {
        return element.sendKeys(text);
    });
}

/**
 * extended selenium element.getText function
 * @param element
 * @param options
 * @returns {webdriver.promise.Promise.<string>|promise.Promise<string>}
 */
function getText(element, options) {
    options = optionSetter(options);
    optionExecutor(element, options);
    return element.getText();
}

/**
 * function to open an url path to given domain
 * @param urlPath
 */
function get(path) {
    return browser.get(browser.baseUrl + path);
}

/**
 * extended selenium element.isDisplayed function
 * @param element
 * @param options
 * @returns {promise.Promise<boolean> | webdriver.promise.Promise.<boolean>}
 */
function isDisplayed(element, options) {
    options = optionSetter(options);
    optionExecutor(element, options);
    return element.isDisplayed();
}

/**
 * extended selenium element.getText function
 * @param element
 * @param options
 * @returns {promise.Promise<boolean> | webdriver.promise.Promise.<boolean>}
 */
function getText(element, options) {
    options = optionSetter(options);
    optionExecutor(element, options);
    return element.getText();
}

/**
 * function to clear cookies, session, storage
 */
function clearBrowserInstance() {
    browser.manage().deleteAllCookies();
    browser.executeScript('window.localStorage.clear()');
    return browser.executeScript('sessionStorage.clear()');
}

/**
 * function to wait until an element is clickable
 * @param element
 * @param options
 */
function waitClickable(element, options) {
    options = optionSetter(options);
    return browser.wait(protractor.ExpectedConditions.elementToBeClickable(element), options.waitClickable).then().catch( () => {});
}

/**
 * function to scroll element into viewport
 * @param element
 */
function scrollIntoView(element) {
    return browser.executeScript('arguments[0].scrollIntoView();', element.getWebElement());
}

/**
 * extended image comparison function check screen
 * @param tag
 * @param options
 * @returns {Promise}
 */
function checkScreen(tag, options) {
    options = optionSetter(options);
    optionExecutor(element(by.css('html')), options);
    return protractorImageComparison.checkScreen(tag, options.imageComparison);
}

/**
 * extended image comparison function check element
 * @param tag
 * @param element
 * @param options
 * @returns {Promise}
 */
function checkElement(tag, element, options) {
    options = optionSetter(options);
    optionExecutor(element, options);
    return protractorImageComparison.checkElement(element, tag, options.imageComparison);
}

/**
 * Check if element has a given class
 * @param element
 * @param cls - class name
 * @return {promise.Promise<boolean>}
 */
function hasClass(element, cls) {
    return element.getAttribute('class').then(function(classes) {
        return classes.split(' ').indexOf(cls) !== -1;
    });
}

/**
 * switch to specific browser tab
 * @param tab
 */
function switchToTab(tab) {
    return browser.getAllWindowHandles().then(function(handles) {
        return browser.switchTo().window(handles[tab]);
    });
}

/**
 * private function to set options {wait, waitClickable, scrollIntoView, moveMouse, listElement, imageComparison}
 * @param options
 * @returns {{}}
 */
function optionSetter(options) {
    return {
        wait: options && options.hasOwnProperty('wait') ? options.wait : 500,
        waitClickable: options && options.hasOwnProperty('waitClickable') ? options.waitClickable : 10000,
        scrollIntoView: options && options.hasOwnProperty('scrollIntoView') ? options.scrollIntoView : false,
        moveMouse: options && options.hasOwnProperty('moveMouse') ? options.moveMouse : false,
        imageComparison: options && options.hasOwnProperty('imageComparison') ? options.imageComparison : {},
    };
}

/**
 * private function to execute options
 * @param options
 */
function optionExecutor(element, options) {
    if (options.wait !== false && options.wait !== 0) {
        browser.sleep(options.wait);
    }
    if (options.scrollIntoView) {
        scrollIntoView(element);
    }
    if (options.moveMouse === true) {
        browser.actions().mouseMove(element).perform();
    }
    if (options.waitClickable !== false && options.waitClickable !== 0) {
        waitClickable(element, options);
    }
}

module.exports = {
    click: click,
    clickDropdown: clickDropdown,
    sendKeys: sendKeys,
    getText: getText,
    get: get,
    isDisplayed: isDisplayed,
    clearBrowserInstance: clearBrowserInstance,
    waitClickable: waitClickable,
    scrollIntoView: scrollIntoView,
    checkScreen: checkScreen,
    checkElement: checkElement,
    hasClass: hasClass,
    switchToTab: switchToTab,
};
