# protractor-utils-module
protractor-utils-module enriches functionality and usage of protractor

# usage
The protractor-utils-module is available via npm:

```npm i protractor-utils-module```

In your protractor configuration file, register the module:

```
const protractorUtilsModule = require('protractor-utils-module');

exports.config = {
    baseUrl: 'http://www.base.url',
    
    onPrepare: function() {
    
        // initialization
        browser.utils = new ProtractorUtilsModule();
        
        // custom initialization   
        const config = {
            explicitWait: 500,
            implicitWait: 5000,
            imageComparison: {
                baselineFolder: 'yourPath/to/baselineFolder'
                screenshotPath: 'yourPath/to/screenshotFolder'
            }
        }
        browser.utils = new ProtractorUtilsModule(config);
    }
   
}
```

in your jasmine test you can use the following functions:
```
const el = elment(by.css('.someElement'));
const url = 'https://www.google.de'
const regEx = '/pattern/g'

// options parameter is always optional
options = {
    explicitWait: number
    implicitWait: number
    scrollIntoView: boolean
    moveMouse: boolean
    imageComparison: object
    buttonType: string
};

describe('protractor-utils-module', function() {
    it('example usage', function() { 
        browser.utils.get('/path');
        browser.utils.click(el);
        browser.utils.click(el, {implicitWait: 1000});
        browser.utils.doubleClick(el);
        browser.utils.drag(el);
        browser.utils.drop(el);
        browser.utils.swipe(el, 50);
        browser.utils.sendKeys(el, 'text');
        browser.utils.sendKeys(el, 'text', {scrollIntoView: true});
        browser.utils.sendKey(protractor.Key.ENTER);
        browser.utils.getText(el);
        browser.utils.getTextInput(el);
        browser.utils.setText(el, text);
        browser.utils.setTextByRegEx(el, regEx, text)
        browser.utils.isPresent(el);
        browser.utils.isNotPresent(el);
        browser.utils.isVisible(el);
        browser.utils.isNotVisible(el);
        browser.utils.isSelected(el);
        browser.utils.hasText(el, text);
        browser.utils.hasClass(el, 'has-error');
        browser.utils.scrollIntoView(el);
        browser.utils.moveMouseTo(el);
        browser.utils.uploadFile(filePath)
        browser.utils.uploadFile(filePath, 1)
        browser.utils.clearBrowserInstance();
        browser.utils.newTab(url)
        browser.utils.switchToTab(1);
        browser.utils.switchToFrame(); 
        browser.utils.switchToFrame(1); 
        browser.utils.logElement(el);
        browser.utils.sleep(1000, 'wait async call to finish')
        browser.utils.checkFullPageScreen('tagName');
        browser.utils.checkScreen('tagName');
        browser.utils.checkElement('tagName', el);
        browser.utils.checkElement('name', el, {implicitWait: 2000});
        browser.utils.byText('text of container');
        browser.utils.byText('text of container', 'h1');
        browser.utils.byTextAll('text of container').get(0);
    });
});
```


