# Firebase Integration Instructions

## 1. Add `getMotivations` and `addMotivation` to `src/services/firebase.real.js`

At the top of the file, add `MOTIVATIONS` to COLLECTIONS:

```js
export const COLLECTIONS = {
  BOOKINGS: 'bookings',
  EVENTS: 'events',
  CONFIG: 'config',
  CONTACTS: 'contacts',
  MOTIVATIONS: 'motivations',   // ← ADD THIS
}
```

Then paste these functions at the bottom of `firebase.real.js`:

```js
export async function getMotivations() {
  const snap = await getDocs(collection(db, COLLECTIONS.MOTIVATIONS))
  const list = snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt,
    }
  })
  list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return list
}

export async function addMotivation(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.MOTIVATIONS), {
    message: data.message?.trim(),
    category: data.category?.trim() || 'general',
    author: data.author?.trim() || null,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...data }
}
```

## 2. Add stubs to `src/services/firebase.stub.js`

```js
export async function getMotivations() {
  return []
}

export async function addMotivation() {
  throw new Error('Firebase not connected.')
}
```

## 3. New screens copied to your project

| File | Location |
|------|----------|
| `ChatbotScreen.js` | `src/screens/main/ChatbotScreen.js` |
| `MotivationsScreen.js` | `src/screens/main/MotivationsScreen.js` |
| `AdminScreen.js` | `src/screens/main/AdminScreen.js` (replaces existing) |
| `MainNavigator.js` | `src/navigation/MainNavigator.js` (replaces existing) |

## 4. Add entry points to HomeScreen (optional but recommended)

In `HomeScreen.js`, add quick action buttons for `Motivations` and `Chatbot`:

```js
{ title: 'Daily Word', icon: 'sparkles-outline', color: '#8B5CF6', route: 'Motivations' },
{ title: 'Assistant', icon: 'chatbubble-ellipses-outline', color: '#10B981', route: 'Chatbot' },
```
