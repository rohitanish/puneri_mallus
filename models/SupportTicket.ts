import mongoose, { Schema, model, models } from 'mongoose';

// 1. Define the structure of your support ticket
const SupportTicketSchema = new Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"] 
  },
  subject: { 
    type: String, 
    required: [true, "Subject is required"] 
  },
  message: { 
    type: String, 
    required: [true, "Message is required"] 
  },
  status: { 
    type: String, 
    enum: ['OPEN', 'RESOLVED', 'ARCHIVED'], 
    default: 'OPEN' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 2. Export the model, ensuring it doesn't get re-compiled during hot reloads
const SupportTicket = models.SupportTicket || model('SupportTicket', SupportTicketSchema);

export default SupportTicket;