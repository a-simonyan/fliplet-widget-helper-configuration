<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <p v-if="description">{{ description }}</p>
    <input v-if="type === 'text'" type="text" class="form-control" v-model="value" :placeholder="placeholder" :required="required">
    <input v-if="type === 'email'" type="email" class="form-control" v-model="value" :placeholder="placeholder" :required="required">
    <textarea v-if="type === 'textarea'" class="form-control" v-model="value" :placeholder="placeholder" :required="required" :rows="rows || 4"></textarea>
    <div class="options" v-if="options && ['radio', 'checkbox'].indexOf(type) !== -1">
      <label v-bind:key="option.value || option" v-for="option in options">
        <input :name="name" :type="type" :value="option.value" /> {{ option.label || option.value || option }}
      </label>
    </div>
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
    'required',
    'rows',
    'options'
  ],
  watch: {
    value(newValue) {
      this.$parent.fields[this.name] = newValue;
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
    if (this.ready) {
      const ready = new Function(this.ready)();
      ready.call(this, this.$el);
    }
  }
};
</script>
