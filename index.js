const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51Pw92LKDOFX7yDxq94Lc3cAEAOX2zDQ44JtgNkagFb4m2X6ylRjWFTepkD5tMTfp50YXXpE1WxxSw6xKDIWpnj4000xuIzShP8'); // Replace with your Stripe secret key

const app = express();
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Create Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Stripe expects the price in cents
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: 'http://localhost:3000/success', // URL to redirect after successful payment
      cancel_url: 'http://localhost:3000/cancel',  // URL to redirect if user cancels
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
