import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from './Navbar';
import '../styles/Home.css';

const Profile = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWinningOffers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/cards/expired-offers/', {
          headers: { 'Authorization': `Token ${token}`, },
        });
        setOffers(response.data);
        console.log(response.data); // For debugging
      } catch (err) {
        setError("Error fetching offers");
      } finally {
        setLoading(false);
      }
    };

    fetchWinningOffers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="flex gap-4 mb-4">
        <button>Aktywne oferty</button>
        <button>Zakończone oferty</button>
        <button>Historia</button>
      </div>
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Wygrane aukcje</h2>
        <div className="offers-container">
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div key={offer.id} className="offer-card">
                {/* Displaying the image */}
                {offer.card && offer.card.image && (
                  <img 
                    src={`http://localhost:8000/${offer.front_image}`}
                    alt={offer.card.name} 
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                )}
                
                {/* Displaying the card name and auction price */}
                <h3 className="text-lg font-semibold">{offer.card.name}</h3>
                <p className="text-gray-600">Cena końcowa: {offer.auction_current_price} PLN</p>
                <p className="text-gray-600">Sprzedał: {offer.seller_username}</p>
                <p className="text-gray-600">Konto do przelewu: {offer.bank_account_number}</p>
                

                {/* Button for each offer */}
                <button className="offer-button"
                  onClick={() => alert('Button clicked for offer ' + offer.card.name)}  // You can replace this with an actual action
                >
                  Podaj dane
                </button>
              </div>
            ))
          ) : (
            <p>No winning offers found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;