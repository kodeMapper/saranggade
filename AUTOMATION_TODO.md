# Remaining Work: Portfolio Automation

## Current Status ✅
| Feature | Status | Notes |
|---------|--------|-------|
| GitHub Automation | ⚠️ Partial | Works but loses "known repos" on restart |
| Codolio Automation | ✅ Working | Screenshots update daily, auto-commits to GitHub |
| Discord Notifications | ✅ Working | Primary notification method |
| Email Notifications | ⚠️ Backup | Fire-and-forget, may timeout on Render |

---

## Critical Issue 🔴: Ephemeral Filesystem

### The Problem
Render's free tier uses **ephemeral storage**. Two JSON files are affected:

| File | Purpose | Impact When Lost |
|------|---------|------------------|
| `state.json` | Stores `knownRepos` (IDs of repos already notified) | **Old repos appear as "new"** → Duplicate notifications |
| `pending_updates.json` | Stores updates awaiting approval | **"Update not found"** on approval links |

### Root Cause
```
Server starts → Creates state.json → User gets notified → Server restarts → state.json deleted → Same repos appear "new" again
```

---

## Solution: MongoDB Migration

### Why MongoDB?
- ✅ Data persists permanently (not tied to filesystem)
- ✅ Already connected (you have `MONGODB_URI`)
- ✅ No code changes needed on Render dashboard

### What to Migrate

#### 1. State Manager (knownRepos, seenLinkedinItems)
**Current:** `backend/state.json`
**New:** MongoDB collection `botstate`

#### 2. Pending Updates
**Current:** `backend/pending_updates.json`
**New:** MongoDB collection `pendingupdates`

---

## Implementation Plan

### Step 1: Create Mongoose Models

**File: `backend/models/BotState.js`**
```javascript
const mongoose = require('mongoose');

const botStateSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('BotState', botStateSchema);
```

**File: `backend/models/PendingUpdate.js`**
```javascript
const mongoose = require('mongoose');

const pendingUpdateSchema = new mongoose.Schema({
    type: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PendingUpdate', pendingUpdateSchema);
```

### Step 2: Modify State Manager

**File: `backend/services/stateManager.js`**
```javascript
const BotState = require('../models/BotState');

const getState = async () => {
    const doc = await BotState.findOne({ key: 'main' });
    if (!doc) {
        return { knownRepos: [], seenLinkedinItems: [], codolioStats: {} };
    }
    return doc.value;
};

const saveState = async (state) => {
    await BotState.findOneAndUpdate(
        { key: 'main' },
        { value: state },
        { upsert: true }
    );
};

module.exports = { getState, saveState };
```

### Step 3: Modify Pending Updates Manager

**File: `backend/services/pendingUpdatesManager.js`**
```javascript
const PendingUpdate = require('../models/PendingUpdate');

const getPendingUpdates = async () => {
    return await PendingUpdate.find({}).lean();
};

const adddPendingUpdate = async (type, data) => {
    const exists = await PendingUpdate.findOne({ 
        type, 
        $or: [{ 'data.id': data.id }, { 'data.name': data.name }] 
    });
    if (exists) return exists;
    
    const newUpdate = new PendingUpdate({ type, data });
    await newUpdate.save();
    return { id: newUpdate._id.toString(), type, data, receivedAt: newUpdate.receivedAt };
};

const getUpdateById = async (id) => {
    return await PendingUpdate.findById(id).lean();
};

const removeUpdate = async (id) => {
    await PendingUpdate.findByIdAndDelete(id);
};

module.exports = { getPendingUpdates, adddPendingUpdate, getUpdateById, removeUpdate };
```

### Step 4: Update Callers (Add `await`)

Files that need `async/await` updates:
- `server.js` - `runChecks()`, approval routes
- `githubService.js` - `checkGithubUpdates()`, `markRepoAsSeen()`
- `linkedinService.js` - All pending update and state calls

### Step 5: Ensure MongoDB Connection Before Use

In `server.js`, move all cron jobs and routes INSIDE the MongoDB `connect.then()`:
```javascript
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
    
    // Start cron jobs HERE
    // Define routes HERE
    
    app.listen(PORT);
});
```

---

## Summary

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Migrate `stateManager.js` to MongoDB | 🔴 High | 15 min | Fixes duplicate repo notifications |
| Migrate `pendingUpdatesManager.js` to MongoDB | 🔴 High | 20 min | Fixes "Update not found" |
| Update callers with `async/await` | 🟡 Medium | 30 min | Required for above |

**Total Estimated Time:** ~1 hour

---

## Quick Reference

### Current Flow (Broken)
```
Trigger → Create state.json → Restart → state.json GONE → Old repos = "new"
```

### After MongoDB (Fixed)
```
Trigger → Save to MongoDB → Restart → Read from MongoDB → Old repos = "known"
```

