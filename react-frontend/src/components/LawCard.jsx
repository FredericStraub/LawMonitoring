// src/components/LawCard.jsx
import React from 'react';

function getDotColor(stage) {
  if (stage === 'Procedure completed') {
    return 'bg-green-500';
  } else if (stage === 'Procedure lapsed or withdrawn') {
    return 'bg-red-500';
  } else {
    return 'bg-yellow-500';
  }
}

function LawCard({ law }) {
  const { title, stage_reached, instrument, last_change_date } = law;
  const dotColor = getDotColor(stage_reached);

  return (
    <div className="relative bg-white border border-gray-300 rounded-md p-2 text-black">
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${dotColor} animate-pulse`}></div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <p className="text-xs text-gray-700 mb-1">Stage: {stage_reached}</p>
      <p className="text-xs text-gray-700 mb-1">Instrument: {instrument}</p>
      {last_change_date && last_change_date !== 'Unknown' && (
        <p className="text-xs text-gray-700">Last Change: {last_change_date}</p>
      )}
    </div>
  );
}

export default LawCard;
