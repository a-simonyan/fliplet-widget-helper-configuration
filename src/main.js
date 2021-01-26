import Application from './Application.vue';

// Sample data
if (Fliplet.Env.get('development')) {
  window.__widgetData = {
    'com.fliplet.helper-configuration': {
      assetsUrl:
        'https://d2fx5g1ro9ok5z.cloudfront.net/widgets/com.fliplet.helper-configuration/1.0.0/',
      data: {
        name: 'welcome',
        configuration: {
          dependencies: ['tinymce'],
          fields: [{ name: 'name', type: 'text', label: 'Your name' }]
        },
        attr: { name: 'Doe', type: 'welcome' },
        event: 'helper-instance-configure',
        id: 'com.fliplet.helper-configuration',
        package: 'com.fliplet.helper-configuration',
        version: '1.0.0'
      }
    }
  };
}

(function() {
  const data = Fliplet.Widget.getData();
  const fields = _.get(data, 'configuration.fields', []);

  if (!fields.length) {
    Fliplet.Modal.alert({ message: 'This helper has not defined a list of fields for the interface.' });
    return Fliplet.Widget.complete();
  }

  if (data.configuration && data.configuration.beforeInit) {
    var beforeInit = new Function(data.configuration.beforeInit)();

    if (beforeInit) {
      try {
        beforeInit.call(this, data.attr, data.configuration);
      } catch (e) {
        console.warn('The beforeInit function is invalid', e, data.configuration.beforeInit);
      }
    }
  }

  fields.forEach((field) => {
    field.value = _.get(data.attr, field.name, field.default);
  });

  new Vue({
    el: '#helper-configuration',
    render: (createElement) => {
      return createElement(Application);
    }
  });
})();
