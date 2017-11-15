# protractor-utils-module
adds & extends functions with implicit wait

# usage
The protractor-utils-module is available via npm:

```npm install protractor-utils-module --save```

In your protractor configuration file, register the module:

```
const protractorUtilsModule = require('protractor-utils-module');

exports.config = {
   onPrepare: function() {
      browser.utils = protractorUtilsModule;
   }
}
```