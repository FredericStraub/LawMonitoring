// src/components/Header.jsx
import React from 'react';
import { PlusIcon } from '@heroicons/react/outline';

function Header({ onAddColumn }) {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">EU Legislative Proposals</h1>
        <button
          onClick={onAddColumn}
          className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded focus:outline-none"
          aria-label="Add a column"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Column
        </button>
      </div>
    </header>
  );
}

export default Header;
