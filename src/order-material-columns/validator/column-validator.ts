import {
  // ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validateSync,
} from 'class-validator';
import {
  LabelTypeClass,
  OrderMaterialColumn,
} from '@src/order-material-columns/domain/order-material-column';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

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
      console.log('valid', orderMaterialInstance);
      const errors = validateSync(orderMaterialInstance);
      console.log('validate errore', errors);
      if (errors.length) {
        throw new BadRequestException(
          'The columns field invalid,' + this.formatErrors(errors),
        );
      }
    }

    return true;
  }

  defaultMessage(): string {
    return 'The columns must be type of OrderMaterialColumn objects.';
  }
  private formatErrors(errors: any[]): string {
    return errors
      .map((err) => Object.values(err.constraints).join(', '))
      .join('; ');
  }
}
