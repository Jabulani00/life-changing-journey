/**
 * Cascade delete / anonymize Firestore data for a user account.
 * Used by the deleteAccount callable Cloud Function.
 */
const admin = require('firebase-admin')

const BUILTIN_ADMIN_EMAILS = ['life.changing@admin.com']

const FieldValue = admin.firestore.FieldValue

async function isUserAdmin(db, uid, email) {
  const userDoc = await db.collection('users').doc(uid).get()
  if (userDoc.exists && userDoc.data()?.isAdmin === true) {
    return true
  }

  const normalized = (email || '').toLowerCase().trim()
  if (!normalized) return false

  const adminsDoc = await db.collection('config').doc('admins').get()
  const emails = adminsDoc.data()?.emails ?? []
  const list =
    Array.isArray(emails) && emails.length > 0
      ? emails.map((e) => String(e).toLowerCase().trim())
      : BUILTIN_ADMIN_EMAILS

  return list.includes(normalized)
}

async function commitInChunks(db, ops) {
  const CHUNK = 400
  for (let i = 0; i < ops.length; i += CHUNK) {
    const batch = db.batch()
    ops.slice(i, i + CHUNK).forEach((op) => {
      if (op.type === 'delete') batch.delete(op.ref)
      else if (op.type === 'update') batch.update(op.ref, op.data)
      else if (op.type === 'set') batch.set(op.ref, op.data, op.options || {})
    })
    await batch.commit()
  }
}

/**
 * @param {FirebaseFirestore.Firestore} db
 * @param {string} uid
 * @param {string|null} email
 */
async function deleteUserData(db, uid, email) {
  const ops = []

  ops.push({ type: 'delete', ref: db.collection('users').doc(uid) })
  ops.push({ type: 'delete', ref: db.collection('user_memberships').doc(uid) })

  const bookingsSnap = await db.collection('bookings').where('userId', '==', uid).get()
  bookingsSnap.docs.forEach((docSnap) => {
    ops.push({
      type: 'update',
      ref: docSnap.ref,
      data: {
        userId: 'deleted',
        userName: '[deleted]',
        userEmail: '[deleted]',
        notes: FieldValue.delete(),
        anonymized: true,
        deletedAt: FieldValue.serverTimestamp(),
      },
    })
  })

  const pushSnap = await db.collection('push_tokens').where('userId', '==', uid).get()
  pushSnap.docs.forEach((docSnap) => {
    ops.push({ type: 'delete', ref: docSnap.ref })
  })

  const tasksSnap = await db.collection('staff_tasks').where('userId', '==', uid).get()
  tasksSnap.docs.forEach((docSnap) => {
    ops.push({
      type: 'update',
      ref: docSnap.ref,
      data: {
        userId: 'deleted',
        userName: '[deleted]',
        userEmail: '[deleted]',
        anonymized: true,
        deletedAt: FieldValue.serverTimestamp(),
      },
    })
  })

  const txSnap = await db.collection('transactions').where('userId', '==', uid).get()
  txSnap.docs.forEach((docSnap) => {
    ops.push({
      type: 'update',
      ref: docSnap.ref,
      data: {
        userId: 'deleted',
        email: FieldValue.delete(),
        anonymized: true,
        anonymizedAt: FieldValue.serverTimestamp(),
      },
    })
  })

  if (email) {
    const normalizedEmail = email.toLowerCase().trim()
    const contactsSnap = await db.collection('contacts').where('email', '==', normalizedEmail).get()
    contactsSnap.docs.forEach((docSnap) => {
      ops.push({
        type: 'update',
        ref: docSnap.ref,
        data: {
          name: '[deleted]',
          email: '[deleted]',
          phone: FieldValue.delete(),
          message: '[deleted]',
          anonymized: true,
          deletedAt: FieldValue.serverTimestamp(),
        },
      })
    })
  }

  if (ops.length > 0) {
    await commitInChunks(db, ops)
  }
}

module.exports = {
  isUserAdmin,
  deleteUserData,
}
