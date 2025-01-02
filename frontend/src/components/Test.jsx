import React, { useState } from "react";
import axios from "axios";

const Test = () => {
    const [formData, setFormData] = useState({
        card: "",
        offer_type: "",
        buy_now_price: "",
        auction_start_price: "",
        auction_end_date: "",
        front_image: null,
        back_image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token"); // Use appropriate token storage/retrieval
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${token}`,
            },
        };

        const form = new FormData();
        Object.keys(formData).forEach((key) => {
            form.append(key, formData[key]);
        });

        for (let [key, value] of form.entries()) {
          console.log(`${key}:`, value);
        }

        try {
            const response = await axios.post("http://localhost:8000/cards/create-offers/", form, config);
            console.log("Offer created:", response.data);
        } catch (error) {
            console.error("Error creating offer:", error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Card ID:</label>
                <input type="text" name="card" onChange={handleChange} required />
            </div>
            <div>
                <label>Offer Type:</label>
                <select name="offer_type" onChange={handleChange} required>
                    <option value="buy_now">Buy Now</option>
                    <option value="auction">Auction</option>
                    <option value="buy_now_and_auction">Buy Now and Auction</option>
                </select>
            </div>
            <div>
                <label>Buy Now Price:</label>
                <input type="number" name="buy_now_price" onChange={handleChange} />
            </div>
            <div>
                <label>Auction Start Price:</label>
                <input type="number" name="auction_start_price" onChange={handleChange} />
            </div>
            <div>
                <label>Auction End Date:</label>
                <input type="datetime-local" name="auction_end_date" onChange={handleChange} />
            </div>
            <div>
                <label>Front Image:</label>
                <input type="file" name="front_image" onChange={handleFileChange} />
            </div>
            <div>
                <label>Back Image:</label>
                <input type="file" name="back_image" onChange={handleFileChange} />
            </div>
            <button type="submit">Add Offer</button>
        </form>
    );
};

export default Test;