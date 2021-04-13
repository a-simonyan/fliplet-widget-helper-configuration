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
          fields: [
            { name: 'name', type: 'text', label: 'Your name' },
            {
              name: 'buttons',
              label: 'Buttons',
              type: 'group',
              addLabel: 'Add button',
              defaultValueField: 'title',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Button title',
                  placeholder: 'Foo'
                },
                {
                  type: 'provider',
                  name: 'action',
                  label: 'Choose an action to do when the button is pressed',
                  package: 'com.fliplet.link'
                }
              ]
            }
          ]
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
        // eslint-disable-next-line no-console
        console.warn('The beforeReady function is invalid', e, data.configuration.beforeReady);
      }
    }
  }

  fields.forEach((field) => {
    field.value = _.get(data.fields, field.name, field.default);

    // Normalize options
    if (Array.isArray(field.options)) {
      field.options = field.options.map((opt) => {
        if (typeof opt === 'object') {
          return opt;
        }

        return { value: opt };
      });
    }

    if (['checkbox', 'group'].indexOf(field.type) !== -1 && !Array.isArray(field.value)) {
      field.value = [];
    }
  });

  Vue.directive('sortable', {
    inserted: function(el, binding) {
      if (Sortable) {
        new Sortable(el, binding.value || {});
      }
    }
  });

  new Vue({
    el: '#helper-configuration',
    render: (createElement) => {
      return createElement(Application);
    }
  });
})();
