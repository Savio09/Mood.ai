"use client";

import { askQuestions } from "@/utils/api";
import { useState } from "react";

const Question = () => {
  const [value, setValue] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [response, setResponse] = useState();

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const answer = await askQuestions(value);
    setResponse(answer);
    setValue("");
    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          disabled={loading}
          type="text"
          placeholder="Ask AI a question"
          value={value}
          onChange={onChange}
          className="border border-black/20 px-4 py-2 text-lg rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-400 px-4 py-2 rounded-lg text-lg"
        >
          Ask
        </button>
      </form>
      {loading && <div>loading...</div>}
      {response && <div>{response}</div>}
    </div>
  );
};

export default Question;
