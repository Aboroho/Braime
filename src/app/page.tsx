"use client";
import { Button } from "@/components/ui/button";
import { generateQuestion } from "@/utils/questionUtils";
import { useContext, useEffect, useState } from "react";

import { RootContext } from "@/context/RootContext";
import { actions } from "@/context/RootContext/rootReducer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaDeleteLeft, FaTrash } from "react-icons/fa6";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { state, dispatch } = useContext(RootContext);
  // const [mode, setMode] = useState<Array<Record<string, any>>({
  //   'addition-easy' : {
  //     title : 'Addition',
  //     subtitle : 'easy',
  //     key : ''
  //   }
  // })
  const router = useRouter();
  const { toast } = useToast();
  const baseConfig: Braime.QuestionSetConfig = {
    mcq: true,
    noq: 10,
    operators: ["+"],
    operatorSuffle: false,
    terms: [
      { minimumDigit: 1, maximumDigit: 2 },
      { minimumDigit: 1, maximumDigit: 2 },
    ],
    termWillBeHiddenAfter: 10,
  };

  const [preset, setPreset] = useState<Array<Braime.Preset>>([]);

  useEffect(() => {
    const localPreset = JSON.parse(
      window.localStorage.getItem("preset") || "[]"
    );
    setPreset(localPreset);
  }, []);

  function additionEasy() {
    return baseConfig;
  }

  function additionMedium() {
    const config = baseConfig;
    config.noq = 15;
    config.terms = [
      { minimumDigit: 2, maximumDigit: 2 },
      { minimumDigit: 2, maximumDigit: 3 },
    ];
    config.termWillBeHiddenAfter = 5;
    return config;
  }

  function additionHard() {
    const config = baseConfig;
    config.noq = 15;
    config.terms = [
      { minimumDigit: 3, maximumDigit: 4 },
      { minimumDigit: 3, maximumDigit: 4 },
    ];
    config.termWillBeHiddenAfter = 5;
    return config;
  }

  function goForPractice(config: Braime.QuestionSetConfig) {
    const questions = generateQuestion(config);
    dispatch({ type: actions.RESET_USER_ANSWER });
    dispatch({ type: actions.ADD_QUESTION_SET, payload: questions });
    dispatch({ type: actions.ADD_QUESTION_SET_CONFIG, payload: config });
    router.push("/practice");
  }
  function handlePresetClick(preset: string) {
    let config: Braime.QuestionSetConfig;
    switch (preset) {
      case "addition-easy":
        config = additionEasy();
        break;
      case "addition-medium":
        config = additionMedium();
        break;
      case "addition-hard":
        config = additionHard();
        break;
      default:
        throw new Error("No preset found");
    }
    goForPractice(config);
  }

  function deletePreset(idx: number) {
    if (!window) return;
    if (!confirm()) return;
    const preset: Array<Braime.Preset> = JSON.parse(
      window.localStorage.getItem("preset") || "[]"
    );
    const newPreset = preset.filter((p, index) => index != idx);
    window.localStorage.setItem("preset", JSON.stringify(newPreset));
    setPreset(newPreset);
    toast({
      title: "Preset deleted",
      className: "text-red-500",
    });
  }

  // function handleLocalPresetClick(preset : Braime.QuestionSetConfig){

  // }
  return (
    <div className="wrapper flex flex-col gap-4">
      <Button
        onClick={() => handlePresetClick("addition-easy")}
        className="bg-slate-200 text-black hover:bg-slate-300 hover:text-black "
      >
        Addition (<span className="text-xs">Easy</span>)
      </Button>
      <Button
        onClick={() => handlePresetClick("addition-medium")}
        className="bg-slate-200 text-black hover:bg-slate-300 hover:text-black "
      >
        Addition (<span className="text-xs">Medium</span>)
      </Button>
      <Button
        onClick={() => handlePresetClick("addition-hard")}
        className="bg-slate-200 text-black hover:bg-slate-300 hover:text-black "
      >
        Addition (<span className="text-xs">Hard</span>)
      </Button>

      <h2 className="text-white">Saved Preset</h2>
      <div className="flex flex-col gap-4">
        {preset && preset.length == 0 && (
          <h2 className="text-slate-300 text-center">No saved preset found</h2>
        )}
        {preset.map((configObject, idx) => {
          return (
            <div key={configObject.name + Math.random()} className="flex ">
              <Button
                onClick={() => goForPractice(configObject.data)}
                className="bg-slate-200 text-black hover:bg-white hover:text-black w-full"
              >
                {configObject.name}
              </Button>
              <Button onClick={() => deletePreset(idx)}>
                <FaTrash className="text-red-500" />
              </Button>
            </div>
          );
        })}
      </div>
      <Link href="/configure-question" className="w-full">
        <Button className="bg-blue-500 hover:bg-blue-600 w-full">
          Customize Question
        </Button>
      </Link>
    </div>
  );
}
