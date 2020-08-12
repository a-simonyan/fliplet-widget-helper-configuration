<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <p v-if="description">{{ description }}</p>
    <div v-html="html"></div>
  </div>
</template>

<script>
export default {
  props: [
    'type',
    'name',
    'label',
    'html',
    'value',
    'init',
    'description'
  ],
  mounted() {
    if (this.init) {
      const init = new Function(this.init)();
      init.call(this, this.$el);
    }
  }
};
</script>
