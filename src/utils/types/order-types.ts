export type LabelType = {
  en: string;
  ch: string;
};

export type RuleType = {
  trigger?: string;
  message?: LabelType;
  required: boolean;
};
