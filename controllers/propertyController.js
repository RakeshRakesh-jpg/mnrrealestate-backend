import Property from '../models/propertyModel.js';

export const addProperty = async (req, res) => {
  try {
    const data = req.body;
    const isArray = Array.isArray(data);

    const saved = isArray
      ? await Property.insertMany(data)
      : await new Property(data).save();

    res.status(201).json(saved);
  } catch (error) {
    console.error("Add Error:", error.message);
    res.status(400).json({ message: 'Add failed', error: error.message });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
};