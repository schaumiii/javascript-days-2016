module.exports = {
  bundle: {
    main: {},
    vendor: {
      scripts: [
        './bower_components/angular/angular.js',
        './bower_components/angular-animate/angular-animate.js',
        './bower_components/angular-i18n/angular-locale_de-de.js',
        './bower_components/angular-ui-router/release/angular-ui-router.js',
        './bower_components/tether/js/utils.js',
        './bower_components/tether/js/tether.js',
        './bower_components/foundation-apps/dist/js/foundation-apps.js',
        './bower_components/foundation-apps/dist/js/foundation-apps-templates.js',
        './bower_components/moment/min/moment-with-locales.js',
        './bower_components/angular-moment/angular-moment.js',
        './bower_components/paper/dist/paper-full.js',
        './bower_components/lodash/dist/lodash.min.js'
      ],
      styles: [
        './bower_components/font-awesome/css/font-awesome.min.css',
        './bower_components/foundation-apps/dist/css/foundation-apps.css'
      ],
      options: {
        rev: false
      }
    }
  }
};
