import { useEffect, useState } from "react";
import Navbar from './Navbar';

const Test = () => {
    const [offers, setOffers] = useState([]);
    const token = localStorage.getItem("token"); 

    useEffect(() => {
        const fetchExpiredOffers = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/cards/user-expired-offers/", {
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOffers(data.offers);
                } else {
                    console.error("Failed to fetch offers");
                }
            } catch (error) {
                console.error("Error fetching offers:", error);
            }
        };

        fetchExpiredOffers();
    }, [token]);

    return (
        <>
        <Navbar/>
        <div>
            <h2>Expired or Inactive Offers</h2>
            {Array.isArray(offers) && offers.length > 0 ? (
                <ul>
                    {offers.map((offer) => (
                        <li key={offer.id}>
                            <strong>{offer.card_name}</strong> - {offer.offer_type} <br />
                            Price: {offer.buy_now_price || offer.auction_current_price} <br />
                            Auction End: {offer.auction_end_date} <br />
                            Created At: {offer.created_at}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No expired or inactive offers found.</p>
            )}
        </div>
        </>
    );
};

export default Test;