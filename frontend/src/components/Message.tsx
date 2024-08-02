// components/Message.tsx
import React from "react";
import { Avatar } from "../components/ui/avatar";
import { Button } from "../components/ui/button"
import { Volume2, Clipboard, Check } from "lucide-react";
import TypewriterEffect from "./TypewritterEffect";
import DataVisualization from "./DataVisualization";

interface MessageProps {
  message: { text: string; isBot: boolean };
  index: number;
  copiedIndex: number | null;
  handleTextToSpeech: (text: string) => void;
  handleCopyText: (text: string, index: number) => void;
}

const csvData = `
caseID,diagnosisDate,patientAge,condition,notes
CASE001,2024-06-01,22,Chlamydia,"Asymptomatic; treated with antibiotics"
CASE002,2024-06-05,30,Gonorrhea,"Symptomatic; prescribed medication"
CASE003,2024-06-10,27,Herpes,"Genital lesions; ongoing management"
CASE004,2024-06-15,34,Human Papillomavirus (HPV),"Regular screening advised"
CASE005,2024-06-20,29,Trichomoniasis,"Symptomatic; partner treatment recommended"
CASE006,2024-06-25,21,Syphilis,"Early stage; follow-up needed"
CASE007,2024-07-01,31,HIV,"Ongoing antiretroviral therapy"

`;


const Message: React.FC<MessageProps> = ({
  message,
  index,
  copiedIndex,
  handleTextToSpeech,
  handleCopyText,
}) => {
  return (
    <div className={`flex ${message.isBot ? "justify-start" : "justify-end"} mb-3`}>
      {message.isBot ? (
        <div className="flex items-start space-x-2 max-w-md">
          <Avatar className="bg-gradient-to-r from-pink-500 to-purple-600 h-8 w-8">AI</Avatar>
          <div className="bg-white dark:bg-[#241242] text-sm text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow">
            <TypewriterEffect text={message.text} />
            {/* <DataVisualization csvData={csvData} /> */}
            <div className="flex mt-1 space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTextToSpeech(message.text)}
                className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 p-1"
              >
                <Volume2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyText(message.text, index)}
                className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 p-1"
              >
                {copiedIndex === index ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Clipboard className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start space-x-2 max-w-md flex-row-reverse">
          <Avatar className="bg-gradient-to-r from-pink-400 to-purple-500 h-8 w-8">You</Avatar>
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow">
            <p className="text-sm">{message.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
