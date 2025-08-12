import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  type: { type: String, enum: ['sale', 'rent'], required: true }
}, {
  timestamps: true
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
