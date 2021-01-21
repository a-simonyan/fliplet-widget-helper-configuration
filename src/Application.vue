<template>
  <div class="interface">
    <h3>{{ configuration.title }}</h3>

    <form ref="form" class="fields" v-on:submit.prevent="onSubmit">
      <template v-for="field in configuration.fields">
        <field v-bind="field" v-bind:key="field.name"></field>
      </template>
      <input ref="submitButton" type="submit" style="display:none"/>
    </form>
  </div>
</template>

<script>
import Field from './components/Field';

Vue.component('Field', Field);

export default {
  data() {
    return Fliplet.Widget.getData();
  },
  methods: {
    onSubmit() {
      var vm = this;
      var beforeSave;

      if (this.configuration.beforeSave) {
        var beforeSaveFunction = new Function(this.configuration.beforeSave)();

        beforeSave = beforeSaveFunction.call(this, this.attr, this.configuration);
      }

      if (!(beforeSave instanceof Promise)) {
        beforeSave = Promise.resolve();
      }

      beforeSave.then(function() {
        Fliplet.Studio.emit('page-preview-send-event', {
          type: 'helper-configuration-updated',
          // remove reactivity so objects are properly converted
          // into data that can be transmitted
          data: JSON.parse(JSON.stringify(vm.attr))
        });

        Fliplet.Studio.emit('widget-save-complete');
      }).catch(function(err) {
        console.warn('Cannot save helper configuration', err);

        Fliplet.Modal.alert({ message: Fliplet.parseError(err) });
      });
    }
  },
  mounted() {
    var vm = this;

    Fliplet.Widget.onSaveRequest(function() {
      $(vm.$refs.submitButton).click();
    });

    if (this.configuration.init) {
      var init = new Function(this.configuration.init)();

      init.call(this, this.attr, this.configuration);
    }
  }
};
</script>
