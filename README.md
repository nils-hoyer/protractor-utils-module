# protractor-utils-module
Extends basic Protractor functionality to ensures visibility of elments before interaction. Added useful custom functions to the utils.

# usage
The protractor-utils-module is available via npm:

```npm install protractor-utils-module --save```

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
        }
        const configImageComparison = {
            baselineFolder: 'path/to/baselineFolder'
            screenshotPath: 'path/to/screenshotPath'
        }
        browser.utils = new ProtractorUtilsModule(config, configImageComparison);
    }
   
}
```

in your jasmine test you can use the following functions:
```
const el = elment(by.css('.elment'));
const opt = by.css('option');
const url = 'https://www.google.de'

describe('protractor-utils-module', function() {
    it('example usage', function() { 
        browser.utils.get('/path');
        browser.utils.click(el);
        browser.utils.click(el, {explicitWait: 1000});
        browser.utils.doubleClick(el);
        browser.utils.clickDropdown(el, opt, 3);
        browser.utils.swipe(el, 50);
        browser.utils.sendKeys(el, 'text');
        browser.utils.sendKeys(el, 'text', {scrollIntoView: true});
        browser.utils.sendKey('enter');
        browser.utils.getText(el);
        browser.utils.setText(el, replace);
        browser.utils.setTextByRegEx(el, search, replace)
        browser.utils.isSelected(el);
        browser.utils.isPresent(el);
        browser.utils.isDisplayed(el);
        browser.utils.isInvisible(el);
        browser.utils.hasText(el, text);
        browser.utils.hasClass(el, 'has-error');
        browser.utils.waitelmentPresence(el);
        browser.utils.waitelmentClickable(el);
        browser.utils.moveMouseTo(el);
        browser.utils.scrollIntoView(el);
        browser.utils.clearBrowserInstance();
        browser.utils.checkScreen('name');
        browser.utils.checkelment('name', el);
        browser.utils.checkelment('name', el, {implicitWait: 7500});
        browser.utils.uploadFile(filePath)
        browser.utils.uploadFile(filePath, 1)
        browser.utils.newTab(url)
        browser.utils.switchToTab(1);
        browser.utils.switchToFrame(); 
        browser.utils.switchToFrame(1); 
        browser.utils.drag(el);
        browser.utils.drop(el);
        browser.utils.printElement(el);
        briwser.utils.sleep(1000, 'error accor without this wait');   
    });
});
```


