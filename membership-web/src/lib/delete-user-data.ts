import { FieldValue, type DocumentReference, type Firestore } from "firebase-admin/firestore";

const BUILTIN_ADMIN_EMAILS = ["life.changing@admin.com"];

type BatchOp =
  | { type: "delete"; ref: DocumentReference }
  | { type: "update"; ref: DocumentReference; data: Record<string, unknown> };

async function commitInChunks(db: Firestore, ops: BatchOp[]) {
  const CHUNK = 400;
  for (let i = 0; i < ops.length; i += CHUNK) {
    const batch = db.batch();
    ops.slice(i, i + CHUNK).forEach((op) => {
      if (op.type === "delete") batch.delete(op.ref);
      else batch.update(op.ref, op.data);
    });
    await batch.commit();
  }
}

export async function isUserAdmin(
  db: Firestore,
  uid: string,
  email: string | null | undefined
): Promise<boolean> {
  const userDoc = await db.collection("users").doc(uid).get();
  if (userDoc.exists && userDoc.data()?.isAdmin === true) {
    return true;
  }

  const normalized = (email || "").toLowerCase().trim();
  if (!normalized) return false;

  const adminsDoc = await db.collection("config").doc("admins").get();
  const emails = (adminsDoc.data()?.emails ?? []) as string[];
  const list =
    Array.isArray(emails) && emails.length > 0
      ? emails.map((e) => String(e).toLowerCase().trim())
      : BUILTIN_ADMIN_EMAILS;

  return list.includes(normalized);
}

export async function deleteUserData(
  db: Firestore,
  uid: string,
  email: string | null | undefined
): Promise<void> {
  const ops: BatchOp[] = [];

  ops.push({ type: "delete", ref: db.collection("users").doc(uid) });
  ops.push({ type: "delete", ref: db.collection("user_memberships").doc(uid) });

  const bookingsSnap = await db.collection("bookings").where("userId", "==", uid).get();
  bookingsSnap.docs.forEach((docSnap) => {
    ops.push({
      type: "update",
      ref: docSnap.ref,
      data: {
        userId: "deleted",
        userName: "[deleted]",
        userEmail: "[deleted]",
        notes: FieldValue.delete(),
        anonymized: true,
        deletedAt: FieldValue.serverTimestamp(),
      },
    });
  });

  const pushSnap = await db.collection("push_tokens").where("userId", "==", uid).get();
  pushSnap.docs.forEach((docSnap) => {
    ops.push({ type: "delete", ref: docSnap.ref });
  });

  const tasksSnap = await db.collection("staff_tasks").where("userId", "==", uid).get();
  tasksSnap.docs.forEach((docSnap) => {
    ops.push({
      type: "update",
      ref: docSnap.ref,
      data: {
        userId: "deleted",
        userName: "[deleted]",
        userEmail: "[deleted]",
        anonymized: true,
        deletedAt: FieldValue.serverTimestamp(),
      },
    });
  });

  const txSnap = await db.collection("transactions").where("userId", "==", uid).get();
  txSnap.docs.forEach((docSnap) => {
    ops.push({
      type: "update",
      ref: docSnap.ref,
      data: {
        userId: "deleted",
        email: FieldValue.delete(),
        anonymized: true,
        anonymizedAt: FieldValue.serverTimestamp(),
      },
    });
  });

  if (email) {
    const normalizedEmail = email.toLowerCase().trim();
    const contactsSnap = await db.collection("contacts").where("email", "==", normalizedEmail).get();
    contactsSnap.docs.forEach((docSnap) => {
      ops.push({
        type: "update",
        ref: docSnap.ref,
        data: {
          name: "[deleted]",
          email: "[deleted]",
          phone: FieldValue.delete(),
          message: "[deleted]",
          anonymized: true,
          deletedAt: FieldValue.serverTimestamp(),
        },
      });
    });
  }

  if (ops.length > 0) {
    await commitInChunks(db, ops);
  }
}
