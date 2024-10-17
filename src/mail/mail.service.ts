import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import {
  MailData,
  MailDataWithAccount,
} from './interfaces/mail-data.interface';

import { MaybeType } from '../utils/types/maybe.type';
import { MailerService } from '../mailer/mailer.service';
import path from 'path';
import { AllConfigType } from '../config/config.type';
import { Order } from '@src/orders/domain/order';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.confirmEmail'),
        i18n.t('confirm-email.text1'),
        i18n.t('confirm-email.text2'),
        i18n.t('confirm-email.text3'),
      ]);
    }

    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }) + '/confirm-email',
    );
    url.searchParams.set('hash', mailData.data.hash);
    console.log('before send ->', url.toString());
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'activation.hbs',
      ),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }

  async createUser(
    mailData: MailDataWithAccount<{ hash: string }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let title: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [title, text1, text2, text3] = await Promise.all([
        'TUV通知邮件',
        '您的供应商邀请您使用TUV莱茵供应链信息管理系统,以下是您的账户信息:',
        `登录名称: ${mailData.account}`,
        `登陆密码: ${mailData.password}`,
      ]);
    }

    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }),
    );
    url.searchParams.set('hash', mailData.data.hash);
    console.log('before send ->', url.toString());
    await this.mailerService
      .sendMail({
        to: mailData.to,
        subject: title,
        text: `${url.toString()} ${title}`,
        templatePath: path.join(
          this.configService.getOrThrow('app.workingDirectory', {
            infer: true,
          }),
          'src',
          'mail',
          'mail-templates',
          'new-user-email.hbs',
        ),
        context: {
          title: title,
          url: url.toString(),
          actionTitle: title,
          app_name: this.configService.get('app.name', { infer: true }),
          text1,
          text2,
          text3,
          buttonTitle: '查看',
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async newOrder(
    mailData: MailData<{
      order: Pick<Order, 'orderName'>;
    }>,
  ) {
    const { to, data } = mailData;
    const { order } = data;
    const i18n = I18nContext.current();
    let title: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [title, text1, text2, text3] = await Promise.all([
        'TUV订单通知邮件',
        '您有新的供应链订单,请您及时提供资料',
        `订单名称: ${order.orderName}`,
        '详情请点击按钮查看',
      ]);
    }

    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }),
    );
    await this.mailerService
      .sendMail({
        to,
        subject: title,
        text: `${url.toString()}`,
        templatePath: path.join(
          this.configService.getOrThrow('app.workingDirectory', {
            infer: true,
          }),
          'src',
          'mail',
          'mail-templates',
          'new-order-email.hbs',
        ),
        context: {
          title: title,
          url: url.toString(),
          actionTitle: title,
          app_name: this.configService.get('app.name', { infer: true }),
          text1,
          text2,
          text3,
          buttonTitle: '查看',
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async forgotPassword(
    mailData: MailData<{ hash: string; tokenExpires: number }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    let text4: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3, text4] = await Promise.all([
        i18n.t('common.resetPassword'),
        i18n.t('reset-password.text1'),
        i18n.t('reset-password.text2'),
        i18n.t('reset-password.text3'),
        i18n.t('reset-password.text4'),
      ]);
    }

    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }) + '/password-change',
    );
    url.searchParams.set('hash', mailData.data.hash);
    url.searchParams.set('expires', mailData.data.tokenExpires.toString());

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${url.toString()} ${resetPasswordTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'reset-password.hbs',
      ),
      context: {
        title: resetPasswordTitle,
        url: url.toString(),
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }

  async confirmNewEmail(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.confirmEmail'),
        i18n.t('confirm-new-email.text1'),
        i18n.t('confirm-new-email.text2'),
        i18n.t('confirm-new-email.text3'),
      ]);
    }

    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }) + '/confirm-new-email',
    );
    url.searchParams.set('hash', mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'confirm-new-email.hbs',
      ),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }
}
