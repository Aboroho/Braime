namespace Braime {
  type Operator = "+" | "-" | "*" | "/" | "%";

  interface QuestionSetConfig {
    noq: number;
    terms: Array<{ maximumDigit: number; minimumDigit: number }>;
    operatorSuffle: boolean;
    operators: Array<Braime.Operator>;
    termWillBeHiddenAfter: number;
    mcq: boolean;
  }

  type QuestionToken = {
    type: "operator" | "term";
    value: Operator | number;
  };

  interface Question {
    id: number;
    tokens: QuestionToken[];
  }

  type Questions = Array<Question>;

  interface Preset {
    name: string;
    data: QuestionSetConfig;
  }

  interface Answer {
    value?: number;
    startTime?: number;
    endTime?: number;
  }
}
