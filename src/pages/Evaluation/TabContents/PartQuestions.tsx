import Accordion from "@/components/Accordion/Accordion";
import TextArea from "@/components/Input/TextArea";
import StepCounter from "@/components/StepCounter/StepCounter";

interface PartQuestionsProps {
  applicant: any;
  application: any;
}
const PartQuestions = ({ applicant, application }: PartQuestionsProps) => {
  return (
    <>
      {applicant.partQuestions.map((q: any, index: any) => (
        <Accordion
          key={q.question}
          title={index === 0 ? application.name + q.question : q.question}
          className="w-full"
        >
          {index === 0 ? (
            <StepCounter
              title="Javascript"
              currentStep={2}
              setCurrentStep={() => {}}
              maxStep={5}
              stepLabels={["입문", "초급", "중급", "고급", "전문가"]}
            />
          ) : (
            <TextArea
              value={q.answer}
              readOnly={true}
              className="w-full h-full"
            />
          )}
        </Accordion>
      ))}
    </>
  );
};

export default PartQuestions;
