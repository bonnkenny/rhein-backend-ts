import { OrderMaterialColumn } from '@src/order-material-columns/domain/order-material-column';

export class OrderMaterialColumnsMapper {
  static toDomain(raw: OrderMaterialColumn): OrderMaterialColumn {
    const domain = new OrderMaterialColumn();
    domain.label = { en: raw.label.en, ch: raw.label.ch };
    domain.prop = raw.prop;
    domain.rules = raw.rules.map((v) => {
      return {
        required: v.required,
        message: { en: v?.message?.en ?? '', ch: v?.message?.ch ?? '' },
        trigger: v.trigger,
      };
    });
    domain.tooltip = undefined;
    if (!!raw?.tooltip) {
      domain.tooltip = { en: raw.tooltip.en, ch: raw.tooltip.ch };
    }
    domain.value = raw?.value ?? undefined;
    domain.valueType = raw.valueType;
    return domain;
  }
}
