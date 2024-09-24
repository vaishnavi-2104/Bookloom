import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useFirebase } from "../context/Firebase";
import { useNavigate } from "react-router-dom";


const Cards = (props) => {
    const firebase = useFirebase();
    const [url, setUrl] = useState(null);
    const navigate= useNavigate();

    useEffect(() => {
        if (props.imageURL) {
            firebase.getImageURL(props.imageURL)
                .then((downloadUrl) => setUrl(downloadUrl))
                .catch((error) => {
                    console.error("Error fetching image URL:", error);
                    setUrl(null); // Set to null if there's an error fetching image URL
                });
        } else {
            setUrl(null); // Set to null if imageURL prop is not provided
        }
    }, [props.imageURL, firebase]);

    const defaultImageURL = "https://via.placeholder.com/150";

    return (
        <Card style={{ width: '18rem', margin:'20px' }}>
            <Card.Img
                variant="top"
                src={url || defaultImageURL} // Use downloaded URL or default image URL
                alt={props.Name}
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = defaultImageURL; // Use default image on error
                }}
            />
            <Card.Body>
                <Card.Title>{props.Name}</Card.Title>
                <Card.Text>
                    Title of the book: {props.Name}<br />
                    Sold by: {props.displayName}<br />
                    Price of the book: ${props.price}
                </Card.Text>
                <Button onClick={e=>navigate(`/book/view/${props.id}`)}variant="primary">View</Button>
            </Card.Body>
        </Card>
    );
}

export default Cards;
