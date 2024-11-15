"use client";

import { updatedEntry } from "@/utils/api";
import { useState } from "react";
import { useAutosave } from "react-autosave";

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      const updated = await updatedEntry(entry.id, _value);
      setIsLoading(false);
    },
  });
  return (
    <div className="w-full h-full">
      {isLoading && <div>...loading</div>}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-full p-8 text-xl outline-none"
      ></textarea>
    </div>
  );
};

export default Editor;
