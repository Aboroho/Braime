import { randomInt } from "@/utils/common";
import { randomIntWithDigitInterval } from "./common";
export const generateQuestion = (config: Braime.QuestionSetConfig) => {
  const operators = config.operators;
  const operatorsCount = operators.length;

  const questions: Braime.Questions = [];

  for (let i = 1; i <= config.noq; i++) {
    const termCount = config.terms.length;

    if (termCount < 2)
      throw new Error("Number of term should be greater than 1");

    let operator = config.operators[randomInt(0, operatorsCount - 1)];
    const question: Braime.Question = {
      id: Math.random() * Date.now(),
      tokens: [],
    };

    let curTerm = 0;
    for (let i = 1; i <= termCount * 2 - 1; i++) {
      if (i % 2 == 1) {
        const number = randomIntWithDigitInterval(
          config.terms[curTerm].minimumDigit,
          config.terms[curTerm].maximumDigit
        );
        question.tokens.push({ type: "term", value: number });
        curTerm++;
      } else {
        if (config.operatorSuffle) {
          operator = config.operators[randomInt(0, operatorsCount - 1)];
        }
        question.tokens.push({ type: "operator", value: operator });
      }
    }
    questions.push(question);
  }

  return questions;
};

export const evaluateQuestion = (question: Braime.Question) => {
  let exp = question.tokens.reduce((accumulator, cur) => {
    accumulator = `${accumulator}${cur.value}`;
    return accumulator;
  }, "");
  return eval(exp);
};
