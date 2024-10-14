import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import {
  OrderFillStatusEnum,
  OrderStatusEnum,
  OrderTypeEnum,
} from '@src/utils/enums/order-type.enum';
import { UserSchemaClass } from '@src/users/infrastructure/persistence/document/entities/user.schema';
// import { DeepPartial } from '@src/utils/types/deep-partial.type';
// import { User } from '@src/users/domain/user';
// import { OrderMaterial } from '@src/order-materials/domain/order-material';
import { OrderMaterialSchemaClass } from '@src/order-materials/infrastructure/persistence/document/entities/order-material.schema';

export type OrderSchemaDocument = HydratedDocument<OrderSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class OrderSchemaClass extends EntityDocumentHelper {
  @ApiProperty()
  @Prop()
  orderNo: string;

  @ApiProperty()
  @Prop()
  orderName: string;

  @ApiProperty({ type: Types.ObjectId })
  @Prop({ default: null })
  parentId: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ required: true, enum: Object.values(OrderTypeEnum) })
  orderType: string;

  @ApiProperty({ type: String })
  @Prop({ default: null })
  email: string;

  @ApiProperty({ type: Types.ObjectId })
  @Prop({ required: true, type: Types.ObjectId, ref: UserSchemaClass.name })
  userId: Types.ObjectId;

  @ApiProperty({ type: Types.ObjectId })
  @Prop({ required: true, type: Types.ObjectId, ref: UserSchemaClass.name })
  fromUserId: Types.ObjectId;

  @ApiProperty()
  @Prop({ maxlength: 1000 })
  remark: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderFillStatusEnum),
  })
  @Prop({
    default: OrderFillStatusEnum.PENDING,
    enum: Object.keys(OrderFillStatusEnum),
    nullable: false,
  })
  fillStatus: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderStatusEnum),
  })
  @Prop({
    default: OrderStatusEnum.PENDING,
    enum: Object.keys(OrderStatusEnum),
    nullable: false,
  })
  checkStatus: string;

  @ApiProperty({
    type: Boolean,
    description: '是否代理给发起者',
  })
  @Prop({ default: false })
  proxySet: boolean;

  @ApiProperty()
  @Prop()
  deletedAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;

  user?: UserSchemaClass;
  materials?: [OrderMaterialSchemaClass];
}

export const OrderSchema = SchemaFactory.createForClass(OrderSchemaClass);

OrderSchema.index({ orderType: 1 });
OrderSchema.index({ orderNo: 1 });
OrderSchema.index({ email: 1 });
OrderSchema.index({ checkStatus: 1 });
OrderSchema.index({ fillStatus: 1 });

OrderSchema.virtual('user', {
  ref: UserSchemaClass.name,
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

OrderSchema.virtual('materials', {
  ref: 'OrderMaterialSchemaClass',
  localField: '_id',
  foreignField: 'orderId',
  justOne: false,
});
