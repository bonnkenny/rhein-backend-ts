export enum OrderTypeEnum {
  // 林场|农户
  FOREST_OWNER = 'FOREST_OWNER',
  // 加工厂
  PAPER_MANUFACTURER = 'PAPER_MANUFACTURER',
  MDF_MANUFACTURER = 'MDF_MANUFACTURER',
  BOARD_MANUFACTURER = 'BOARD_MANUFACTURER',
  RUBBER_MANUFACTURER = 'RUBBER_MANUFACTURER',
  PRODUCT_MANUFACTURER = 'PRODUCT_MANUFACTURER',
  OTHER_MANUFACTURER = 'OTHER_MANUFACTURER',
  // 贸易商
  TRADER = 'TRADER',
  AGENT = 'AGENT',
  SUPPLIER = 'SUPPLIER',
}

export enum MaterialTemplateTypeEnum {
  FOREST_OWNER = 'FOREST_OWNER',
  MANUFACTURER = 'MANUFACTURER',
  TRADER = 'TRADER',
}

export const ManufacturerArray = [
  OrderTypeEnum.PAPER_MANUFACTURER.toString(),
  OrderTypeEnum.MDF_MANUFACTURER.toString(),
  OrderTypeEnum.BOARD_MANUFACTURER.toString(),
  OrderTypeEnum.RUBBER_MANUFACTURER.toString(),
  OrderTypeEnum.PRODUCT_MANUFACTURER.toString(),
  OrderTypeEnum.OTHER_MANUFACTURER.toString(),
];

export const TraderArray = [
  OrderTypeEnum.TRADER.toString(),
  OrderTypeEnum.AGENT.toString(),
  OrderTypeEnum.SUPPLIER.toString(),
];

export enum OrderCheckStatusEnum {
  // 待审核
  PENDING = 'PENDING',
  // 已审核
  APPROVED = 'APPROVED',
  // 已取消
  REJECTED = 'REJECTED',
}

export enum OrderStatusEnum {
  // new order
  PENDING = 'PENDING',
  // part filled or part rejected
  COLLECTING = 'COLLECTING',
  // part approved and have no rejected
  REVIEWING = 'REVIEWING',
  // all approved
  REPORTING = 'REPORTING',
  COMPLETED = 'REJECTED',
}

// 订单填写状态
export enum OrderFillStatusEnum {
  // 未填写
  PENDING = 'PENDING',
  // 填写中
  PROCESSING = 'PROCESSING',
  // 已填写
  FILLED = 'FILLED',
}
