"use client";
import React, { useEffect, useState } from "react";
import { generateQuestion } from "@/utils/questionUtils";
import { RootContext } from "@/context/RootContext";
import { actions } from "@/context/RootContext/rootReducer";
import { useContext } from "react";
import { useRouter } from "next/navigation";

// icons
import { FaPlus, FaTrash } from "react-icons/fa";
// components
import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import OperatorToIcon from "@/components/OperatorToIcon";

// dialog
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

type Props = {};

function Configure({}: Props) {
  const router = useRouter();
  const { state, dispatch } = useContext(RootContext);
  const [inputs, setInputs] = useState<Braime.QuestionSetConfig>({
    noq: 2,
    terms: [
      { minimumDigit: 2, maximumDigit: 2 },
      { minimumDigit: 2, maximumDigit: 2 },
    ],
    operatorSuffle: false,
    operators: ["+"],
    termWillBeHiddenAfter: 5,
    mcq: true,
  });

  const [presetName, setPresetName] = useState("");

  const [errors, setErrors] = useState({
    presetName: "",
  });

  useEffect(() => {
    // dispatch({ type: actions.ADD_QUESTION_SET, payload: [] });
  }, []);

  const { toast } = useToast();
  function confiure() {
    const questions = generateQuestion(inputs);
    dispatch({ type: actions.ADD_QUESTION_SET, payload: questions });
    dispatch({ type: actions.ADD_QUESTION_SET_CONFIG, payload: inputs });
    dispatch({ type: actions.RESET_USER_ANSWER, payload: questions.length });

    router.push("/practice");
  }

  function handleChange(name: string, value: any) {
    const key = name as keyof typeof inputs;

    const newState = structuredClone(inputs);
    switch (key) {
      case "noq":
        newState[key] = value;
        break;
      case "mcq":
        newState[key] = value;
        break;
      case "termWillBeHiddenAfter":
        newState[key] = value;
        break;
      case "operatorSuffle":
        newState[key] = value;
        break;
      default:
        throw new Error("unknow question configuration");
    }
    setInputs(newState);
  }

  function handleTermChange(idx: number, minOrmax: string, value: any) {
    setInputs((prev) => {
      const newState = structuredClone(prev);
      const minMax = minOrmax as keyof (typeof inputs.terms)[0];
      newState.terms[idx][minMax] = value;
      return newState;
    });
  }

  function addTerm() {
    setInputs((prev) => {
      const newState = structuredClone(prev);
      newState.terms.push({ minimumDigit: 2, maximumDigit: 2 });
      return newState;
    });
  }

  function handleSelectOperator(operator: Braime.Operator) {
    const has = inputs.operators.find((op) => op === operator);
    if (has) {
      setInputs((prev) => {
        const newState = structuredClone(prev);
        newState.operators = newState.operators.filter((op) => operator !== op);
        return newState;
      });
    } else {
      setInputs((prev) => {
        const newState = structuredClone(prev);
        newState.operators.push(operator);
        return newState;
      });
    }
  }

  function handleDeleteTerm(idx: number) {
    setInputs((prev) => {
      const newState = structuredClone(prev);
      newState.terms = newState.terms.filter((term, index) => idx !== index);
      return newState;
    });
  }

  function savePreset() {
    const rawPreset = window.localStorage.getItem("preset");
    const preset: Array<Braime.Preset> = JSON.parse(rawPreset || "[]");

    const newPreset = {
      name: presetName,
      data: inputs,
    };
    preset.push(newPreset);
    console.log(preset, newPreset);
    window.localStorage.setItem("preset", JSON.stringify(preset));
    toast({
      title: `New Preset [${presetName}] Saved Successfully`,
      className: "bg-green-500",
    });
  }

  function uniquePresetName() {
    const preset: Array<Braime.Preset> = JSON.parse(
      window.localStorage.getItem("preset") || "[]"
    );
    if (preset.find((p) => p.name === presetName)) {
      return false;
    }
    return true;
  }
  function validatePreset(): boolean {
    if (!presetName) return false;
    if (!uniquePresetName()) return false;

    return true;
  }

  const operatorList: Braime.Operator[] = ["+", "-", "*", "/", "%"];
  return (
    <div className="wrapper text-white">
      <h1 className="text-2xl md:text-3xl mb-8 text-center">
        Configure questions
      </h1>
      <div className="flex flex-col ">
        <div className="flex flex-col gap-4 ">
          <div>
            <Input
              label="Number of Questions"
              type="number"
              value={inputs.noq}
              onChange={(e) => handleChange("noq", e.target.value)}
            />
          </div>
          <div className="">
            <h2 className="mb-3 text-lg">Customize Term</h2>
            <div className="terms-config flex flex-col gap-4 content-center">
              {inputs.terms.map((term, idx) => {
                return (
                  <div key={idx} className="w-full">
                    <label htmlFor="" className="text-sm">{`Term ${
                      idx + 1
                    }`}</label>
                    <div className="flex gap-4 content-center w-full">
                      <Input
                        type="number"
                        placeholder="minimum digit"
                        value={term.minimumDigit}
                        bottomLabel={"minimum digit for this term"}
                        onChange={(e) =>
                          handleTermChange(idx, "minimumDigit", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="maximum digit"
                        value={term.maximumDigit}
                        bottomLabel={"maximum digit for this term"}
                        onChange={(e) =>
                          handleTermChange(idx, "maximumDigit", e.target.value)
                        }
                      />
                      {idx > 1 && (
                        <button
                          className="mt-[-18px]"
                          onClick={() => handleDeleteTerm(idx)}
                        >
                          <Button variant="outline">
                            <FaTrash className="text-red-500 " />
                          </Button>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div>
                <Button onClick={addTerm} className="bg-emerald-700">
                  <FaPlus className="mr-2" /> Add Term
                </Button>
              </div>
            </div>
          </div>
          <div className="operator-section mt-4">
            <h1 className="text-lg mb-4">Choose operators to practice</h1>
            <div className="operators-config flex gap-4">
              {operatorList.map((operator) => {
                return (
                  <span
                    key={operator}
                    onClick={(e) => handleSelectOperator(operator)}
                  >
                    <Button
                      className={`t ${
                        inputs.operators.find((op) => op === operator)
                          ? "bg-white text-black hover:bg-white hover:text-black"
                          : "bg-slate-400 hover:bg-slate-300 hover:text-white"
                      }`}
                    >
                      <OperatorToIcon operator={operator} />
                    </Button>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="should-suffle mt-5">
            <label htmlFor="should-suffle" className="mr-4">
              Suffle Operator in one expression?
            </label>
            <Switch
              id="should-suffle"
              checked={inputs.operatorSuffle}
              onCheckedChange={(status) =>
                handleChange("operatorSuffle", status)
              }
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-400"
            />
          </div>

          <div className="mcq-mode">
            <label htmlFor="mcq-mode" className="mr-4">
              Do you prefer MCQ style?
            </label>
            <Switch
              id="mocq-mode"
              checked={inputs.mcq}
              onCheckedChange={(status) => handleChange("mcq", status)}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-400"
            />
          </div>

          <div className="time-after-term-hide mt-4">
            <Input
              label="Time after expression Term will be hidden"
              type="text"
              value={inputs.termWillBeHiddenAfter}
              onChange={(e) =>
                handleChange("termWillBeHiddenAfter", e.target.value)
              }
              left={
                <span>second{inputs.termWillBeHiddenAfter > 1 && "s"}</span>
              }
            />
          </div>
          <Dialog>
            <DialogTrigger className="text-left">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <FaPlus className="mr-2" />
                Save This Preset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div>{}</div>
              <Input
                type="text"
                label="Preset Name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                error={!uniquePresetName() ? "preset name must be unique" : ""}
              ></Input>
              <DialogFooter>
                <Button disabled={!validatePreset()} className="p-0">
                  <DialogClose
                    className="px-4 w-full h-full"
                    onClick={savePreset}
                  >
                    Save
                  </DialogClose>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            onClick={confiure}
            size={"lg"}
            className="bg-green-600 hover:bg-green-500"
          >
            Generate Question
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Configure;
