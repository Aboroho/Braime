// icons
import { ReactElement } from "react";
import { IconType } from "react-icons";
import { FaPlus, FaMinus, FaTimes, FaDivide, FaPercent } from "react-icons/fa";

/**
 * generate random integer between min and max inclusive
 * @param min number
 * @param max number
 */
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

export const randomIntWithDigitInterval = (
  minDigit: number,
  maxDigit: number
) => {
  const min = Math.pow(10, minDigit - 1);
  const max = Math.pow(10, maxDigit) - 1;

  let res = randomInt(min, max + 1);
  return res;
};

export const suffleArray = (array: Array<any>) => {
  const newArray = [];
  while (array.length) {
    const range = array.length;
    const idx = randomInt(0, range - 1);
    newArray.push(array[idx]);
    array = array.filter((item, index) => idx !== index);
  }
  return newArray;
};

export const generateRandomOption = (
  number: number,
  count: number,
  distance: number
) => {
  let left = Math.floor(count / 2);
  let right = Math.floor(count / 2);
  if (count % 2 == 0) right--;

  console.log(count, left, right);

  const numberList = [];

  while (left--) {
    numberList.push(randomInt(number - distance, number - 1));
  }

  while (right--) {
    numberList.push(randomInt(number + 1, number + distance));
  }
  numberList.push(number);
  console.log(numberList);
  return suffleArray(numberList);
};

export const operatorIconMaper = (operator: Braime.Operator) => {
  const map: Record<Braime.Operator, IconType> = {
    "+": FaPlus,
    "-": FaMinus,
    "*": FaTimes,
    "/": FaDivide,
    "%": FaPercent,
  };

  return map[operator];
};
