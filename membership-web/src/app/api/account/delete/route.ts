import { NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase-admin";
import { deleteUserData, isUserAdmin } from "@/lib/delete-user-data";

export const runtime = "nodejs";

type DeleteBody = { idToken?: string; password?: string };

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as DeleteBody | null;
  const idToken = body?.idToken?.trim();

  if (!idToken) {
    return NextResponse.json({ error: "idToken is required." }, { status: 400 });
  }

  let uid: string;
  let email: string | undefined;

  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    uid = decoded.uid;
    email = decoded.email;
  } catch {
    return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
  }

  if (!uid) {
    return NextResponse.json({ error: "Invalid user." }, { status: 401 });
  }

  const db = getAdminFirestore();

  if (await isUserAdmin(db, uid, email)) {
    return NextResponse.json(
      { error: "Admin accounts cannot be deleted through the app." },
      { status: 403 }
    );
  }

  try {
    await deleteUserData(db, uid, email ?? null);
    await getAdminAuth().deleteUser(uid);
    return NextResponse.json({
      success: true,
      message:
        "Your account has been deleted. Some transaction records may be retained as required by law.",
    });
  } catch (err) {
    console.error("account delete failed", uid, err);
    return NextResponse.json(
      { error: "Account deletion failed. Please try again or contact support." },
      { status: 500 }
    );
  }
}
