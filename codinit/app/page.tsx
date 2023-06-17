"use client";

import Image from 'next/image';
import Editor from "@monaco-editor/react";
import { useState, useEffect } from 'react';
import TextareaAutosize from "react-textarea-autosize";
import { TbPrompt } from "react-icons/tb";

/* @client-component */
export default function Home() {
  const [text, setText] = useState("");
  const [fileContent, setFileContent] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [textareaContent, setTextareaContent] = useState('');
  const [apiStatus, setApiStatus] = useState<string>("Offline");
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const libraryLinks = {
    "Weaviate": "https://weaviate.io/developers/weaviate",
    "LangChain": "https://langchain.readthedocs.io/en/latest/"
  };

  const listItems = Object.keys(libraryLinks);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (evt) {
        // evt is of type ProgressEvent<FileReader>
        setFileContent(evt.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const checkApiHealth = async () => {
    try {
      const response = await fetch("http://localhost:8000/health");
      if (response.status === 200) {
        setApiStatus("Online");
      } else {
        setApiStatus("Offline");
      }
    } catch (error) {
      setApiStatus("Offline");
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_code: fileContent,
          prompt: textareaContent,
          libraries: selectedItems.map(item => libraryLinks[item]),
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const responseData = await response.json();
      setGeneratedCode(responseData);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className='flex flex-col justify-center items-center mt-24'>
        <Image
          src="/Logo.png"
          alt="Logo"
          width={250}
          height={250}
          className="self-center"
        />
        <p className='font-mono text-zinc-800 text-sm mt-3'>Let CodInit help you to create your ideas with your favorite libaries! 💖</p>
        <div className="mt-4 text-xs text-zinc-900 font-mono flex justify-center">
          <span className="rounded-indicator">v0.1.0</span>
          <span className="rounded-indicator">API: {apiStatus}</span>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center h-auto mt-24">
        <div className="w-1/3 h-96 bg-zinc-100 m-6 rounded shadow-lg p-4 table-container animate-pop-in  border-2 border-dashed border-green-300">

          <div className="flex items-center mb-4">
            <span className="bg-red-500 rounded-full w-2 h-2 mr-1"></span>
            <span className="bg-yellow-500 rounded-full w-2 h-2 mr-1"></span>
            <span className="bg-green-500 rounded-full w-2 h-2 mr-2"></span>
            <span className="font-mono font-bold text-sm text-zinc-800">my_code.hax</span>
          </div>
          <Editor
            height="calc(100% - 2rem)"
            defaultLanguage="python"
            value={fileContent}
          />
          <div className='mt-6'>
            <input type="file" accept=".py" onChange={handleFileChange} />
          </div>
        </div>

        <div className=" w-1/4 bg-zinc-100 m-6  p-3 rounded-lg shadow-lg animate-pop-in table-container">
          <div className="flex items-center mb-4">
            <TbPrompt className="mr-2"></TbPrompt>
            <p className="text-sm font-mono font-bold text-zinc-800">Code Prompt</p>
          </div>
          <div className="flex items-center text-zinc-800 font-mono">
            <textarea
              placeholder='What to you want to create?'
              value={textareaContent}
              onChange={(e) => setTextareaContent(e.target.value)}
              className="w-full bg-white text-zinc-800 outline-none font-mono p-3 rounded-lg"
            />
          </div>
          <div className="mt-3">
            <p className="text-xs font-mono text-zinc-800 mb-2 text-center"> Select a library you want to use</p>
            <div className="grid grid-cols-2 gap-1">
              {listItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (selectedItems.includes(item)) {
                      setSelectedItems(selectedItems.filter(i => i !== item));
                    } else {
                      setSelectedItems([...selectedItems, item]);
                    }
                  }}
                  className={`cursor-pointer p-9 m-2 rounded-lg shadow-lg animate-pop-in-late table-container flex justify-center transform transition-all duration-200 hover:shadow-xl ${selectedItems.includes(item) ? 'bg-green-400 text-white' : 'bg-zinc-300 hover:bg-zinc-100'}`}
                >
                  <span className="font-mono text-xs">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="p-3 my-2 text-sm text-zinc-800 bg-zinc-100 font-mono animate-pop-in-late rounded-lg focus:outline-none shadow-lg hover:bg-green-400 hover:text-white"
              onClick={handleGenerateClick}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : '⚙️ Generate'}
            </button>
          </div>
          {errorMsg && <p className="error-message font-mono text-xs text-center">{errorMsg}</p>}
        </div>

        <div className="w-1/3 h-96 bg-zinc-200 m-6 rounded shadow-lg p-4 table-container animate-pop-in  border-2 border-dashed border-blue-300">
          <div className="flex items-center mb-4">
            <span className="bg-red-500 rounded-full w-2 h-2 mr-1"></span>
            <span className="bg-yellow-500 rounded-full w-2 h-2 mr-1"></span>
            <span className="bg-green-500 rounded-full w-2 h-2 mr-2"></span>
            <span className="font-mono font-bold text-sm text-zinc-800">magic_code.wow</span>
          </div>
          <Editor
            height="calc(100% - 2rem)"
            defaultLanguage="python"
            value={generatedCode}
          />
        </div>
      </div>
    </div>

  )
}
