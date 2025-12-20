# Remaining Work: Portfolio Automation

## Current Status ✅
| Feature | Status | Notes |
|---------|--------|-------|
| GitHub Automation | ✅ Working | Detects new repos, sends Discord alerts |
| Codolio Automation | ✅ Working | Screenshots update daily, auto-commits to GitHub |
| Discord Notifications | ✅ Working | Replaced email (SMTP was blocked on Render) |
| Admin Review Links | ✅ Correct | Using `saranggade.vercel.app` |

---

## Known Issues 🔴

### 1. LinkedIn Automation Fails on Render
**Problem:** Render free tier has only 512 MB RAM. LinkedIn pages are heavy (~400-600 MB just for Chrome). The scraper crashes with timeouts and frame detachment errors.

**Impact:** LinkedIn skills/experience/certifications are NOT being detected.

**Solutions:**
| Option | Effort | Cost |
|--------|--------|------|
| Upgrade Render to 2GB RAM | Easy | $7/month |
| Run LinkedIn checks locally only | Medium | Free |
| Disable LinkedIn automation | None | Free |

---

### 2. Pending Updates Lost on Restart
**Problem:** `pending_updates.json` is stored on Render's filesystem, which is **ephemeral**. When Render restarts (happens often), the file is deleted and all pending updates are lost.

**Impact:** When you click an approval link, it says "Update not found".

**Solution:** Migrate `pendingUpdatesManager.js` to use MongoDB instead of a JSON file.

---

## Future Work: MongoDB Migration for Pending Updates

### Why?
MongoDB persists data permanently. Unlike the JSON file:
- Survives server restarts
- Can be queried efficiently
- Already connected (you have `MONGODB_URI`)

### How?
1. Create a `PendingUpdate` Mongoose model
2. Modify `pendingUpdatesManager.js` to use MongoDB instead of file operations
3. Test locally, then deploy

### Code Changes Required:

#### New File: `backend/models/PendingUpdate.js`
```javascript
const mongoose = require('mongoose');

const pendingUpdateSchema = new mongoose.Schema({
    type: { type: String, required: true }, // 'github', 'linkedin_experience', etc.
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PendingUpdate', pendingUpdateSchema);
```

#### Modified: `backend/services/pendingUpdatesManager.js`
```javascript
const PendingUpdate = require('../models/PendingUpdate');

const getPendingUpdates = async () => {
    return await PendingUpdate.find({});
};

const adddPendingUpdate = async (type, data) => {
    const exists = await PendingUpdate.findOne({ type, 'data.id': data.id });
    if (exists) return exists;
    
    const newUpdate = new PendingUpdate({ type, data });
    await newUpdate.save();
    return newUpdate;
};

const getUpdateById = async (id) => {
    return await PendingUpdate.findById(id);
};

const removeUpdate = async (id) => {
    await PendingUpdate.findByIdAndDelete(id);
};

module.exports = { getPendingUpdates, adddPendingUpdate, getUpdateById, removeUpdate };
```

#### Impact on Other Files:
- `server.js` - All calls to `getPendingUpdates`, `adddPendingUpdate`, etc. must use `await`
- `linkedinService.js` - Same async updates needed

### Estimated Time: ~30 minutes

---

## Summary

| Task | Priority | Effort |
|------|----------|--------|
| MongoDB migration for pending updates | High | 30 min |
| LinkedIn RAM issue | Medium | $7/month or disable |

**Recommended:** Do the MongoDB migration first. LinkedIn can be run locally for now.
