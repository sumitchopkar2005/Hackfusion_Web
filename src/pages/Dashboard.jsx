import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Camera, X, Check, Crop, UserPlus, Trash2 } from "lucide-react";
import { getDashboardDataFromFirebase } from "../services/firebaseDb";

function Dashboard() {
  const [teamData, setTeamData] = useState(null);
  const [editMode, setEditMode] = useState({
    teamInfo: false,
    lead: false,
    member1: false,
    member2: false,
    member3: false,
    abstract: false,
  });

  const [hideEditButtons, setHideEditButtons] = useState(false);
  const [imageEditMode, setImageEditMode] = useState({
    lead: false,
    member1: false,
    member2: false,
    member3: false,
  });

  const [croppingMode, setCroppingMode] = useState({
    lead: false,
    member1: false,
    member2: false,
    member3: false,
  });

  const [cropPosition, setCropPosition] = useState({
    lead: { x: 0, y: 0 },
    member1: { x: 0, y: 0 },
    member2: { x: 0, y: 0 },
    member3: { x: 0, y: 0 },
  });

  const [cropSize, setCropSize] = useState({
    lead: 100,
    member1: 100,
    member2: 100,
    member3: 100,
  });

  const [isDragging, setIsDragging] = useState({
    lead: false,
    member1: false,
    member2: false,
    member3: false,
  });

  const [dragStart, setDragStart] = useState({
    lead: { x: 0, y: 0 },
    member1: { x: 0, y: 0 },
    member2: { x: 0, y: 0 },
    member3: { x: 0, y: 0 },
  });

  const cropContainerRefs = {
    lead: useRef(null),
    member1: useRef(null),
    member2: useRef(null),
    member3: useRef(null),
  };

  const [selectedImages, setSelectedImages] = useState({
    lead: null,
    member1: null,
    member2: null,
    member3: null,
  });

  const canvasRef = useRef(null);
  const fileInputRefs = {
    lead: useRef(null),
    member1: useRef(null),
    member2: useRef(null),
    member3: useRef(null),
  };

  const navigate = useNavigate();
  const [isLead, setIsLead] = useState(false);
  const [userId, setUserId] = useState(null);

  // New state for adding member
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "M",
    isPwd: "no",
    profilePic: null,
  });
  const [addMemberErrors, setAddMemberErrors] = useState({});
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);

  // Change password state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Delete member state
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  const linkify = (text) => {
    if (!text) return "";

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-yellow-400 underline hover:text-yellow-300">${url}</a>`
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userIdFromStorage = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).member_id
      : null;
    const isLeadFromStorage = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).is_lead
      : null;
    setIsLead(isLeadFromStorage);
    setUserId(userIdFromStorage);

    if (!token) {
      navigate("/login");
      return;
    }

    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const res = await getDashboardDataFromFirebase(token);

      if (res.success) {
        const data = res.data;
        const members = Array.isArray(data.members) ? data.members : [];
        const leadMember = members.find((member) => Number(member.is_lead) === 1) || members[0] || {};
        const otherMembers = members.filter((member) => Number(member.is_lead) !== 1);

        const transformedData = {
          teamId: data.team_id,
          teamName: data.team_name,
          theme: data.theme,
          abstract: data.abstract,
          teamSize: data.team_size,
          city: data.city,
          college: data.college,
          coupon: data.coupon,
          paymentStatus: data.payment_status,
          registrationStatus: data.registration_status,
          teamLogo: data.team_logo,
          paymentProof: data.payment_proof,

          leadId: leadMember?.member_id || "",
          leadName: leadMember?.name || "",
          leadEmail: leadMember?.email || "",
          leadMobile: leadMember?.mobile || "",
          leadGender: leadMember?.gender || "M",
          leadPwd: leadMember?.is_pwd === 1 ? "yes" : "no",
          leadProfilePic: leadMember?.profile_pic || "",

          m1Id: otherMembers[0]?.member_id || "",
          m1Name: otherMembers[0]?.name || "",
          m1Email: otherMembers[0]?.email || "",
          m1Mobile: otherMembers[0]?.mobile || "",
          m1Gender: otherMembers[0]?.gender || "M",
          m1Pwd: otherMembers[0]?.is_pwd === 1 ? "yes" : "no",
          m1ProfilePic: otherMembers[0]?.profile_pic || "",

          m2Id: otherMembers[1]?.member_id || "",
          m2Name: otherMembers[1]?.name || "",
          m2Email: otherMembers[1]?.email || "",
          m2Mobile: otherMembers[1]?.mobile || "",
          m2Gender: otherMembers[1]?.gender || "M",
          m2Pwd: otherMembers[1]?.is_pwd === 1 ? "yes" : "no",
          m2ProfilePic: otherMembers[1]?.profile_pic || "",

          m3Id: otherMembers[2]?.member_id || "",
          m3Name: otherMembers[2]?.name || "",
          m3Email: otherMembers[2]?.email || "",
          m3Mobile: otherMembers[2]?.mobile || "",
          m3Gender: otherMembers[2]?.gender || "M",
          m3Pwd: otherMembers[2]?.is_pwd === 1 ? "yes" : "no",
          m3ProfilePic: otherMembers[2]?.profile_pic || "",
        };

        setTeamData(transformedData);
      } else {
        alert(res.message);
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = (section) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Change Password handlers
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validatePasswordChange = () => {
    const errors = {};

    if (!passwordData.oldPassword) {
      errors.oldPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    }
    if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (!passwordData.confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm new password";
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordChange()) {
      return;
    }

    setIsChangingPassword(true);

    try {
      const token = localStorage.getItem("authToken");
      const userEmail = teamData.leadEmail;

      const response = await axios.post(
        `${BASE_URL}/change_password.php`,
        {
          email: userEmail,
          token: token,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }
      );

      if (response.data.success) {
        alert("Password changed successfully!");
        setShowChangePasswordModal(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setPasswordErrors({});
      } else {
        alert("Failed to change password: " + response.data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Delete Member handlers
  const handleDeleteMemberClick = (memberId, memberName) => {
    setMemberToDelete({ id: memberId, name: memberName });
    setShowDeleteMemberModal(true);
    setDeletePassword("");
    setDeleteError("");
  };

  const handleDeleteMember = async (e) => {
    e.preventDefault();

    if (!deletePassword) {
      setDeleteError("Password is required");
      return;
    }

    setIsDeletingMember(true);
    setDeleteError("");

    try {
      const token = localStorage.getItem("authToken");
      const leadEmail = teamData.leadEmail;
      const teamId = teamData.teamId;

      const response = await axios.post(
        `${BASE_URL}/delete_member.php`,
        {
          leadEmail: leadEmail,
          leadToken: token,
          teamId: teamId,
          password: deletePassword,
          memberId: memberToDelete.id,
        }
      );

      if (response.data.success) {
        alert(`Member ${memberToDelete.name} deleted successfully!`);
        setShowDeleteMemberModal(false);
        setMemberToDelete(null);
        setDeletePassword("");

        // Refresh dashboard data
        fetchDashboardData(token);
      } else {
        setDeleteError(response.data.message || "Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      setDeleteError("Error deleting member. Please try again.");
    } finally {
      setIsDeletingMember(false);
    }
  };

  const saveChanges = async (section) => {
    const token = localStorage.getItem("authToken");
    let payload = { token };

    switch (section) {
      case "teamInfo":
        payload.edit_type = "team";
        payload.college = teamData.college;
        payload.city = teamData.city;
        break;

      case "abstract":
        payload.edit_type = "team";
        payload.abstract = teamData.abstract;
        break;

      case "lead":
        payload.edit_type = "member";
        payload.member_id = teamData.leadId;
        payload.name = teamData.leadName;
        payload.email = teamData.leadEmail;
        payload.mobile = teamData.leadMobile;
        break;

      case "member1":
        payload.edit_type = "member";
        payload.member_id = teamData.m1Id;
        payload.name = teamData.m1Name;
        payload.email = teamData.m1Email;
        payload.mobile = teamData.m1Mobile;
        break;

      case "member2":
        payload.edit_type = "member";
        payload.member_id = teamData.m2Id;
        payload.name = teamData.m2Name;
        payload.email = teamData.m2Email;
        payload.mobile = teamData.m2Mobile;
        break;

      case "member3":
        payload.edit_type = "member";
        payload.member_id = teamData.m3Id;
        payload.name = teamData.m3Name;
        payload.email = teamData.m3Email;
        payload.mobile = teamData.m3Mobile;
        break;

      default:
        return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/edit_team.php`,
        payload
      );

      if (res.data.success) {
        alert("Information updated successfully");
        toggleEditMode(section);
      } else {
        alert("Update failed: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating information.");
    }
  };

  // New member form handlers
  const handleNewMemberInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewMemberData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setNewMemberData((prev) => ({ ...prev, [name]: value }));
    }

    if (addMemberErrors[name]) {
      setAddMemberErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateNewMember = () => {
    const errors = {};

    if (!newMemberData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!newMemberData.email.trim()) {
      errors.email = "Email is required";
    }
    if (!newMemberData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    }
    if (newMemberData.mobile.trim().length !== 10) {
      errors.mobile = "Mobile number must be 10 digits";
    }
    if (!newMemberData.profilePic) {
      errors.profilePic = "Profile picture is required";
    }

    setAddMemberErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!validateNewMember()) {
      return;
    }

    setIsSubmittingMember(true);

    try {
      const token = localStorage.getItem("authToken");
      const leadEmail = teamData.leadEmail;
      const teamId = teamData.teamId;

      const formData = new FormData();
      formData.append("leadEmail", leadEmail);
      formData.append("leadToken", token);
      formData.append("teamId", teamId);
      formData.append("name", newMemberData.name);
      formData.append("email", newMemberData.email);
      formData.append("mobile", newMemberData.mobile);
      formData.append("gender", newMemberData.gender);
      formData.append("isPwd", newMemberData.isPwd === "yes" ? 1 : 0);
      formData.append("profilePic", newMemberData.profilePic);

      const response = await axios.post(
        `${BASE_URL}/add_team_member.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Member added successfully! Refreshing dashboard...");
        setShowAddMemberForm(false);
        setNewMemberData({
          name: "",
          email: "",
          mobile: "",
          gender: "M",
          isPwd: "no",
          profilePic: null,
        });

        // Refresh dashboard data
        fetchDashboardData(token);
      } else {
        alert("Failed to add member: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Error adding member. Please try again.");
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleImageSelect = (memberType, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImages((prev) => ({
        ...prev,
        [memberType]: e.target.result,
      }));
      setImageEditMode((prev) => ({
        ...prev,
        [memberType]: true,
      }));

      setCropPosition((prev) => ({
        ...prev,
        [memberType]: { x: 0, y: 0 },
      }));

      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height, 100);
        setCropSize((prev) => ({
          ...prev,
          [memberType]: size,
        }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const startManualCrop = (memberType) => {
    setCroppingMode((prev) => ({
      ...prev,
      [memberType]: true,
    }));
  };

  const cancelManualCrop = (memberType) => {
    setCroppingMode((prev) => ({
      ...prev,
      [memberType]: false,
    }));
  };

  const applyManualCrop = (memberType) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const container = cropContainerRefs[memberType].current;
      if (!container) return;

      const scaleX = img.width / container.offsetWidth;
      const scaleY = img.height / container.offsetHeight;

      const cropX = cropPosition[memberType].x * scaleX;
      const cropY = cropPosition[memberType].y * scaleY;
      const cropSizePx = cropSize[memberType] * Math.min(scaleX, scaleY);

      canvas.width = 400;
      canvas.height = 400;

      ctx.drawImage(img, cropX, cropY, cropSizePx, cropSizePx, 0, 0, 400, 400);

      canvas.toBlob(
        (blob) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setSelectedImages((prev) => ({
              ...prev,
              [memberType]: e.target.result,
            }));
          };
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.9
      );

      setCroppingMode((prev) => ({
        ...prev,
        [memberType]: false,
      }));
    };

    img.src = selectedImages[memberType];
  };

  const handleCropStart = (memberType, clientX, clientY, corner) => {
    setIsDragging((prev) => ({
      ...prev,
      [memberType]: corner,
    }));

    setDragStart((prev) => ({
      ...prev,
      [memberType]: {
        x: clientX,
        y: clientY,
        initialX: cropPosition[memberType].x,
        initialY: cropPosition[memberType].y,
        initialSize: cropSize[memberType],
      },
    }));
  };

  const handleCropMouseDown = (memberType, e, corner) => {
    e.preventDefault();
    e.stopPropagation();
    handleCropStart(memberType, e.clientX, e.clientY, corner);
  };

  const handleCropTouchStart = (memberType, e, corner) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    handleCropStart(memberType, touch.clientX, touch.clientY, corner);
  };

  const handleCropMove = (memberType, clientX, clientY) => {
    const corner = isDragging[memberType];
    if (!corner) return;

    const container = cropContainerRefs[memberType].current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const deltaX = clientX - dragStart[memberType].x;
    const deltaY = clientY - dragStart[memberType].y;

    if (corner === "move") {
      const newX = Math.max(
        0,
        Math.min(
          dragStart[memberType].initialX + deltaX,
          rect.width - cropSize[memberType]
        )
      );
      const newY = Math.max(
        0,
        Math.min(
          dragStart[memberType].initialY + deltaY,
          rect.height - cropSize[memberType]
        )
      );
      setCropPosition((prev) => ({
        ...prev,
        [memberType]: { x: newX, y: newY },
      }));
    } else if (corner === "resize") {
      const maxDelta = Math.max(deltaX, deltaY);
      const newSize = Math.max(
        50,
        Math.min(
          Math.min(
            rect.width - dragStart[memberType].initialX,
            rect.height - dragStart[memberType].initialY
          ),
          dragStart[memberType].initialSize + maxDelta
        )
      );

      setCropSize((prev) => ({
        ...prev,
        [memberType]: newSize,
      }));
    }
  };

  const handleCropMouseMove = (memberType, e) => {
    const corner = isDragging[memberType];
    if (!corner) return;
    e.preventDefault();
    handleCropMove(memberType, e.clientX, e.clientY);
  };

  const handleCropTouchMove = (memberType, e) => {
    const corner = isDragging[memberType];
    if (!corner) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleCropMove(memberType, touch.clientX, touch.clientY);
  };

  const handleCropEnd = (memberType) => {
    setIsDragging((prev) => ({
      ...prev,
      [memberType]: null,
    }));
  };

  const handleCropMouseUp = (memberType) => {
    handleCropEnd(memberType);
  };

  const handleCropTouchEnd = (memberType) => {
    handleCropEnd(memberType);
  };

  const cropImageToSquare = async (imageSrc, memberType) => {
    if (croppingMode[memberType] && selectedImages[memberType]) {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          const container = cropContainerRefs[memberType].current;
          if (!container) return;

          const scaleX = img.width / container.offsetWidth;
          const scaleY = img.height / container.offsetHeight;

          const cropX = cropPosition[memberType].x * scaleX;
          const cropY = cropPosition[memberType].y * scaleY;
          const cropSizePx = cropSize[memberType] * Math.min(scaleX, scaleY);

          canvas.width = 400;
          canvas.height = 400;

          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropSizePx,
            cropSizePx,
            0,
            0,
            400,
            400
          );

          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.9
          );
        };

        img.src = imageSrc;
      });
    }

    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        canvas.width = 400;
        canvas.height = 400;

        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 400, 400);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.9
        );
      };

      img.src = imageSrc;
    });
  };

  const saveProfilePicture = async (memberType) => {
    try {
      const token = localStorage.getItem("authToken");
      const imageSrc = selectedImages[memberType];

      if (!imageSrc) {
        alert("No image selected");
        return;
      }

      let memberId;
      switch (memberType) {
        case "lead":
          memberId = teamData.leadId;
          break;
        case "member1":
          memberId = teamData.m1Id;
          break;
        case "member2":
          memberId = teamData.m2Id;
          break;
        case "member3":
          memberId = teamData.m3Id;
          break;
        default:
          return;
      }

      const croppedBlob = await cropImageToSquare(imageSrc, memberType);

      const formData = new FormData();
      formData.append("token", token);
      formData.append("member_id", memberId);
      formData.append("profile_pic", croppedBlob, "profile_pic.jpg");

      const response = await axios.post(
        `${BASE_URL}/edit_img.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const profilePicKey =
          memberType === "lead"
            ? "leadProfilePic"
            : memberType === "member1"
            ? "m1ProfilePic"
            : memberType === "member2"
            ? "m2ProfilePic"
            : "m3ProfilePic";

        setTeamData((prev) => ({
          ...prev,
          [profilePicKey]: response.data.data.profile_pic,
        }));

        setSelectedImages((prev) => ({
          ...prev,
          [memberType]: null,
        }));

        setImageEditMode((prev) => ({
          ...prev,
          [memberType]: false,
        }));

        setCroppingMode((prev) => ({
          ...prev,
          [memberType]: false,
        }));

        alert("Profile picture updated successfully!");
      } else {
        alert("Failed to update profile picture: " + response.data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    }
  };

  const cancelImageEdit = (memberType) => {
    setSelectedImages((prev) => ({
      ...prev,
      [memberType]: null,
    }));
    setImageEditMode((prev) => ({
      ...prev,
      [memberType]: false,
    }));
    setCroppingMode((prev) => ({
      ...prev,
      [memberType]: false,
    }));
    if (fileInputRefs[memberType].current) {
      fileInputRefs[memberType].current.value = "";
    }
  };

  const renderProfileImage = (
    memberType,
    profilePic,
    name,
    borderColor,
    canEdit
  ) => {
    const isEditing = imageEditMode[memberType];
    const selectedImage = selectedImages[memberType];
    const isCropping = croppingMode[memberType];

    return (
      <div className="relative group">
        <div
          className={`w-20 h-20 rounded-full overflow-hidden border-2 ${borderColor} relative`}
        >
          {selectedImage && !isCropping ? (
            <img
              src={selectedImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : profilePic ? (
            <img
              src={profilePic}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gray-700 flex items-center justify-center`}
            >
              <span
                className={`text-xl font-bold ${
                  borderColor.includes("red")
                    ? "text-red-400"
                    : borderColor.includes("blue")
                    ? "text-blue-400"
                    : borderColor.includes("yellow")
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {name?.charAt(0) || "M"}
              </span>
            </div>
          )}

          {canEdit && !isEditing && (
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => fileInputRefs[memberType].current?.click()}
            >
              <Camera className="text-white" size={24} />
            </div>
          )}
        </div>

        {isEditing && selectedImage && (
          <div className="absolute top-24 left-0 z-50 bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-xl min-w-[300px]">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-white font-medium">Crop Profile Picture</h4>
              <button
                onClick={() => cancelImageEdit(memberType)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {!isCropping ? (
              <div className="space-y-3">
                <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden border border-gray-600">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startManualCrop(memberType)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Crop size={16} />
                    Crop Manually
                  </button>
                  <button
                    onClick={() => saveProfilePicture(memberType)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Use As Is
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  ref={cropContainerRefs[memberType]}
                  className="relative w-64 h-64 mx-auto border border-gray-600 overflow-hidden select-none"
                  onMouseMove={(e) => handleCropMouseMove(memberType, e)}
                  onMouseUp={() => handleCropMouseUp(memberType)}
                  onMouseLeave={() => handleCropMouseUp(memberType)}
                  onTouchMove={(e) => handleCropTouchMove(memberType, e)}
                  onTouchEnd={() => handleCropTouchEnd(memberType)}
                >
                  <img
                    src={selectedImage}
                    alt="Crop preview"
                    className="w-full h-full object-contain pointer-events-none"
                    style={{ touchAction: "none" }}
                  />

                  <div
                    className="absolute border-2 border-white shadow-lg select-none"
                    style={{
                      left: cropPosition[memberType].x,
                      top: cropPosition[memberType].y,
                      width: cropSize[memberType],
                      height: cropSize[memberType],
                      boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                      cursor: "move",
                      touchAction: "none",
                    }}
                    onMouseDown={(e) =>
                      handleCropMouseDown(memberType, e, "move")
                    }
                    onTouchStart={(e) =>
                      handleCropTouchStart(memberType, e, "move")
                    }
                  >
                    <div
                      className="absolute bottom-0 right-0 w-6 h-6 bg-white cursor-nwse-resize select-none"
                      style={{
                        transform: "translate(25%, 25%)",
                        borderRadius: "2px",
                        touchAction: "none",
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleCropMouseDown(memberType, e, "resize");
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        handleCropTouchStart(memberType, e, "resize");
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 text-center">
                  Drag to move • Drag corners to resize
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => cancelManualCrop(memberType)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => applyManualCrop(memberType)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    Apply Crop
                  </button>
                  <button
                    onClick={() => saveProfilePicture(memberType)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRefs[memberType]}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageSelect(memberType, e)}
          className="hidden"
        />
      </div>
    );
  };

  if (!teamData) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading dashboard...
      </div>
    );
  }

  const canAddMember = teamData.teamSize === 3 && !teamData.m3Name && isLead;

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto py-32 pb-6 ms-5 me-5 [&::-webkit-scrollbar]:hidden">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/70 rounded-xl p-5 md:p-6 mb-6 border border-yellow-500 shadow-lg">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            {/* Team Info */}
            <div className="flex items-center gap-4">
              {teamData.teamLogo ? (
                <img
                  src={teamData.teamLogo}
                  alt="Team Logo"
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-yellow-400 object-cover"
                />
              ) : (
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-700 border-2 border-yellow-400 flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold text-yellow-400">
                    {teamData.teamName?.charAt(0) || "T"}
                  </span>
                </div>
              )}

              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-yellow-400">
                  Team Dashboard
                </h1>
                <h2 className="text-lg md:text-2xl font-semibold text-white">
                  {teamData.teamName}
                </h2>
                <p className="text-gray-400 text-sm">{teamData.theme}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 md:items-end">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs md:text-sm">
                  Team: {teamData.registrationStatus}
                </span>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs md:text-sm">
                  Payment: {teamData.paymentStatus}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
              {teamData.registrationStatus !== "Pending" && teamData.registrationStatus !== "Rejected" && (
                <button
                  onClick={() =>
                    window.open(`/receipt?team_id=${teamData.teamId}`, "_blank")
                  }
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm"
                >
                  View Receipt
                </button>
              )}
                <button
                  onClick={() => setShowChangePasswordModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  Change Password
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="mt-5 pt-3 border-t border-gray-700 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
            Powered by{" "}
            <a
              href="https://beestack.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline"
            >
              <img
                src="/beestack_text_logo.png"
                alt="BeeStack"
                className="h-4 md:h-5 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Add Member Button */}
        {canAddMember && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddMemberForm(true)}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 border-2 border-yellow-400"
            >
              <UserPlus size={24} />
              Add 4th Team Member
            </button>
          </div>
        )}

        {/* Add Member Form Modal */}
        {showAddMemberForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-yellow-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-400">
                  Add New Team Member
                </h2>
                <button
                  onClick={() => {
                    setShowAddMemberForm(false);
                    setNewMemberData({
                      name: "",
                      email: "",
                      mobile: "",
                      gender: "M",
                      isPwd: "no",
                      profilePic: null,
                    });
                    setAddMemberErrors({});
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newMemberData.name}
                      onChange={handleNewMemberInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        addMemberErrors.name
                          ? "border-red-500"
                          : "border-gray-600"
                      }`}
                    />
                    {addMemberErrors.name && (
                      <p className="text-red-400 text-sm mt-1">
                        {addMemberErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newMemberData.email}
                      onChange={handleNewMemberInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        addMemberErrors.email
                          ? "border-red-500"
                          : "border-gray-600"
                      }`}
                    />
                    {addMemberErrors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {addMemberErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Mobile *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={newMemberData.mobile}
                      onChange={handleNewMemberInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        addMemberErrors.mobile
                          ? "border-red-500"
                          : "border-gray-600"
                      }`}
                    />
                    {addMemberErrors.mobile && (
                      <p className="text-red-400 text-sm mt-1">
                        {addMemberErrors.mobile}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={newMemberData.gender}
                      onChange={handleNewMemberInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      PWD (Person with Disability)
                    </label>
                    <select
                      name="isPwd"
                      value={newMemberData.isPwd}
                      onChange={handleNewMemberInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Profile Picture *
                    </label>
                    <input
                      type="file"
                      name="profilePic"
                      onChange={handleNewMemberInputChange}
                      accept="image/*"
                      className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 ${
                        addMemberErrors.profilePic
                          ? "border-red-500"
                          : "border-gray-600"
                      }`}
                    />
                    {addMemberErrors.profilePic && (
                      <p className="text-red-400 text-sm mt-1">
                        {addMemberErrors.profilePic}
                      </p>
                    )}
                    {newMemberData.profilePic && (
                      <p className="text-sm text-green-400 mt-1">
                        Selected: {newMemberData.profilePic.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMemberForm(false);
                      setNewMemberData({
                        name: "",
                        email: "",
                        mobile: "",
                        gender: "M",
                        isPwd: "no",
                        profilePic: null,
                      });
                      setAddMemberErrors({});
                    }}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingMember}
                    className={`flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition-colors ${
                      isSubmittingMember
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-green-700"
                    }`}
                  >
                    {isSubmittingMember ? "Adding Member..." : "Add Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border-4 border-yellow-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-400">
                  Change Password
                </h2>
                <button
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordData({
                      oldPassword: "",
                      newPassword: "",
                      confirmNewPassword: "",
                    });
                    setPasswordErrors({});
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      passwordErrors.oldPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                  />
                  {passwordErrors.oldPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {passwordErrors.oldPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      passwordErrors.newPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      passwordErrors.confirmNewPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                  />
                  {passwordErrors.confirmNewPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {passwordErrors.confirmNewPassword}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePasswordModal(false);
                      setPasswordData({
                        oldPassword: "",
                        newPassword: "",
                        confirmNewPassword: "",
                      });
                      setPasswordErrors({});
                    }}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors ${
                      isChangingPassword
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Member Confirmation Modal */}
        {showDeleteMemberModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border-4 border-red-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-400">
                  Remove Member
                </h2>
                <button
                  onClick={() => {
                    setShowDeleteMemberModal(false);
                    setMemberToDelete(null);
                    setDeletePassword("");
                    setDeleteError("");
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-white text-lg mb-2">
                  Are you sure you want to Remove{" "}
                  <span className="font-bold text-red-400">
                    {memberToDelete?.name}
                  </span>
                  ?
                </p>
                <p className="text-gray-400 text-sm">
                  This action cannot be undone. Please enter your password to
                  confirm.
                </p>
              </div>

              <form onSubmit={handleDeleteMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Your Password *
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      setDeleteError("");
                    }}
                    className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      deleteError ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="Enter your password"
                  />
                  {deleteError && (
                    <p className="text-red-400 text-sm mt-1">{deleteError}</p>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteMemberModal(false);
                      setMemberToDelete(null);
                      setDeletePassword("");
                      setDeleteError("");
                    }}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDeletingMember}
                    className={`flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium transition-colors ${
                      isDeletingMember
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-red-700"
                    }`}
                  >
                    {isDeletingMember ? "Removing..." : "Remove Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Information Card */}
          <div className="bg-gray-800/70 overflow-auto rounded-xl p-6 border border-gray-700 shadow-lg border-yellow-500 border-4">
             
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Team Information</h2>
              
              {isLead && hideEditButtons && (
                <button
                  onClick={() =>
                    editMode.teamInfo
                      ? saveChanges("teamInfo")
                      : toggleEditMode("teamInfo")
                  }
                  className={`px-4 py-2 rounded-lg font-medium ${
                    editMode.teamInfo
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-blue-600 hover:bg-blue-500"
                  } text-white transition-colors`}
                >
                  {editMode.teamInfo ? "Save" : "Edit"}
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  College
                </label>
                {editMode.teamInfo ? (
                  <input
                    type="text"
                    name="college"
                    value={teamData.college}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                    {teamData.college}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  City
                </label>
                {editMode.teamInfo ? (
                  <input
                    type="text"
                    name="city"
                    value={teamData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                    {teamData.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Team Size
                </label>
                <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                  {teamData.teamSize} Members
                </p>
              </div>
            </div>
          </div>

          {/* Abstract Card */}
          <div className="bg-gray-800/70 max-h-96 overflow-auto rounded-xl p-6 border border-gray-700 shadow-lg border-yellow-500 border-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Project Abstract</h2>
              {isLead && hideEditButtons &&(
                <button
                  onClick={() =>
                    editMode.abstract
                      ? saveChanges("abstract")
                      : toggleEditMode("abstract")
                  }
                  className={`px-4 py-2 rounded-lg font-medium ${
                    editMode.abstract
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-orange-600 hover:bg-orange-500"
                  } text-white transition-colors`}
                >
                  {editMode.abstract ? "Save" : "Edit"}
                </button> 
              )}
            </div>

            <div>
              {editMode.abstract ? (
                <textarea
                  name="abstract"
                  value={teamData.abstract}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-2  bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="text-white overflow-auto bg-gray-700/50 px-4 py-4 rounded-lg whitespace-pre-wrap">
                  {teamData.abstract}
                </p>
              )}
            </div>
          </div>

          {/* Team Lead Card */}
          <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 shadow-lg border-yellow-500 border-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                {renderProfileImage(
                  "lead",
                  teamData.leadProfilePic,
                  teamData.leadName,
                  "border-red-500",
                  isLead
                )}
                <h2 className="text-xl font-bold text-white">Team Lead</h2>
              </div>
              {isLead && hideEditButtons && (
                <button
                  onClick={() =>
                    editMode.lead ? saveChanges("lead") : toggleEditMode("lead")
                  }
                  className={`px-4 py-2 rounded-lg font-medium ${
                    editMode.lead
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-red-600 hover:bg-red-500"
                  } text-white transition-colors`}
                >
                  {editMode.lead ? "Save" : "Edit"}
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                {editMode.lead ? (
                  <input
                    type="text"
                    name="leadName"
                    value={teamData.leadName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                    {teamData.leadName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  {editMode.lead ? (
                    <input
                      type="email"
                      name="leadEmail"
                      value={teamData.leadEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                      {teamData.leadEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Mobile
                  </label>
                  {editMode.lead ? (
                    <input
                      type="tel"
                      name="leadMobile"
                      value={teamData.leadMobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                      {teamData.leadMobile}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Gender
                  </label>
                  {editMode.lead ? (
                    <select
                      name="leadGender"
                      value={teamData.leadGender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                      {teamData.leadGender === "M"
                        ? "Male"
                        : teamData.leadGender === "F"
                        ? "Female"
                        : "Other"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    PWD Status
                  </label>
                  {editMode.lead ? (
                    <select
                      name="leadPwd"
                      value={teamData.leadPwd}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                      {teamData.leadPwd === "yes" ? "Yes" : "No"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Member 1 Card */}
          {teamData.m1Name && (
            <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 shadow-lg border-yellow-500 border-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  {renderProfileImage(
                    "member1",
                    teamData.m1ProfilePic,
                    teamData.m1Name,
                    "border-blue-500",
                    isLead || userId === teamData.m1Id
                  )}
                  <h2 className="text-xl font-bold text-white">Member 1</h2>
                </div>
                <div className="flex gap-2">
                  {(isLead || userId === teamData.m1Id) && hideEditButtons &&(
                    <button
                      onClick={() =>
                        editMode.member1
                          ? saveChanges("member1")
                          : toggleEditMode("member1")
                      }
                      className={`px-4 py-2 rounded-lg font-medium ${
                        editMode.member1
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-blue-600 hover:bg-blue-500"
                      } text-white transition-colors`}
                    >
                      {editMode.member1 ? "Save" : "Edit"}
                    </button>
                  )}
                  {isLead && teamData?.teamSize === 4 && hideEditButtons &&(
                    <button
                      onClick={() =>
                        handleDeleteMemberClick(teamData.m1Id, teamData.m1Name)
                      }
                      className="px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  {editMode.member1 ? (
                    <input
                      type="text"
                      name="m1Name"
                      value={teamData.m1Name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                      {teamData.m1Name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    {editMode.member1 ? (
                      <input
                        type="email"
                        name="m1Email"
                        value={teamData.m1Email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m1Email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Mobile
                    </label>
                    {editMode.member1 ? (
                      <input
                        type="tel"
                        name="m1Mobile"
                        value={teamData.m1Mobile}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m1Mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Gender
                    </label>
                    {editMode.member1 ? (
                      <select
                        name="m1Gender"
                        value={teamData.m1Gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m1Gender === "M"
                          ? "Male"
                          : teamData.m1Gender === "F"
                          ? "Female"
                          : "Other"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      PWD Status
                    </label>
                    {editMode.member1 ? (
                      <select
                        name="m1Pwd"
                        value={teamData.m1Pwd}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m1Pwd === "yes" ? "Yes" : "No"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Member 2 Card */}
          {teamData.m2Name && (
            <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 shadow-lg border-yellow-500 border-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  {renderProfileImage(
                    "member2",
                    teamData.m2ProfilePic,
                    teamData.m2Name,
                    "border-yellow-500",
                    isLead || userId === teamData.m2Id
                  )}
                  <h2 className="text-xl font-bold text-white">Member 2</h2>
                </div>
                <div className="flex gap-2">
                  {(isLead || userId === teamData.m2Id) && hideEditButtons && (
                    <button
                      onClick={() =>
                        editMode.member2
                          ? saveChanges("member2")
                          : toggleEditMode("member2")
                      }
                      className={`px-4 py-2 rounded-lg font-medium ${
                        editMode.member2
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-yellow-600 hover:bg-yellow-500"
                      } text-white transition-colors`}
                    >
                      {editMode.member2 ? "Save" : "Edit"}
                    </button>
                  )}
                  {isLead && teamData?.teamSize === 4 && hideEditButtons &&(
                    <button
                      onClick={() =>
                        handleDeleteMemberClick(teamData.m2Id, teamData.m2Name)
                      }
                      className="px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  {editMode.member2 ? (
                    <input
                      type="text"
                      name="m2Name"
                      value={teamData.m2Name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                      {teamData.m2Name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    {editMode.member2 ? (
                      <input
                        type="email"
                        name="m2Email"
                        value={teamData.m2Email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m2Email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Mobile
                    </label>
                    {editMode.member2 ? (
                      <input
                        type="tel"
                        name="m2Mobile"
                        value={teamData.m2Mobile}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m2Mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Gender
                    </label>
                    {editMode.member2 ? (
                      <select
                        name="m2Gender"
                        value={teamData.m2Gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m2Gender === "M"
                          ? "Male"
                          : teamData.m2Gender === "F"
                          ? "Female"
                          : "Other"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      PWD Status
                    </label>
                    {editMode.member2 ? (
                      <select
                        name="m2Pwd"
                        value={teamData.m2Pwd}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m2Pwd === "yes" ? "Yes" : "No"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Member 3 Card */}
          {teamData.m3Name && (
            <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700 shadow-lg border-yellow-500 border-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  {renderProfileImage(
                    "member3",
                    teamData.m3ProfilePic,
                    teamData.m3Name,
                    "border-green-500",
                    isLead || userId === teamData.m3Id
                  )}
                  <h2 className="text-xl font-bold text-white">Member 3</h2>
                </div>
                <div className="flex gap-2">
                  {(isLead || userId === teamData.m3Id) && hideEditButtons && (
                    <button
                      onClick={() =>
                        editMode.member3
                          ? saveChanges("member3")
                          : toggleEditMode("member3")
                      }
                      className={`px-4 py-2 rounded-lg font-medium ${
                        editMode.member3
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-green-600 hover:bg-green-500"
                      } text-white transition-colors`}
                    >
                      {editMode.member3 ? "Save" : "Edit"}
                    </button>
                  )}
                  {isLead && teamData?.teamSize === 4 && hideEditButtons &&(
                    <button
                      onClick={() =>
                        handleDeleteMemberClick(teamData.m3Id, teamData.m3Name)
                      }
                      className="px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  {editMode.member3 ? (
                    <input
                      type="text"
                      name="m3Name"
                      value={teamData.m3Name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                      {teamData.m3Name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    {editMode.member3 ? (
                      <input
                        type="email"
                        name="m3Email"
                        value={teamData.m3Email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m3Email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Mobile
                    </label>
                    {editMode.member3 ? (
                      <input
                        type="tel"
                        name="m3Mobile"
                        value={teamData.m3Mobile}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m3Mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Gender
                    </label>
                    {editMode.member3 ? (
                      <select
                        name="m3Gender"
                        value={teamData.m3Gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m3Gender === "M"
                          ? "Male"
                          : teamData.m3Gender === "F"
                          ? "Female"
                          : "Other"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      PWD Status
                    </label>
                    {editMode.member3 ? (
                      <select
                        name="m3Pwd"
                        value={teamData.m3Pwd}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    ) : (
                      <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">
                        {teamData.m3Pwd === "yes" ? "Yes" : "No"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
