import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET (length):", process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.length : 0);

try {
  const rzp = new Razorpay({
    key_id: "rzp_live_SplBptawfhlkLw",
    key_secret: "bppOe3eIn3DG9REN7ZnPKf0d"
  });
  console.log("Razorpay instance initialized successfully.");
  
  const order = await rzp.orders.create({
    amount: 1000,
    currency: "INR",
    receipt: "test_receipt"
  });
  console.log("Order created successfully:", order);
} catch (error) {
  console.error("Error occurred:", error);
}
