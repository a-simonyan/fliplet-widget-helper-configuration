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

const data = Fliplet.Widget.getData();

data.configuration.fields.forEach((field) => {
  field.type = 'fl' + field.type.charAt(0).toUpperCase() + field.type.slice(1);
  field.value = _.get(data.attr, field.name);
});

import Application from './Application.vue';

new Vue({
  el: '#helper-configuration',
  render: (createElement) => {
    return createElement(Application);
  }
});
