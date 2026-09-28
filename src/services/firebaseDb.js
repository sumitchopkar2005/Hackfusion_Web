import { db, storage } from "../Firebase";
import { ref as dbRef, get, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const USERS_PATH = "users";
const TEAMS_PATH = "teams";

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const toUserKey = (email = "") =>
  normalizeEmail(email).replace(/\./g, "_dot_").replace(/@/g, "_at_");

const uploadFile = async (file, folder, fileName) => {
  if (!file) return "";

  const safeName = String(fileName || "upload").replace(/\s+/g, "_");
  const storagePath = `${folder}/${Date.now()}_${safeName}`;
  const fileRef = storageRef(storage, storagePath);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

const buildMemberPayload = async ({
  name,
  email,
  mobile,
  gender,
  isPwd,
  profilePic,
  isLead,
  teamId,
}) => {
  const imageUrl = profilePic
    ? await uploadFile(profilePic, `hackfusion/${teamId}`, `${name}_${isLead ? "lead" : "member"}`)
    : "";

  return {
    member_id: isLead ? `lead_${Date.now()}` : `member_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name,
    email: normalizeEmail(email),
    mobile,
    gender,
    is_pwd: isPwd === "yes" || isPwd === 1 ? 1 : 0,
    is_lead: isLead ? 1 : 0,
    profile_pic: imageUrl,
  };
};

export async function registerTeamWithFirebase(formData) {
  try {
    const teamId = `team_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const leadProfilePic = formData.leadImage;
    const m1ProfilePic = formData.m1Image;
    const m2ProfilePic = formData.m2Image;
    const m3ProfilePic = formData.m3Image;
    const paymentProof = formData.paymentScreenshot;

    const members = [
      await buildMemberPayload({
        name: formData.leadName,
        email: formData.leadEmail,
        mobile: formData.leadMobile,
        gender: formData.leadGender,
        isPwd: formData.leadPwd,
        profilePic: leadProfilePic,
        isLead: true,
        teamId,
      }),
      await buildMemberPayload({
        name: formData.m1Name,
        email: formData.m1Email,
        mobile: formData.m1Mobile,
        gender: formData.m1Gender,
        isPwd: formData.m1Pwd,
        profilePic: m1ProfilePic,
        isLead: false,
        teamId,
      }),
      await buildMemberPayload({
        name: formData.m2Name,
        email: formData.m2Email,
        mobile: formData.m2Mobile,
        gender: formData.m2Gender,
        isPwd: formData.m2Pwd,
        profilePic: m2ProfilePic,
        isLead: false,
        teamId,
      }),
    ];

    if (Number(formData.teamSize) === 4) {
      members.push(
        await buildMemberPayload({
          name: formData.m3Name,
          email: formData.m3Email,
          mobile: formData.m3Mobile,
          gender: formData.m3Gender,
          isPwd: formData.m3Pwd,
          profilePic: m3ProfilePic,
          isLead: false,
          teamId,
        })
      );
    }

    const paymentProofUrl = paymentProof
      ? await uploadFile(paymentProof, `hackfusion/${teamId}`, "payment_proof")
      : "";

    const teamRecord = {
      team_id: teamId,
      team_name: `${formData.leadName}'s Team`,
      theme: "AI in Healthcare",
      abstract: formData.abstract,
      city: formData.city,
      college: formData.college,
      coupon: formData.coupon || "",
      team_size: Number(formData.teamSize || 4),
      payment_status: "pending",
      registration_status: "registered",
      team_logo: "",
      payment_proof: paymentProofUrl,
      members,
      created_at: new Date().toISOString(),
    };

    await set(dbRef(db, `${TEAMS_PATH}/${teamId}`), teamRecord);

    const userKey = toUserKey(formData.leadEmail);
    const userRecord = {
      email: normalizeEmail(formData.leadEmail),
      password: formData.password,
      teamId,
      member_id: members[0].member_id,
      is_lead: true,
      name: formData.leadName,
      token: `firebase_${teamId}`,
    };

    await set(dbRef(db, `${USERS_PATH}/${userKey}`), userRecord);

    return {
      success: true,
      data: {
        team_id: teamId,
        teamId,
      },
      message: "Registration successful",
    };
  } catch (error) {
    console.error("Firebase registration error:", error);
    return {
      success: false,
      message: "Failed to save registration to Firebase.",
    };
  }
}

export async function loginWithFirebase(email, password) {
  try {
    const userKey = toUserKey(email);
    const userSnapshot = await get(dbRef(db, `${USERS_PATH}/${userKey}`));

    if (!userSnapshot.exists()) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const user = userSnapshot.val();

    if (String(user.password) !== String(password)) {
      return {
        success: false,
        message: "Invalid password.",
      };
    }

    return {
      success: true,
      data: {
        email: user.email,
        member_id: user.member_id,
        is_lead: Boolean(user.is_lead),
        teamId: user.teamId,
        token: user.token || `firebase_${user.teamId}`,
      },
      message: "Login successful",
    };
  } catch (error) {
    console.error("Firebase login error:", error);
    return {
      success: false,
      message: "Login failed. Please try again.",
    };
  }
}

export async function getDashboardDataFromFirebase(token) {
  try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const teamId = currentUser.teamId || currentUser.team_id || token;

    if (!teamId) {
      return {
        success: false,
        message: "No active team found.",
      };
    }

    const teamSnapshot = await get(dbRef(db, `${TEAMS_PATH}/${teamId}`));

    if (!teamSnapshot.exists()) {
      return {
        success: false,
        message: "Team not found.",
      };
    }

    const teamData = teamSnapshot.val();
    return {
      success: true,
      data: teamData,
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return {
      success: false,
      message: "Unable to load dashboard data.",
    };
  }
}
