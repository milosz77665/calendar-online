"use client";
import { createContext, useReducer } from "react";

const initialState = {
  openSlidePanel: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_PANEL":
      return {
        ...state,
        openSlidePanel: state.openSlidePanel === action.slidePanelToOpen ? null : action.slidePanelToOpen,
      };
    case "CLOSE_PANEL":
      return {
        openSlidePanel: null,
      };
    default:
      return state;
  }
}

export const SlidePanelContext = createContext();

export function SlidePanelContextProvider({ children }) {
  const [panel, handleOpenSlidePanel] = useReducer(reducer, initialState);

  return <SlidePanelContext.Provider value={{ handleOpenSlidePanel, panel }}>{children}</SlidePanelContext.Provider>;
}
