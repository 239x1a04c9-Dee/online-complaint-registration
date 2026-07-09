const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;
const JSON_DB_DIR = path.join(__dirname, '../data');
const JSON_DB_PATH = path.join(JSON_DB_DIR, 'db.json');

// Ensure data folder and file exists for fallback
if (!fs.existsSync(JSON_DB_DIR)) {
  fs.mkdirSync(JSON_DB_DIR, { recursive: true });
}
if (!fs.existsSync(JSON_DB_PATH)) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify({ users: [], complaints: [] }, null, 2));
}

// Read JSON database
function readJsonDb() {
  try {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON DB, resetting:', err);
    return { users: [], complaints: [] };
  }
}

// Write JSON database
function writeJsonDb(data) {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to JSON DB:', err);
  }
}

// Connect to MongoDB with timeout
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online_complaint_registration';
  console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
  
  try {
    // Set a short timeout (3 seconds) for quick fallback determination
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log('MongoDB connected successfully! Running in Mongo Database Mode.');
  } catch (error) {
    isMongoConnected = false;
    console.log('MongoDB connection failed/timed out. Falling back to local JSON database storage.');
    console.log(`JSON Database file: ${JSON_DB_PATH}`);
  }
};

// Database clients
const db = {
  isMongo: () => isMongoConnected,
  
  users: {
    find: async (query = {}) => {
      if (isMongoConnected) {
        return await mongoose.model('User').find(query);
      } else {
        const data = readJsonDb();
        return data.users.filter(u => {
          return Object.keys(query).every(key => u[key] === query[key]);
        });
      }
    },
    
    findOne: async (query = {}) => {
      if (isMongoConnected) {
        return await mongoose.model('User').findOne(query);
      } else {
        const data = readJsonDb();
        const found = data.users.find(u => {
          return Object.keys(query).every(key => u[key] === query[key]);
        });
        return found || null;
      }
    },
    
    findById: async (id) => {
      if (isMongoConnected) {
        return await mongoose.model('User').findById(id);
      } else {
        const data = readJsonDb();
        return data.users.find(u => u._id === id) || null;
      }
    },
    
    create: async (userData) => {
      if (isMongoConnected) {
        const User = mongoose.model('User');
        const user = new User(userData);
        return await user.save();
      } else {
        const data = readJsonDb();
        const newUser = {
          _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          createdAt: new Date().toISOString(),
          ...userData
        };
        data.users.push(newUser);
        writeJsonDb(data);
        return newUser;
      }
    }
  },
  
  complaints: {
    find: async (query = {}) => {
      if (isMongoConnected) {
        return await mongoose.model('Complaint').find(query).sort({ createdAt: -1 });
      } else {
        const data = readJsonDb();
        
        let results = data.complaints;
        
        // Handle filter by citizen (userId)
        if (query.citizen) {
          results = results.filter(c => c.citizen === query.citizen);
        }
        
        // Handle priority filter
        if (query.priority) {
          results = results.filter(c => c.priority === query.priority);
        }
        
        // Handle status filter
        if (query.status) {
          results = results.filter(c => c.status === query.status);
        }

        // Handle category filter
        if (query.category) {
          results = results.filter(c => c.category === query.category);
        }
        
        // Sort by createdAt descending
        return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    },
    
    findById: async (id) => {
      if (isMongoConnected) {
        return await mongoose.model('Complaint').findById(id);
      } else {
        const data = readJsonDb();
        return data.complaints.find(c => c._id === id) || null;
      }
    },
    
    create: async (complaintData) => {
      if (isMongoConnected) {
        const Complaint = mongoose.model('Complaint');
        const complaint = new Complaint(complaintData);
        return await complaint.save();
      } else {
        const data = readJsonDb();
        const newComplaint = {
          _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'Received',
          timeline: [
            {
              status: 'Received',
              timestamp: new Date().toISOString(),
              message: 'Grievance successfully submitted and registered.'
            }
          ],
          messages: [],
          assignedDepartment: 'Pending Assignment',
          ...complaintData
        };
        data.complaints.push(newComplaint);
        writeJsonDb(data);
        return newComplaint;
      }
    },
    
    findByIdAndUpdate: async (id, update) => {
      if (isMongoConnected) {
        return await mongoose.model('Complaint').findByIdAndUpdate(id, update, { new: true });
      } else {
        const data = readJsonDb();
        const index = data.complaints.findIndex(c => c._id === id);
        if (index === -1) return null;
        
        // Update values
        const current = data.complaints[index];
        const updated = {
          ...current,
          ...update,
          updatedAt: new Date().toISOString()
        };
        
        // Specific array push support
        if (update.$push) {
          for (const key of Object.keys(update.$push)) {
            if (!updated[key]) updated[key] = [];
            updated[key].push({
              _id: Math.random().toString(36).substring(2, 10),
              ...update.$push[key]
            });
          }
          delete updated.$push;
        }
        
        data.complaints[index] = updated;
        writeJsonDb(data);
        return updated;
      }
    }
  }
};

module.exports = { connectDB, db };
