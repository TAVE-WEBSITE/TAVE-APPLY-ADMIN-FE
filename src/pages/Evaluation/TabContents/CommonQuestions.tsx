import Accordion from "@/components/Accordion/Accordion";
import TextArea from "@/components/Input/TextArea";

interface CommonQuestionsProps {
  applicant: any;
}
const CommonQuestions = ({ applicant }: CommonQuestionsProps) => {
  return (
    <>
      {applicant.commonQuestions.map((q: any) => (
        <Accordion key={q.question} title={q.question} className="w-full">
          <TextArea
            value={q.answer}
            readOnly={true}
            className="w-full h-full"
          />
        </Accordion>
      ))}
    </>
  );
};

export default CommonQuestions;
