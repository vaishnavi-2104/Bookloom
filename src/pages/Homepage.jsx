import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/Firebase";
import Cards from "../components/Cards";
import CardGroup from 'react-bootstrap/CardGroup';
const Homepage = () => {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    firebase.listAllBooks().then((querySnapshot) => {
      const booksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksData);
    });
  }, [firebase]);

  return (
    <div className="container mt-5">
      

      <CardGroup>
      {books.map((book) => (
          <Cards key={book.id} id={book.id} {...book} />
        ))}

      </CardGroup>
    </div>
  );
};

export default Homepage;
