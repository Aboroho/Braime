"use client";

import { useContext, useEffect } from "react";

import { RootContext } from "@/context/RootContext";
import { actions } from "@/context/RootContext/rootReducer";
import { evaluateQuestion } from "@/utils/questionUtils";

import React from "react";
import { redirect } from "next/navigation";
import OperatorToIcon from "@/components/OperatorToIcon";

type Props = {};

interface EvaluetedQuestion extends Braime.Question {
  status: "correct" | "incorrect" | "not answered";
  correctAnswer: number;
}

function Result({}: Props) {
  const { state, dispatch } = useContext(RootContext);
  const questions = state.arithmetic.questions;
  const userAnswers = state.arithmetic.userAnswers;
  let correctCount = 0;
  let incorrectCount = 0;
  let notAnsweredCount = 0;
  const evaluatedQuestions = questions.map((question, idx) => {
    const res = evaluateQuestion(question);
    let status =
      res == userAnswers[idx]
        ? "correct"
        : userAnswers[idx]
        ? "incorrect"
        : "not answered";
    correctCount += status === "correct" ? 1 : 0;
    incorrectCount += status === "incorrect" ? 1 : 0;
    notAnsweredCount += status === "not answered" ? 1 : 0;
    return { ...question, status: status, correctAnswer: res };
  });

  function resolveBadgeClass(status: string) {
    switch (status) {
      case "correct":
        return "bg-green-500 ";
      case "incorrect":
        return "bg-red-500";
      case "not answered":
        return "bg-orange-500";
      default:
        return "";
    }
  }

  useEffect(() => {
    if (questions.length == 0) redirect("/");
  }, [questions]);
  return (
    <div className="wrapper">
      <div className="summary flex gap-4 mb-6">
        <div className="text-center p-4 rounded-sm bg-green-500 text-white">
          <h3>Correct</h3>
          <p className="text-3xl">{correctCount}</p>
        </div>
        <div className="text-center p-4 rounded-sm bg-red-500 text-white">
          <h3>Incorrect</h3>
          <p className="text-3xl">{incorrectCount}</p>
        </div>
        <div className="text-center p-4 rounded-sm bg-orange-500 text-white">
          <h3>Not Answered</h3>
          <p className="text-3xl">{notAnsweredCount}</p>
        </div>
      </div>
      <div className="mb-4">
        <span className="text-xl text-white">
          Total Questions : {questions.length}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {evaluatedQuestions.map((question, questionIdx) => {
          return (
            <div
              key={question.id}
              className=" p-4  rounded-sm  bg-slate-700 text-white"
            >
              <div className="flex gap-3 items-center">
                {question.tokens.map((token, tokenIdx) => {
                  return (
                    <div className="expression" key={tokenIdx}>
                      <span className="rounded-md font-bold">
                        {token.type === "operator" ? (
                          <span>
                            <OperatorToIcon
                              operator={token.value as Braime.Operator}
                            />
                          </span>
                        ) : (
                          <span className="p-2  bg-gray-100 text-black rounded-sm">
                            {token.value}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
                <div
                  className={`text-white px-2 rounded-sm ${resolveBadgeClass(
                    question.status
                  )} `}
                >
                  {question.status}
                </div>
              </div>
              <div className="mt-4">
                <div>
                  Your Answer :{" "}
                  <span className="font-bold">{userAnswers[questionIdx]}</span>
                </div>
                <div>
                  <span className="">Correct Answer</span> :{" "}
                  <span className="font-bold">{question.correctAnswer}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Result;
