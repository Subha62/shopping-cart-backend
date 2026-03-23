import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


const allowedOrigins = [
  'http://localhost:3000', 
  'https://e-commerce-store-mu-flame.vercel.app' 
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(express.json());

//  Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//  Health check route
app.get('/', (req, res) => {
  res.send('✅ Razorpay backend is running.');
});

//  Create Order route
// app.post('/create-order', async (req, res) => {
//   const { amount, currency } = req.body;

//   if (!amount || !currency) {
//     return res.status(400).json({ error: 'Amount and currency required' });
//   }

//   try {
//     const order = await razorpay.orders.create({
//       amount: amount, // amount in paisa
//       currency,
//       receipt: `receipt_${Math.random().toString(36).substring(7)}`,
//     });

//     console.log(' Order created:', order);
//     res.json(order);
//   } catch (error) {
//     console.error(' Order creation failed:', error);
//     res.status(500).json({
//       error: 'Failed to create order',
//       details: error?.error?.description || error.message,
//     });
//   }
// });


app.post('/create-order', async (req, res) => {
  console.log("BODY:", req.body);

  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ error: 'Amount required' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount, // ✅ already paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // ✅ FIXED
    });

    console.log("✅ Order:", order);
    res.json(order);

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

//  Use dynamic PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Razorpay backend running at http://localhost:${PORT}`)
);



