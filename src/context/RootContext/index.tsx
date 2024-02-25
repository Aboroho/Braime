"use client";

import { Dispatch, createContext, useReducer } from "react";
import RootReducer, { initialState } from "./rootReducer";

import type { Action } from "./rootReducer";

export const RootContext = createContext<{
  state: typeof initialState;
  dispatch: Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

type Props = {
  children: React.ReactNode;
};
export const Provider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(RootReducer, initialState);

  return (
    <RootContext.Provider value={{ state, dispatch }}>
      {children}
    </RootContext.Provider>
  );
};

export default Provider;
