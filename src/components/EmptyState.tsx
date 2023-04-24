import React from "react";

type Text = {
  text: string;
};
const EmptyState = ({ text }: Text) => {
  return (
    <div className="min-h-12 z-10 flex max-w-full items-center justify-center text-xl capitalize text-slate-400">
      <h3 className="title">{text}</h3>
    </div>
  );
};

export default EmptyState;
