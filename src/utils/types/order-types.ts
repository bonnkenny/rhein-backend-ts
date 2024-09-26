export type RuleType = {
  trigger?: string;
  message?: LabelType;
  required: boolean;
};

export type LabelType = {
  en: string;
  ch: string;
};

export type OptionsType = {
  label: LabelType;
  value: string;
  color: string;
};

export type AutoSizeType = {
  minRows: number;
  maxRows: number;
};

export type FieldPropsType = {
  type: string;
  placeholder: LabelType;
  startPlaceholder: LabelType;
  endPlaceholder: LabelType;
  maxlength: number;
  showWordLimit: boolean;
  autoSize: AutoSizeType;
};
