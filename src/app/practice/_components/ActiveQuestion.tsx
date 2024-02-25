"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { RootContext } from "@/context/RootContext";
import { actions } from "@/context/RootContext/rootReducer";
import { evaluateQuestion } from "@/utils/questionUtils";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";

import { FaEye } from "react-icons/fa";
import OperatorToIcon from "@/components/OperatorToIcon";

type Props = {
  question: Braime.Question;
  userAnswer: any;
  questionIdx: number;
  options: Array<Array<number>>;
  handleUserAnswer: (value: any) => void;
};

const ActiveQuestion = ({
  question,
  userAnswer,
  handleUserAnswer,
  questionIdx,
  options,
}: Props) => {
  const [termVisibility, setTermVisibility] = useState(true);
  const visibilityTimeRef = useRef<NodeJS.Timeout | null>(null);
  const { state, dispatch } = useContext(RootContext);
  const config = state.arithmetic.QuestionSetConfig;

  useEffect(() => {
    if (visibilityTimeRef.current) clearTimeout(visibilityTimeRef.current);
    setTermVisibility(true);
    visibilityTimeRef.current = setTimeout(() => {
      setTermVisibility(false);
    }, config.termWillBeHiddenAfter * 1000);
  }, [config.termWillBeHiddenAfter, questionIdx]);

  useEffect(() => {
    if (!termVisibility || !visibilityTimeRef.current) return;
    clearTimeout(visibilityTimeRef.current);
    visibilityTimeRef.current = setTimeout(() => {
      setTermVisibility(false);
    }, config.termWillBeHiddenAfter * 1000);
  }, [termVisibility, config]);

  function invisibleTerm(term: any) {
    term = `${term}`;
    term = term.replaceAll(/[0-9]/gi, "?");
    return term;
  }

  function handleTermVisibility() {
    setTermVisibility(true);
  }

  function renderInputAnswerBox() {
    return (
      <div className="mt-5">
        <Input
          label="Type your answer here"
          type="number"
          value={userAnswer || ""}
          onChange={(e) => handleUserAnswer(e.target.value)}
        />
      </div>
    );
  }

  function renderOptions() {
    console.log(options[questionIdx]);
    return (
      <div className="mt-5">
        <h2 className="font-bold mb-3 text-slate-300">Select An Answer</h2>
        <div className="options flex  gap-3 mb-3 flex-wrap items-center justify-center">
          {options[questionIdx].map((option, idx) => {
            return (
              <Button
                variant="outline"
                onClick={() => handleUserAnswer(option)}
                key={option + "-" + idx + "-" + questionIdx}
                className={`border-0 bg-slate-200 ${
                  userAnswer === option &&
                  "bg-green-400 text-slate-800 hover:bg-green-400 hover:text-slate-800"
                }`}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center bg-slate-700 p-6 rounded-md">
      <div
        className="question-row  flex flex-wrap items-center gap-3 mb-5 justify-center"
        key={question.id}
      >
        {question.tokens.map((token, tokenIdx) => {
          return (
            <div className="expression text-lg" key={tokenIdx}>
              <span
                className={`${
                  token.type == "term"
                    ? "bg-gray-100 rounded-md p-2 font-bold"
                    : "operator"
                } `}
              >
                {token.type == "term" &&
                  (!termVisibility ? invisibleTerm(token.value) : token.value)}

                {token.type == "operator" && (
                  <OperatorToIcon
                    className="text-white"
                    operator={token.value as Braime.Operator}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
      {!termVisibility && (
        <div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleTermVisibility()}
          >
            Show
          </Button>
        </div>
      )}
      {config.mcq ? renderOptions() : renderInputAnswerBox()}
    </div>
  );
};

export default ActiveQuestion;
