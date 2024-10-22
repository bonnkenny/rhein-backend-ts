import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateNewsRecordsDto } from './dto/create-news-records.dto';
import { UpdateNewsRecordsDto } from './dto/update-news-records.dto';
import { NewsRecordsRepository } from './infrastructure/persistence/news-records.repository';
import { NewsRecords } from './domain/news-records';
import { FindAllNewsRecordsDto } from './dto/find-all-news-records.dto';
import { NewsActionEnum } from '@src/utils/enums/news-action.enum';
import { LabelType } from '@src/utils/types/order-types';
import { errorBody } from '@src/utils/infinity-response';

@Injectable()
export class NewsRecordsService {
  constructor(private readonly newsRecordsRepository: NewsRecordsRepository) {}

  create(createNewsRecordsDto: CreateNewsRecordsDto) {
    const { action, orderId, materialId, materialLabel } = createNewsRecordsDto;
    const label: LabelType = {
      en: '',
      ch: '',
    };
    const materialCheck = (
      materialId: string,
      materialLabel: LabelType | undefined,
    ) => {
      if (!materialId || !materialLabel) {
        throw new UnprocessableEntityException(
          errorBody('Material info is required'),
        );
      }
      return true;
    };
    switch (true) {
      case action === NewsActionEnum.CREATE.toString():
        label.en = 'New Order created! ID:' + orderId;
        label.ch = '新增订单,订单ID:' + orderId;
        break;
      case action === NewsActionEnum.MATERIAL_FILLED.toString():
        materialCheck(materialId ?? '', materialLabel);
        label.en = `Order dynamics: User uploads new information, order ID:${orderId},material:${materialLabel?.en}`;
        label.ch = `订单动态: 用户上传新资料,订单ID:${orderId}, 资料名称:${materialLabel?.ch}`;
        break;
      case action === NewsActionEnum.MATERIAL_UPDATE.toString():
        materialCheck(materialId ?? '', materialLabel);
        label.en = `Order dynamics: User updates material information, order ID:${orderId},material:${materialLabel?.en}`;
        label.ch = `订单动态: 用户更新订单资料, 订单ID:${orderId},资料名称:${materialLabel?.ch}`;
        break;
      case action === NewsActionEnum.MATERIAL_APPROVED.toString():
        materialCheck(materialId ?? '', materialLabel);
        label.en = `Order dynamics: the review of single item information for the order has been approved, order ID:${orderId}, material:${materialLabel?.en}`;
        label.ch = `订单动态:订单单项资料审核通过,订单ID:${orderId},资料名称:${materialLabel?.ch}`;
        break;
      case action === NewsActionEnum.MATERIAL_REJECTED.toString():
        materialCheck(materialId ?? '', materialLabel);
        label.en = `Order dynamics: the review of single item information for the order has been rejected, order ID:${orderId}, material:${materialLabel?.en}`;
        label.ch = `订单动态:订单单项资料审核驳回,订单ID:${orderId},资料名称:${materialLabel?.ch}`;
        break;
      case action === NewsActionEnum.REPORTING.toString():
        label.en = `Order dynamics: Order has been approved, order ID:${orderId}`;
        label.ch = `订单动态: 订单已审批,订单ID:${orderId}`;
        break;
      case action === NewsActionEnum.COMPLETED.toString():
        label.en = `Order dynamics: Order has been rejected, order ID:${orderId}`;
        label.ch = `订单动态: 订单已驳回,订单ID:${orderId}`;
        break;
      default:
        throw new UnprocessableEntityException(
          errorBody('News record action type invalid'),
        );
    }
    return this.newsRecordsRepository.create({
      ...createNewsRecordsDto,
      description: label,
    });
  }

  findAllWithPagination(filterOptions: FindAllNewsRecordsDto) {
    return this.newsRecordsRepository.findAllWithPagination(filterOptions);
  }

  findOne(id: NewsRecords['id']) {
    return this.newsRecordsRepository.findById(id);
  }

  update(id: NewsRecords['id'], updateNewsRecordsDto: UpdateNewsRecordsDto) {
    return this.newsRecordsRepository.update(id, updateNewsRecordsDto);
  }

  remove(id: NewsRecords['id']) {
    return this.newsRecordsRepository.remove(id);
  }
}
