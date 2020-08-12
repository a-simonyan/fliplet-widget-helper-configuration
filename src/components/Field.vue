<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <p v-if="description">{{ description }}</p>
    <input v-if="type === 'text'" type="text" class="form-control" v-model="value" :placeholder="placeholder" :required="required">
    <div v-if="html" v-html="html"></div>
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
    'placeholder',
    'default',
    'description',
    'required'
  ],
  watch: {
    value(newValue) {
      this.$parent.attr[this.name] = newValue;
    }
  },
  methods: {
    val(newValue) {
      if (typeof newValue !== 'undefined') {
        this.value = newValue;
        return;
      }

      return this.value;
    }
  },
  mounted() {
    if (this.init) {
      const init = new Function(this.init)();
      init.call(this, this.$el);
    }
  }
};
</script>
