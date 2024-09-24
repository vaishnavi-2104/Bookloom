import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFirebase } from "../context/Firebase";

const List = () => {
  const firebase = useFirebase();

  const [Name, setName] = useState('');
  const [ISBNno, setISBNno] = useState('');
  const [price, setPrice] = useState('');
  const [coverPic, setCoverPic] = useState(null); // Initialize coverPic state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverPic) {
      console.error("Cover pic not selected.");
      return; // Handle case where coverPic is null
    }

    try {
      await firebase.handleCreateNewListing(Name, ISBNno, price, coverPic);
      // Reset form fields or show success message
      setName('');
      setISBNno('');
      setPrice('');
      setCoverPic(null); // Reset coverPic state after submission
    } catch (error) {
      console.error("Error creating listing:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverPic(file); // Update coverPic state with selected file
  };

  return (
    <div className="container mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Book Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Book name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>ISBN number</Form.Label>
          <Form.Control
            type="text"
            placeholder="ISBN number"
            value={ISBNno}
            onChange={(e) => setISBNno(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Cover pic</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create 
        </Button>
      </Form>
    </div>
  );
};

export default List;
