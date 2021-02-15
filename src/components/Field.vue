<template>
  <div>
    <div class="form-group">
      <label v-if="label">{{ label }}</label>
      <p v-if="description">{{ description }}</p>
      <input v-if="type === 'text'" type="text" class="form-control" v-model="value" :placeholder="placeholder" :required="required">
      <input v-if="type === 'email'" type="email" class="form-control" v-model="value" :placeholder="placeholder" :required="required">
      <textarea v-if="type === 'textarea'" class="form-control" v-model="value" :placeholder="placeholder" :required="required" :rows="rows || 4"></textarea>
      <div class="options" v-if="options && ['radio', 'checkbox'].indexOf(type) !== -1">
        <label v-bind:key="option.value" v-for="option in options">
          <input :name="name" :type="type" :value="option.value" v-model="value" /> {{ option.label || option.value }}
        </label>
      </div>
      <div v-if="html" v-html="html"></div>
    </div>
    <div v-if="type === 'provider'" class="provider"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      guid: Fliplet.guid()
    };
  },
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
    'options',
    'package'
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
    },
    onSubmit() {
      if (!this.provider) {
        return;
      }

      const op = new Promise((resolve) => {
        this.provider.then((result) => {
          this.value = result.data;
          resolve();
        });
      });

      this.provider.forwardSaveRequest();

      return op;
    }
  },
  mounted() {
    if (this.type === 'provider') {
      if (!this.package) {
        throw new Error('Package is required');
      }

      this.provider = Fliplet.Widget.open(this.package, {
        selector: $(this.$el).find('.provider')[0],
        data: typeof this.value === 'object'
          // Normalize Vue objects into plain JSON objects
          ? JSON.parse(JSON.stringify(this.value))
          : (this.value || {})
      });
    }

    if (this.ready) {
      const ready = new Function(this.ready)();
      ready.call(this, this.$el);
    }
  }
};
</script>
