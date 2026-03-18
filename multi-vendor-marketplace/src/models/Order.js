const mongoose = require("mongoose");

/**
 * Order Schema
 * Stores purchase history, shipping details, and order status
 */
const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "Order must belong to a user"] 
    },
    items: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product",
          required: [true, "Product ID is required"]
        },
        quantity: { 
          type: Number, 
          required: [true, "Quantity is required"],
          min: [1, "Quantity cannot be less than 1"]
        },
        price: { 
          type: Number, 
          required: [true, "Price at the time of purchase is required"] 
        },
      },
    ],
    shippingAddress: {
      city: { type: String, required: [true, "Shipping city is required"], trim: true },
      address: { type: String, required: [true, "Shipping address is required"], trim: true },
      phone: { type: String, required: [true, "Contact phone number is required"], trim: true },
    },
    totalPrice: { 
      type: Number, 
      required: [true, "Total price must be calculated"] 
    },
    status: { 
      type: String, 
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      lowercase: true
    },
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Order", orderSchema);