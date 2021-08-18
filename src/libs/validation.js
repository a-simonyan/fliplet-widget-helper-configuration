const rules = {
  requiredToggle: {
    validate(value) {
      return {
        required: true,
        valid: !!value
      };
    },
    computesRequired: true,
    message: 'This field is required'
  },
  requiredCheckbox: {
    validate(value) {
      return {
        required: true,
        valid: value && value.length
      };
    },
    computesRequired: true,
    message: 'This field is required'
  },
  requiredList: {
    validate(value) {
      return {
        required: true,
        valid: value && value.length
      };
    },
    computesRequired: true,
    message: 'This field is required'
  }
};
const appliedRules = [];

export function isValidRule(rule) {
  return Object.keys(rules).indexOf(rule) > -1;
}

export function addRule(rule, enabledRules) {
  if (appliedRules.indexOf(rule) > -1 || Object.keys(rules).indexOf(rule) === -1) {
    return;
  }

  appliedRules.push(rule);
  VeeValidate.extend(rule, rules[rule]);

  if (typeof enabledRules === 'object') {
    enabledRules[rule] = true;
  }
}
