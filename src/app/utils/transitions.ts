import { ITransition } from "../interfaces";

export const transitionsToString = (transitions: ITransition[]) => {
  const transitionStrings = [];

  for (const item of transitions) {
    transitionStrings.push(
      `${item.property} ${item.duration}s ${
        item.easing != null ? item.easing : ""
      }`
    );
  }

  return transitionStrings.join(",");
};
