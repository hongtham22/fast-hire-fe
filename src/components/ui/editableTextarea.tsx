"use client";

import React, { useState } from "react";

function EditableTextarea({ value, onChange }: { value: string; onChange: (text: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(text);
  };

  return isEditing ? (
    <textarea
      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      autoFocus
      rows={6} 
    />
  ) : (
    <p
      className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
      onClick={() => setIsEditing(true)}
    >
      {value || "Click to edit responsibilities..."}
    </p>
  );
}

export default EditableTextarea;
