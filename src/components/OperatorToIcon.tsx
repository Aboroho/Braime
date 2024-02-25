import React from "react";
import { IconType } from "react-icons";
import { FaPlus, FaMinus, FaTimes, FaDivide, FaPercent } from "react-icons/fa";

const operatorIconMaper = (operator: Braime.Operator) => {
  const map: Record<Braime.Operator, IconType> = {
    "+": FaPlus,
    "-": FaMinus,
    "*": FaTimes,
    "/": FaDivide,
    "%": FaPercent,
  };

  return map[operator];
};
type Props = {
  operator: Braime.Operator;
  className?: any;
};

function OperatorToIcon({ operator, className }: Props) {
  const Icon = operatorIconMaper(operator);
  return <Icon className={className} />;
}

export default OperatorToIcon;
