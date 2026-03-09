import { Book } from '@/types/book';
import React, { createContext, useCallback, useContext, useState } from 'react';

type BookModalContextType = {
  openBookModal: (book: Book) => void;
  closeBookModal: () => void;
  selectedBook: Book | null;
  // Expose a ref to the UI modal to control it 
  // (Alternatively, the modal can handle it itself if placed globally inside this provider)
};

const BookModalContext = createContext<BookModalContextType | undefined>(undefined);

export const BookModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // We rely on the global modal component to read `selectedBook` and listen for changes.
  // Instead of passing references around, the simple act of setting `selectedBook` 
  // can trigger the modal to open if it's rendered globally. But to be safe and use Gorhom's
  // imperative API effectively, we usually let the modal register itself or we trigger state 
  // that the modal reacts to. For this pattern, state-driven is easiest.

  const openBookModal = useCallback((book: Book) => {
    setSelectedBook(book);
  }, []);

  const closeBookModal = useCallback(() => {
    setSelectedBook(null);
  }, []);

  return (
    <BookModalContext.Provider value={{ openBookModal, closeBookModal, selectedBook }}>
      {children}
    </BookModalContext.Provider>
  );
};

export const useBookModal = () => {
  const context = useContext(BookModalContext);
  if (!context) {
    throw new Error('useBookModal must be used within a BookModalProvider');
  }
  return context;
};
