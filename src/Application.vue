<template>
  <div class="interface">
    <h3>{{ configuration.title }}</h3>

    <form class="fields">
      <template v-for="field in configuration.fields">
        <component :is="field.type" v-bind="field" v-bind:key="field.name"></component>
      </template>
    </form>
  </div>
</template>

<script>
import Text from './components/Text';

Vue.component('flText', Text);

export default {
  data() {
    return Fliplet.Widget.getData();
  }
};
</script>
