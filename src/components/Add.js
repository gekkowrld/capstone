import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import db from '../firebase/sdk'; // Import your Firebase configuration

function Add() {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        description: '',
        manufacturer: '',
        number: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, price, description, manufacturer, number } = product;
        const available = true;
        const currency = 'ksh';

        const collectionRef = collection(db, 'products');
        const payload = { available, currency, description, manufacturer, name, number, price };

        try {
            const docRef = await addDoc(collectionRef, payload);
            console.log('The new ID is: ' + docRef.id);
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product: ', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    return (
        <div>
            <h1>Add a New Product</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Color Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label htmlFor="price">Color Price:</label>
                <input
                    type="text"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    required
                ></textarea><br /><br />

                <label htmlFor="manufacturer">Manufacturer:</label>
                <input
                    type="text"
                    id="manufacturer"
                    name="manufacturer"
                    value={product.manufacturer}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label htmlFor="number">Number:</label>
                <input
                    type="text"
                    id="number"
                    name="number"
                    value={product.number}
                    onChange={handleChange}
                    required
                /><br /><br />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Add;
