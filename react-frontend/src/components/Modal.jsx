// src/components/Modal.jsx
import React, { useState, useEffect } from 'react';

function Modal({ backendUrl, categories, onClose, onSubmit, initialCategory, initialSubcategory }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory || '');
  const [subError, setSubError] = useState('');
  const [subLoading, setSubLoading] = useState(false);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      setSubLoading(true);
      fetch(`${backendUrl}/api/subcategories?category=${encodeURIComponent(selectedCategory)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error fetching subcategories: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => setSubcategories(data))
        .catch((err) => {
          console.error(err);
          setSubError(err.message);
          setSubcategories([]);
        })
        .finally(() => setSubLoading(false));
    } else {
      setSubcategories([]);
      setSelectedSubcategory('');
    }
  }, [selectedCategory, backendUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCategory && selectedSubcategory) {
      onSubmit(selectedCategory, selectedSubcategory);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-black">Select Category and Subcategory</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Main Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">-- Select a category --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div className="mb-4">
              {subLoading ? (
                <p className="text-gray-500">Loading subcategories...</p>
              ) : subError ? (
                <p className="text-red-600">Error: {subError}</p>
              ) : (
                subcategories.length > 0 && (
                  <>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <select
                      id="subcategory"
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    >
                      <option value="">-- Select a subcategory --</option>
                      {subcategories.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </>
                )
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-black text-white rounded hover:bg-gray-800 focus:outline-none ${
                !selectedCategory || !selectedSubcategory ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!selectedCategory || !selectedSubcategory}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
