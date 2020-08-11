<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <p v-if="description">{{ description }}</p>
    <input type="text" class="form-control" v-model="value" :placeholder="placeholder">
  </div>
</template>

<script>
export default {
  props: [
    'type',
    'name',
    'label',
    'placeholder',
    'description',
    'value'
  ]
};
</script>
