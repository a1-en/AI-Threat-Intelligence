import mongoose from 'mongoose';

const lookupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  queryType: {
    type: String,
    enum: ['ip', 'domain', 'email', 'hash', 'url'],
    required: true,
  },
  virusTotalData: {
    type: Object,
    required: true,
  },
  gptSummary: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Lookup || mongoose.model('Lookup', lookupSchema); 