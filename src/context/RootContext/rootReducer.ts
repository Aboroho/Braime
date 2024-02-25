export const actions = {
  ADD_QUESTION_SET: "ARITHMETIC/ADD_QUESTION_SET",
  ADD_USER_ANSWER: "ARITHMETIC/ADD_USER_ANSWER",
  ADD_QUESTION_SET_CONFIG: "ARITHMETIC/ADD_QUESTION_SET_CONFIG",
  RESET_USER_ANSWER: "ARITHMETIC/RESET_USER_ANSWER",
} as const;

export type Action =
  | { type: "ARITHMETIC/ADD_QUESTION_SET"; payload: Braime.Questions }
  | {
      type: "ARITHMETIC/ADD_USER_ANSWER";
      payload: { idx: number; value: Braime.Answer };
    }
  | {
      type: "ARITHMETIC/ADD_QUESTION_SET_CONFIG";
      payload: Braime.QuestionSetConfig;
    }
  | {
      type: "ARITHMETIC/RESET_USER_ANSWER";
      payload?: number;
    };
export const initialState = {
  arithmetic: {
    questions: [] as Braime.Questions,
    userAnswers: [] as Array<Braime.Answer>,
    QuestionSetConfig: {} as Braime.QuestionSetConfig,
  },
};

export default function RootReducer(
  state: typeof initialState,
  action: Action
) {
  const { payload, type } = action;

  switch (type) {
    case actions.ADD_QUESTION_SET:
      return {
        ...state,
        arithmetic: { ...state.arithmetic, questions: action.payload },
      };
    case actions.ADD_USER_ANSWER: {
      const newState = structuredClone(state);

      // state.arithmetic.userAnswers[payload.idx] = payload.value;
      newState.arithmetic.userAnswers[payload.idx] = payload.value;
      return newState;
    }
    case actions.ADD_QUESTION_SET_CONFIG: {
      const newState = structuredClone(state);
      newState.arithmetic.QuestionSetConfig = payload;
      return newState;
    }

    case actions.RESET_USER_ANSWER: {
      const newState = structuredClone(state);
      if (payload)
        newState.arithmetic.userAnswers = new Array(payload).fill({
          startTime: Date.now(),
          endTime: undefined,
          value: undefined,
        });
      else newState.arithmetic.userAnswers = [];
      return newState;
    }
    default:
      throw new Error("Unknow action type");
  }
}
