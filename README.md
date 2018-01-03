# protractor-utils-module
Extends basic Protractor functionality to ensures visibility of elements before interaction. Added useful custom functions to the utils.

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
            wait: 200,
            waitPresence: 2000,
            waitClickable: 5000,
            scrollIntoView: false,
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
const ele = element(by.css('.element'));
const opt = element(by.css('option'));

describe('protractor-utils-module', function() {
    it('example usage', function() { 
        browser.utils.get('/path');
        browser.utils.click(ele);
        browser.utils.click(ele, {wait: 1000});
        browser.utils.clickDropdown(ele, opt, 3);
        browser.utils.sendKeys(ele, 'text');
        browser.utils.sendKeys(ele, 'text', {scrollIntoView: true});
        browser.utils.getText(ele);
        browser.utils.isDisplayed(ele);
        browser.utils.hasClass(ele, 'has-error');
        browser.utils.clearBrowserInstance();
        browser.utils.checkScreen('name');
        browser.utils.checkElement('name', ele);
        browser.utils.checkElement('name', ele, {waitClickable: 15000});
        browser.utils.switchToTab(1);      
    });
});
```


