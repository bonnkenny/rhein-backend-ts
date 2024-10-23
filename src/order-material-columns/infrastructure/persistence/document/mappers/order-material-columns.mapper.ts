import {
  AutoSizeTypeClass,
  FieldPropsTypeClass,
  OrderMaterialColumn,
} from '@src/order-material-columns/domain/order-material-column';
import { isArray } from 'lodash';
import { OssUtils } from '@src/files/infrastructure/uploader/oss/oss.utils';

export class OrderMaterialColumnsMapper {
  static toDomain(raw: OrderMaterialColumn): OrderMaterialColumn {
    const domain = new OrderMaterialColumn();
    domain.label = { en: raw.label.en, ch: raw.label.ch };
    domain.prop = raw.prop;
    if (!!raw?.rules && isArray(raw?.rules)) {
      domain.rules = raw.rules.map((v) => {
        return {
          required: v.required,
          message: { en: v?.message?.en ?? '', ch: v?.message?.ch ?? '' },
          trigger: v.trigger,
        };
      });
    }

    domain.tooltip = undefined;
    if (!!raw?.tooltip) {
      domain.tooltip = { en: raw.tooltip.en, ch: raw.tooltip.ch };
    }
    let fieldValue = raw?.value ?? undefined;
    if (raw.prop === 'file' && fieldValue) {
      const filesArr: Array<string> = fieldValue.toString().split(',');
      const fieldValueArr: Array<string> = filesArr.map((v) =>
        new OssUtils().getOssSign(v),
      );
      fieldValue = fieldValueArr.join(',');
    }

    domain.value = fieldValue;
    domain.valueType = raw.valueType;
    if (!!raw?.options && isArray(raw?.options)) {
      domain.options = raw.options?.map((v) => {
        return {
          label: { en: v.label.en, ch: v.label.ch },
          value: v.value,
          color: v.color,
        };
      });
    }

    if (raw?.fieldProps) {
      const fieldProps = new FieldPropsTypeClass();
      if (raw.fieldProps.type) {
        fieldProps.type = raw.fieldProps.type;
      }

      if (raw.fieldProps?.maxlength && raw.fieldProps.maxlength > 0) {
        fieldProps.maxlength = raw.fieldProps.maxlength;
      }

      if (Object.keys(raw.fieldProps).includes('showWordLimit')) {
        fieldProps.showWordLimit = Boolean(raw.fieldProps.showWordLimit);
      }

      if (raw.fieldProps?.autoSize) {
        const autoSize = new AutoSizeTypeClass();
        if (raw.fieldProps.autoSize?.minRows) {
          autoSize.minRows = raw.fieldProps.autoSize.minRows;
        }
        if (raw.fieldProps.autoSize?.maxRows) {
          autoSize.maxRows = raw.fieldProps.autoSize.maxRows;
        }

        if (Object.keys(autoSize)) {
          fieldProps.autoSize = autoSize;
        }
      }

      if (raw.fieldProps?.placeholder) {
        fieldProps.placeholder = {
          en: raw.fieldProps.placeholder?.en ?? 'Please input...',
          ch: raw.fieldProps.placeholder?.ch ?? '请输入...',
        };
      }

      if (raw.fieldProps?.startPlaceholder) {
        fieldProps.startPlaceholder = {
          en: raw.fieldProps.startPlaceholder?.en ?? 'Please input...',
          ch: raw.fieldProps.startPlaceholder?.ch ?? '请输入...',
        };
      }

      if (raw.fieldProps?.endPlaceholder) {
        fieldProps.endPlaceholder = {
          en: raw.fieldProps.endPlaceholder?.en ?? 'Please input...',
          ch: raw.fieldProps.endPlaceholder?.ch ?? '请输入...',
        };
      }
    }

    return domain;
  }
}
