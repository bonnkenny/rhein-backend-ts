import {
  // ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validateSync,
} from 'class-validator';
import {
  AutoSizeTypeClass,
  FieldPropsTypeClass,
  LabelTypeClass,
  OptionTypeClass,
  OrderMaterialColumn,
} from '@src/order-material-columns/domain/order-material-column';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { formatErrors } from '@src/utils/functions';

@ValidatorConstraint({ async: false })
export class IsLabelType implements ValidatorConstraintInterface {
  validate(label: any): boolean {
    if (typeof label !== 'object' || label === null) {
      return false;
    }
    const labelInstance = plainToInstance(LabelTypeClass, label);
    const errors = validateSync(labelInstance);
    return !errors.length;
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
    const ruleInstance = plainToInstance(LabelTypeClass, rule);
    const errors = validateSync(ruleInstance);
    return !errors.length;
  }

  defaultMessage(): string {
    return 'The rule must be of type RuleType.';
  }
}

@ValidatorConstraint({ async: false })
export class IsColumnsType implements ValidatorConstraintInterface {
  validate(columns: any[]): boolean {
    if (!Array.isArray(columns)) {
      return false;
    }

    for (const column of columns) {
      // console.log('here', column);
      // console.log('is instance of', column instanceof OrderMaterialColumn);
      // console.log(OrderMaterialColumn);
      const orderMaterialInstance = plainToInstance(
        OrderMaterialColumn,
        column,
      );
      // console.log('valid', orderMaterialInstance);
      const errors = validateSync(orderMaterialInstance);
      if (errors.length) console.log('validate errore', errors);
      if (errors.length) {
        throw new BadRequestException(
          'The columns field invalid,' + formatErrors(errors),
        );
      }
    }

    return true;
  }

  defaultMessage(): string {
    return 'The columns must be type of OrderMaterialColumn objects.';
  }
}

@ValidatorConstraint({ async: false })
export class IsValueType implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (Array.isArray(value)) {
      return false;
    }
    //判断value是否为 String or Boolean or Number
    console.log('value is >> ', value);
    console.log('value type >> ', typeof value);
    return (
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      typeof value === 'number'
    );
  }

  defaultMessage(): string {
    return 'The value must be type of String or Boolean or Number.';
  }
}

@ValidatorConstraint({ async: false })
export class IsOptionsType implements ValidatorConstraintInterface {
  validate(option: any): boolean {
    const optionInstance = plainToInstance(OptionTypeClass, option);
    const errors = validateSync(optionInstance);
    if (errors.length) {
      throw new BadRequestException(
        'The options field invalid,' + formatErrors(errors),
      );
    }
    return true;
  }
  defaultMessage(): string {
    return 'The options must be type of Options type';
  }
}

@ValidatorConstraint({ async: false })
export class IsAutoSizeType implements ValidatorConstraintInterface {
  validate(autoSize: any): boolean {
    const fieldPropsInstance = plainToInstance(AutoSizeTypeClass, autoSize);
    const errors = validateSync(fieldPropsInstance);
    if (errors.length) {
      throw new BadRequestException(
        'The fieldProps.autosize field invalid,' + formatErrors(errors),
      );
    }
    return true;
  }
  defaultMessage(): string {
    return 'The  fieldProps.autosize must be type of autoSize type';
  }
}

@ValidatorConstraint({ async: false })
export class IsFieldPropsType implements ValidatorConstraintInterface {
  validate(fieldProps: any): boolean {
    const fieldPropsInstance = plainToInstance(FieldPropsTypeClass, fieldProps);
    const errors = validateSync(fieldPropsInstance);
    if (errors.length) {
      throw new BadRequestException(
        'The options field invalid,' + formatErrors(errors),
      );
    }
    return true;
  }
  defaultMessage(): string {
    return 'The options must be type of Options type';
  }
}
