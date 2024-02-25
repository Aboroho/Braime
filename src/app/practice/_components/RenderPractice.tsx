"use client";

import { useState, useContext, useEffect, useRef, useMemo } from "react";
import { RootContext } from "@/context/RootContext";

import { actions } from "@/context/RootContext/rootReducer";
import { redirect } from "next/navigation";
import ActiveQuestion from "./ActiveQuestion";
import { useRouter } from "next/navigation";

import { FaArrowLeft, FaArrowRight, FaClock, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { time } from "console";
import { generateRandomOption } from "@/utils/common";
import { evaluateQuestion } from "@/utils/questionUtils";

type Props = {};

function RenderPractice() {
  const { state, dispatch } = useContext(RootContext);
  const questions = state.arithmetic.questions;
  const userAnswers = state.arithmetic.userAnswers;
  // const [startTime, setStartTime] = useState(Date.now())
  const [timeTaken, setTimeTaken] = useState(0);

  const questionLength = questions.length;

  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  const [options, setOptions] = useState<Array<Array<number>>>(
    useMemo(
      () =>
        questions.map((q) => generateRandomOption(evaluateQuestion(q), 5, 10)),
      []
    )
  );

  const router = useRouter();

  if (questions.length == 0) redirect("/");

  // useEffect(() => {
  //   setOptions(
  //     questions.map((q) => generateRandomOption(evaluateQuestion(q), 5, 10))
  //   );
  // }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 999);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const userAnswer: Braime.Answer = structuredClone(
      userAnswers[activeQuestionIdx]
    );

    userAnswer.startTime = Date.now();
    dispatch({
      type: actions.ADD_USER_ANSWER,
      payload: { idx: activeQuestionIdx, value: userAnswer },
    });
  }, [activeQuestionIdx]);

  function handleUserAnswer(value: any) {
    const userAnswer: Braime.Answer = structuredClone(
      userAnswers[activeQuestionIdx]
    );

    userAnswer.endTime = Date.now();
    userAnswer.value = value;

    dispatch({
      type: actions.ADD_USER_ANSWER,
      payload: { idx: activeQuestionIdx, value: userAnswer },
    });
  }

  function prevQuestionHandler() {
    if (activeQuestionIdx != 0) {
      setActiveQuestionIdx(activeQuestionIdx - 1);
    }
  }

  function nextQuestionHandler() {
    if (activeQuestionIdx != questionLength - 1) {
      setActiveQuestionIdx(activeQuestionIdx + 1);
    }
  }

  function handleSubmit() {
    router.replace("/result");
    // router.push("/result");
  }

  function renderPagination() {
    if (!userAnswers[activeQuestionIdx]) return;
    return (
      <div className="flex flex-wrap gap-2 p-4 justify-center">
        {questions.map((q, idx) => {
          return (
            <Button
              size="sm"
              key={q.id}
              onClick={() => setActiveQuestionIdx(idx)}
              className={`rounded-lg hover:bg-black hover:text-white ${
                activeQuestionIdx === idx && "bg-black text-white"
              }`}
              variant="outline"
            >
              {userAnswers[idx].value ? (
                <FaCheck className="text-green-500" />
              ) : (
                idx + 1
              )}
            </Button>
          );
        })}
      </div>
    );
  }

  function TimeFormatter(h: number, m: number, s: number) {
    let hour = h > 9 ? h : `0${h}`;
    let minute = m > 9 ? m : `0${m}`;
    let second = s > 9 ? s : `0${s}`;

    return { hour, minute, second };
  }
  function renderTimer() {
    let time = timeTaken;
    const h = Math.floor(time / 3600);
    time %= 3600;
    const m = Math.floor(time / 60);
    time %= 60;
    let s = time;

    const { hour, minute, second } = TimeFormatter(h, m, s);
    return (
      <div>
        <div className="text-center mb-2">
          <Button variant="ghost" size="icon" className="text-3xl">
            <FaClock className="text-white" />
          </Button>
        </div>
        <div className="flex mb-8">
          <Button className="font-bold text-lg rounded-none" variant="outline">
            {hour} H
          </Button>

          <Button className="font-bold text-lg rounded-none" variant="outline">
            {minute} M
          </Button>

          <Button className="font-bold text-lg rounded-none" variant="outline">
            {second} S
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[100vh] bg-slate-900 p-2">
      <div className="timer">{renderTimer()}</div>
      <div>
        <ActiveQuestion
          question={questions[activeQuestionIdx]}
          userAnswer={userAnswers[activeQuestionIdx].value}
          handleUserAnswer={handleUserAnswer}
          questionIdx={activeQuestionIdx}
          options={options}
        />
      </div>
      <div className="navigation-button flex gap-3 items-center">
        <Button variant="outline" onClick={prevQuestionHandler}>
          <FaArrowLeft />
        </Button>
        {activeQuestionIdx == questionLength - 1 ? (
          <Button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-500 "
          >
            Submit
          </Button>
        ) : (
          <Button variant="outline" onClick={nextQuestionHandler}>
            <FaArrowRight />
          </Button>
        )}
      </div>
      <div className="pagination mt-4 rounded-md">{renderPagination()}</div>
    </div>
  );
}

export default RenderPractice;
