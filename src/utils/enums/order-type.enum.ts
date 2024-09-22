export enum OrderTypeEnum {
  // 林场|农户
  MATERIAL_PRODUCER = 'MATERIAL_PRODUCER',
  // 材料加工厂
  MATERIAL_PROCESSOR = 'MATERIAL_PROCESSOR',
  // 贸易商
  TRADER = 'TRADER',
  // 生产商
  PRODUCT_PRODUCER = 'PRODUCT_PRODUCER',
}

export enum OrderStatusEnum {
  // 待审核
  PENDING = 'PENDING',
  // 已审核
  APPROVED = 'APPROVED',
  // 已取消
  REJECTED = 'REJECTED',
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
