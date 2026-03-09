import { Book } from '@/types/book';
import React, { createContext, useCallback, useContext, useState } from 'react';

type BookModalContextType = {
  openBookModal: (book: Book) => void;
  closeBookModal: () => void;
  selectedBook: Book | null;
};

const BookModalContext = createContext<BookModalContextType | undefined>(undefined);

export const BookModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

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
