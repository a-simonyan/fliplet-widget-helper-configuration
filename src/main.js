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
        fields: { name: 'Doe', type: 'welcome' },
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

  if (data.configuration && data.configuration.beforeReady) {
    var beforeReady = new Function(data.configuration.beforeReady)();

    if (beforeReady) {
      try {
        beforeReady.call(this, data.fields, data.configuration);
      } catch (e) {
        console.warn('The beforeReady function is invalid', e, data.configuration.beforeReady);
      }
    }
  }

  fields.forEach((field) => {
    field.value = _.get(data.fields, field.name, field.default);
  });

  new Vue({
    el: '#helper-configuration',
    render: (createElement) => {
      return createElement(Application);
    }
  });
})();
