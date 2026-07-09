const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { db } = require('../config/db');

// @route   POST api/complaints
// @desc    Lodge a new complaint
// @access  Private (Citizen only, but we allow both for safety, checking role optionally)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, category, priority } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  try {
    const complaint = await db.complaints.create({
      citizen: req.user.id,
      citizenName: req.user.name,
      title,
      description,
      category,
      priority: priority || 'Medium',
    });

    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/complaints
// @desc    Get all complaints (Citizen gets their own, Admin gets all)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'citizen') {
      query.citizen = req.user.id;
    }

    // Capture filter query params
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.category) query.category = req.query.category;

    const complaints = await db.complaints.find(query);
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/complaints/:id
// @desc    Get complaint by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await db.complaints.findById(req.id || req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    // Ensure citizen only views their own complaint
    if (req.user.role === 'citizen' && complaint.citizen !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to view this complaint' });
    }

    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/complaints/:id/status
// @desc    Update complaint status & department (Admin only)
// @access  Private
router.put('/:id/status', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Authorization denied. Admin role required.' });
  }

  const { status, message, assignedDepartment } = req.body;

  if (!status) {
    return res.status(400).json({ msg: 'Status is required' });
  }

  try {
    const complaint = await db.complaints.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    const timelineItem = {
      status,
      timestamp: new Date().toISOString(),
      message: message || `Status updated to ${status}.`
    };

    const updateFields = {
      status,
      updatedAt: new Date().toISOString(),
      $push: { timeline: timelineItem }
    };

    if (assignedDepartment) {
      updateFields.assignedDepartment = assignedDepartment;
    }

    const updatedComplaint = await db.complaints.findByIdAndUpdate(
      req.params.id,
      updateFields
    );

    res.json(updatedComplaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/complaints/:id/messages
// @desc    Add dialogue message/comment to complaint
// @access  Private
router.post('/:id/messages', authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ msg: 'Message text is required' });
  }

  try {
    const complaint = await db.complaints.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    // Authorization: citizen check
    if (req.user.role === 'citizen' && complaint.citizen !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const chatMessage = {
      senderId: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      text,
      timestamp: new Date().toISOString(),
    };

    const updatedComplaint = await db.complaints.findByIdAndUpdate(
      req.params.id,
      {
        $push: { messages: chatMessage }
      }
    );

    res.json(updatedComplaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
