import express from "express";
import Item from "./item.model.js"; // adjust path if needed

const router = express.Router();

/* ---------------- GET ALL ---------------- */
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- GET ONE ---------------- */
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json({ data: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- UPDATE ---------------- */
router.put("/:id", async (req, res) => {
  try {
    const updates = {};

    if (req.body.title !== undefined) {
      updates.title = req.body.title;
    }

    if (req.body.summary !== undefined) {
      updates.summary = req.body.summary;
    }

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    res.json({ data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DELETE ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;