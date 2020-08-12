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
      Fliplet.Studio.emit('page-preview-send-event', {
        type: 'helper-configuration-updated',
        data: this.attr
      });

      Fliplet.Studio.emit('widget-save-complete');
    }
  },
  mounted() {
    Fliplet.Widget.onSaveRequest(() => {
      $(this.$refs.submitButton).click();
    });
  }
};
</script>
