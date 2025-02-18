"use client";

import { updatedEntry } from "@/utils/api";
import { useState } from "react";
import { useAutosave } from "react-autosave";

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);
  const { summary, subject, mood, negative, color } = analysis;
  const analysisData = [
    { name: "Summary", value: summary },
    { name: "Subject", value: subject },
    { name: "Mood", value: mood },
    { name: "Negative", value: negative ? "Yes" : "No" },
  ];

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      const data = await updatedEntry(entry.id, _value);
      setAnalysis(data.analysis);
      setIsLoading(false);
    },
  });
  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        {isLoading && <div>...loading</div>}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-full p-8 text-xl outline-none"
        ></textarea>
      </div>
      <div className="border-l border-black/10">
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item, idx) => (
              <li
                className="flex  px-2 py-4 items-center justify-between border-b border-t border-black/10"
                key={idx}
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Editor;
