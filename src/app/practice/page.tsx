import { generateQuestion } from "@/utils/questionUtils";
import RenderPractice from "./_components/RenderPractice";
import Link from "next/link";

type Props = {};

function Practice({}: Props) {
  return (
    <>
      <div className="wrapper">
        <RenderPractice />
      </div>
    </>
  );
}

export default Practice;
