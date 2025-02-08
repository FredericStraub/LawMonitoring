// src/components/Column.jsx
import React, { useState, useEffect } from 'react';
import LawCard from './LawCard';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

function Column({ backendUrl, category, subcategory, onEdit, onDelete }) {
  const [laws, setLaws] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmpty = !category || !subcategory;

  useEffect(() => {
    if (category && subcategory) {
      setLoading(true);
      fetch(`${backendUrl}/api/laws?category=${encodeURIComponent(category)}&sub_category=${encodeURIComponent(subcategory)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error fetching laws: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          // data is now a list of objects { title, stage_reached, instrument }
          setLaws(data);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    } else {
      setLaws([]);
    }
  }, [category, subcategory, backendUrl]);

  return (
    <div className="inline-block w-64 bg-gray-100 rounded-lg shadow-sm p-4 align-top">
      <div className="flex items-center justify-between mb-4">
        {isEmpty ? (
          <button
            onClick={onEdit}
            className="text-sm font-semibold text-black underline hover:no-underline"
          >
            Select a category
          </button>
        ) : (
          <span className="text-sm font-semibold text-black">{category} - {subcategory}</span>
        )}
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-gray-200 focus:outline-none"
            aria-label="Edit Column"
          >
            <PencilIcon className="h-4 w-4 text-black" />
          </button>
          <button
            onClick={isEmpty ? onEdit : onDelete}
            className="p-1 rounded hover:bg-gray-200 focus:outline-none"
            aria-label={isEmpty ? "Edit Column" : "Delete Column"}
          >
            <TrashIcon className="h-4 w-4 text-black" />
          </button>
        </div>
      </div>
      {isEmpty && (
        <p className="text-gray-600 text-sm">
          No category selected. Click "Select a category" above or the trash icon to pick one.
        </p>
      )}
      {!isEmpty && (
        <>
          {loading && <p className="text-gray-500 text-sm">Loading laws...</p>}
          {error && <p className="text-red-600 text-sm">Error: {error}</p>}
          {!loading && !error && laws.length === 0 && (
            <p className="text-gray-600 text-sm">No laws found.</p>
          )}
          <div className="space-y-2">
            {laws.map((law, idx) => (
              <LawCard key={idx} law={law} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Column;
