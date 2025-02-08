// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Column from './components/Column';
import Modal from './components/Modal';

function App() {
  const [categories, setCategories] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  const [initialCategory, setInitialCategory] = useState('');
  const [initialSubcategory, setInitialSubcategory] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  // Fetch categories on mount
  useEffect(() => {
    fetch(`${backendUrl}/api/categories`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching categories: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, [backendUrl]);

  // Initialize with 3 empty columns if none
  useEffect(() => {
    if (columns.length === 0) {
      setColumns([
        { id: Date.now(), category: '', subcategory: '' },
        { id: Date.now() + 1, category: '', subcategory: '' },
        { id: Date.now() + 2, category: '', subcategory: '' }
      ]);
    }
  }, [columns]);

  const addColumn = () => {
    const newCol = { id: Date.now(), category: '', subcategory: '' };
    setColumns([...columns, newCol]);
  };

  const editColumnCategory = (id, newCategory, newSubcategory) => {
    const updated = columns.map(c => c.id === id ? { ...c, category: newCategory, subcategory: newSubcategory } : c);
    setColumns(updated);
  };

  const deleteColumn = (id) => {
    setColumns(columns.filter(c => c.id !== id));
  };

  const openModalForColumn = (id, currentCat = '', currentSub = '') => {
    setCurrentColumnId(id);
    setInitialCategory(currentCat || '');
    setInitialSubcategory(currentSub || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentColumnId(null);
    setInitialCategory('');
    setInitialSubcategory('');
  };

  const handleModalSubmit = (category, subcategory) => {
    if (currentColumnId !== null) {
      editColumnCategory(currentColumnId, category, subcategory);
    }
    closeModal();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black">
      <Header onAddColumn={addColumn} />

      <main className="flex-1 p-4 overflow-x-auto">
        <div className="inline-flex space-x-4">
          {columns.map(column => (
            <Column
              key={column.id}
              backendUrl={backendUrl}
              category={column.category}
              subcategory={column.subcategory}
              onEdit={() => openModalForColumn(column.id, column.category, column.subcategory)}
              onDelete={() => {
                // If column is empty, onDelete is actually calling onEdit per Column logic
                // If column has category, it actually deletes
                if (column.category && column.subcategory) {
                  deleteColumn(column.id);
                } else {
                  // Already handled in Column: onDelete calls onEdit if empty, so no action here needed
                }
              }}
            />
          ))}
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <Modal
          backendUrl={backendUrl}
          categories={categories}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          initialCategory={initialCategory}
          initialSubcategory={initialSubcategory}
        />
      )}
    </div>
  );
}

export default App;
