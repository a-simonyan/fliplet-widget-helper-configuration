<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <p v-if="description">{{ description }}</p>

    <div class="panel-group" v-if="type === 'group'" v-sortable="{ group: { name: 'fields', pull: false }, scrollSensitivity: 116, scrollSpeed: 10, onAdd: onAdd, onUpdate: onSort }">

      <div class="panel panel-default" v-bind:key="index" v-for="(fieldGroup, index) in value" ref="groupItems">
        <div class="panel-heading ui-sortable-handle">
          <h4 class="panel-title" data-toggle="collapse">
            <div class="screen-reorder-handle">
              <i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i>
            </div>
            <span v-on:click.prevent="onToggleAccordion" class="fa fa-chevron-right chevron"></span>
            <span v-on:click.prevent="onToggleAccordion" class="panel-title-text">{{defaultValueField || 'Untitled'}}</span>
          </h4>
          <a href="#" v-on:click.prevent="onDeleteItem(index)"><span class="icon-delete fa fa-trash"></span></a>
        </div>
        <div class="panel-collapse collapse">
          <div class="panel-body">
            <div class="form">
              <div>
                <template v-for="field in fieldGroup">
                  <field ref="fieldInstances" v-bind="field" v-bind:key="field.name" v-bind:index="index"></field>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br v-if="this.value && this.value.length"/>
      <a class="btn btn-primary" v-on:click.prevent="addItem" href="#">{{ addLabel || 'Add' }}</a>
    </div>
    <input v-if="type === 'text'" type="text" class="form-control" v-model="value" :placeholder="placeholder" :required="required">
    <input v-if="type === 'email'" type="email" class="form-control" v-model="value" :placeholder="placeholder" :required="required">
    <textarea v-if="type === 'textarea'" class="form-control" v-model="value" :placeholder="placeholder" :required="required" :rows="rows || 4"></textarea>
    <div class="options" v-if="options && ['radio', 'checkbox'].indexOf(type) !== -1">
      <label v-bind:key="option.value" v-for="option in options">
        <input :name="name" :type="type" :value="option.value" v-model="value" /> {{ option.label || option.value }}
      </label>
    </div>
    <div v-if="html" v-html="html"></div>
    <div v-if="type === 'provider'" class="provider"></div>
  </div>
</template>

<script>
import { findAll, findOne, findChildren } from '../libs/lookups';

export default {
  props: [
    'type',
    'name',
    'label',
    'html',
    'value',
    'ready',
    'placeholder',
    'default',
    'description',
    'required',
    'rows',
    'options',
    'package',
    'fields',
    'addLabel',
    'index'
  ],
  watch: {
    value(newValue) {
      if (this.$parent.type === 'group') {
        _.find(this.$parent.value[this.index], { name: this.name }).value = newValue;
        return;
      }

      this.$parent.fields[this.name] = newValue;
    }
  },
  methods: {
    find: findAll,
    findOne: findOne,
    children: findChildren,
    val(newValue) {
      if (typeof newValue !== 'undefined') {
        this.value = newValue;
        return;
      }

      return this.value;
    },
    async onSubmit() {
      if (this.$refs.fieldInstances) {
        await Promise.all(this.$refs.fieldInstances.map((field) => {
          return field.onSubmit().then((result) => {
            _.find(this.value[field.index], { name: field.name }).value = result;
          });
        }));

        const newValue = this.value.map((fields) => {
          const obj = {};

          fields.forEach((field) => {
            obj[field.name] = typeof field.value !== 'undefined' ? field.value : field.default;
          });

          return obj;
        });

        this.$parent.fields[this.name] = newValue;
      }

      if (!this.provider) {
        return Promise.resolve(this.value);
      }

      const op = new Promise((resolve) => {
        this.provider.then((result) => {
          this.value = result.data;
          resolve(this.value);
        });
      });

      this.provider.forwardSaveRequest();

      return op;
    },
    onToggleAccordion(event) {
      // Close other items
      $('.panel-collapse').collapse('hide');
      $('.fa-chevron-down').addClass('fa-chevron-right').removeClass('fa-chevron-down');

      const $target = $(event.target).parent().find('.chevron');

      // Expand this item
      $target.closest('.panel').find('.panel-collapse').collapse('show');
      $target.addClass('fa-chevron-down').removeClass('fa-chevron-right');
    },
    onDeleteItem(index) {
      this.value.splice(index, 1);
    },
    addItem() {
      if (!Array.isArray(this.value)) {
        this.value = [];
      }

      const item = JSON.parse(JSON.stringify(this.fields));

      this.value.push(item);

      // TODO: update defaultValueField
    },
    onSort(event) {
      this.value.splice(event.newIndex, 0, this.value.splice(event.oldIndex, 1)[0]);
    },
    onAdd(event) {
      console.log(event);
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
