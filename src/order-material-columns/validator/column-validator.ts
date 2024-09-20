import {
  // ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsLabelType implements ValidatorConstraintInterface {
  validate(label: any): boolean {
    if (typeof label !== 'object' || label === null) {
      return false;
    }
    const keys = Object.keys(label);
    return 'en' in keys && 'ch' in keys;
  }

  defaultMessage(): string {
    return 'The label must be of type LabelType.';
  }
}

@ValidatorConstraint({ async: false })
export class IsRuleType implements ValidatorConstraintInterface {
  validate(rule: any): boolean {
    if (typeof rule !== 'object' || rule === null) {
      return false;
    }
    const keys = Object.keys(rule);
    return 'rule' in keys && 'message' in keys && 'trigger' in keys;
  }

  defaultMessage(): string {
    return 'The rule must be of type RuleType.';
  }
}
