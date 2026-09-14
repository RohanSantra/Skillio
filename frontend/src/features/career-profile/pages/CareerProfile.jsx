import { useEffect, useMemo, useState } from "react";
import useCareerProfile from "../hooks/useCareerProfile";
import { toast } from "sonner";

import {
  Sparkles,
  UserRound,
  BrainCircuit,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  Award,
  Plus,
  X,
  Pencil,
  Check,
  ChevronRight,
  MapPin,
  CalendarDays,
  ExternalLink,
  Building2,
  Save,
  CircleCheck,
  ArrowUpRight,
  FileText,
  Layers3,
  BadgeCheck,
  ShieldCheck,
  BookOpen,
  Landmark,
  School,
  Braces,
  Code2,
  FileCode2,
  Globe2,
  Lightbulb,
  Link,
  ArrowLeft,
  LoaderCircle,
  Search,
  Loader2,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Upload,
  AlertTriangle,
  FileCheck2,
  FileUp
} from "lucide-react";
import { addExperience, addProject, deleteCertification, deleteEducation, deleteExperience, deleteProject, updateCertification, updateEducation, updateExperience, updateProject } from "../services/careerProfile.api";
import {
  getAllResumes,
} from "../../resume/services/resume.api";
import ErrorToast from "../../../components/feedback/ErrorToast.jsx";

const formatDateForInput = (date) => {
  if (!date) return "";

  return new Date(date).toISOString().split("T")[0];
};

const formatDateForDisplay = (date) => {
  if (!date) return "Unknown";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};


const CareerProfile = () => {
  const {
    careerProfile,
    hasProfile,

    isProfileLoading,
    isSubmitting,
    isImporting,
    error,

    fetchCareerProfile,
    saveBasicInfo,
    saveSkills,

    createExperience,
    createProject,
    createEducation,
    createCertification,

    importCareerProfileFromResume,
  } = useCareerProfile();


  // =====================================================
  // ACTIVE SECTION
  // =====================================================

  const [activeSection, setActiveSection] =
    useState("profile");


  // =====================================================
  // EDIT STATES
  // =====================================================

  const [editingProfile, setEditingProfile] =
    useState(true);

  const [showSkillEditor, setShowSkillEditor] =
    useState(false);

  const [showExperienceEditor, setShowExperienceEditor] =
    useState(false);

  const [showProjectEditor, setShowProjectEditor] =
    useState(false);

  const [showEducationEditor, setShowEducationEditor] =
    useState(false);

  const [showCertificationEditor, setShowCertificationEditor] =
    useState(false);

  const [showResumeImportModal, setShowResumeImportModal] =
    useState(false);

  const [resumeImportStep, setResumeImportStep] =
    useState("select");

  const [availableResumes, setAvailableResumes] =
    useState([]);

  const [selectedResumeId, setSelectedResumeId] =
    useState("");

  const [isLoadingResumes, setIsLoadingResumes] =
    useState(false);


  // =====================================================
  // BASIC INFO
  // =====================================================

  const [basicInfo, setBasicInfo] = useState({
    headline: "",
    summary: "",
  });


  // =====================================================
  // SKILLS
  // =====================================================

  const [skillInput, setSkillInput] =
    useState("");

  const [skills, setSkills] = useState([]);


  // =====================================================
  // EXPERIENCE
  // =====================================================

  const emptyExperience = {
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    technologies: "",
  };

  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [experience, setExperience] = useState(emptyExperience);




  // =====================================================
  // PROJECT
  // =====================================================

  const emptyProject = {
    name: "",
    description: "",
    technologies: "",
    projectUrl: "",
    githubUrl: "",
  };

  const [editingProjectId, setEditingProjectId] =
    useState(null);

  const [project, setProject] =
    useState(emptyProject);


  // =====================================================
  // EDUCATION
  // =====================================================


  const emptyEducation = {
    institution: "",
    degree: "",
    fieldOfStudy: "",
  };

  const [editingEducationId, setEditingEducationId] =
    useState(null);

  const [education, setEducation] =
    useState(emptyEducation);


  // =====================================================
  // CERTIFICATION
  // =====================================================

  const emptyCertification = {
    name: "",
    issuer: "",
    issueDate: "",
    credentialUrl: "",
  };

  const [certification, setCertification] =
    useState(emptyCertification);


  const [editingCertificationId, setEditingCertificationId] =
    useState(null);


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    fetchCareerProfile();
  }, [fetchCareerProfile]);


  // =====================================================
  // POPULATE DATA
  // =====================================================

  useEffect(() => {
    if (!careerProfile) return;

    setBasicInfo({
      headline:
        careerProfile.headline || "",
      summary:
        careerProfile.summary || "",
    });

    setSkills(
      careerProfile.skills || []
    );

    if (
      careerProfile.headline ||
      careerProfile.summary
    ) {
      setEditingProfile(false);
    }

  }, [careerProfile]);



  // =====================================================
  // PROFILE COMPLETION
  // =====================================================


  const profileCompletion = useMemo(() => {

    let completed = 0;
    const total = 6;

    if (
      careerProfile?.headline ||
      careerProfile?.summary
    ) {
      completed++;
    }

    if (
      careerProfile?.skills?.length > 0
    ) {
      completed++;
    }

    if (
      careerProfile?.experiences?.length > 0
    ) {
      completed++;
    }

    if (
      careerProfile?.projects?.length > 0
    ) {
      completed++;
    }

    if (
      careerProfile?.education?.length > 0
    ) {
      completed++;
    }

    if (
      careerProfile?.certifications?.length > 0
    ) {
      completed++;
    }

    return Math.round(
      (completed / total) * 100
    );

  }, [careerProfile]);


  // =====================================================
  // LOAD RESUMES FOR CAREER PROFILE IMPORT
  // =====================================================

  const loadResumesForImport = async () => {
    try {
      setIsLoadingResumes(true);

      const response = await getAllResumes();

      const resumes =
        response?.data?.data?.resumes || [];

      // Only resumes that have already been AI parsed
      const parsedResumes = resumes.filter((resume) => {
        const parsedData = resume?.parsedData;

        if (!parsedData) {
          return false;
        }

        return Boolean(
          parsedData.name ||
          parsedData.headline ||
          parsedData.summary ||
          parsedData.skills?.length ||
          parsedData.experience?.length ||
          parsedData.projects?.length ||
          parsedData.education?.length ||
          parsedData.certifications?.length
        );
      });

      setAvailableResumes(parsedResumes);

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Unable to load your resumes."
      );
    } finally {
      setIsLoadingResumes(false);
    }
  };


  // =====================================================
  // OPEN RESUME IMPORT MODAL
  // =====================================================

  const handleOpenResumeImport = async () => {
    setShowResumeImportModal(true);
    setResumeImportStep("select");
    setSelectedResumeId("");

    await loadResumesForImport();
  };


  // =====================================================
  // CLOSE RESUME IMPORT MODAL
  // =====================================================

  const handleCloseResumeImport = () => {
    if (isImporting) {
      return;
    }

    setShowResumeImportModal(false);
    setResumeImportStep("select");
    setSelectedResumeId("");
  };


  // =====================================================
  // CONTINUE IMPORT
  // =====================================================

  const handleContinueResumeImport = () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume first.");
      return;
    }

    setResumeImportStep("confirm");
  };


  // =====================================================
  // IMPORT SELECTED RESUME
  // =====================================================

  const handleConfirmResumeImport = async () => {
    if (!selectedResumeId) {
      return;
    }

    const result =
      await importCareerProfileFromResume(
        selectedResumeId
      );

    if (result.success) {
      toast.success(
        "Career profile imported successfully."
      );

      setShowResumeImportModal(false);
      setResumeImportStep("select");
      setSelectedResumeId("");

      await fetchCareerProfile();

      setActiveSection("profile");
      setEditingProfile(false);
    } else {
      toast.error(
        result.error ||
        "Unable to import resume."
      );
    }
  };


  // =====================================================
  // BASIC PROFILE SAVE
  // =====================================================

  const handleBasicInfoSubmit = async (
    event
  ) => {

    event.preventDefault();

    const result =
      await saveBasicInfo(basicInfo);

    if (result.success) {

      toast.success(
        hasProfile
          ? "Profile updated successfully"
          : "Career profile created successfully"
      );

      setEditingProfile(false);

    } else {

      toast.error(
        result.error ||
        "Something went wrong"
      );

    }

  };


  // =====================================================
  // ADD SKILL
  // =====================================================

  const handleAddSkill = () => {

    const skill =
      skillInput.trim();

    if (!skill) return;

    if (
      skills.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      )
    ) {

      toast.error(
        "This skill already exists"
      );

      return;
    }

    setSkills((previous) => [
      ...previous,
      skill,
    ]);

    setSkillInput("");

  };


  // =====================================================
  // REMOVE SKILL
  // =====================================================

  const handleRemoveSkill = (skill) => {

    setSkills((previous) =>
      previous.filter(
        (item) => item !== skill
      )
    );

  };


  // =====================================================
  // SAVE SKILLS
  // =====================================================

  const handleSaveSkills = async () => {

    if (!hasProfile) {

      toast.error(
        "Create your basic profile first"
      );

      return;
    }

    const result =
      await saveSkills(skills);

    if (result.success) {

      toast.success(
        "Skills saved successfully"
      );

      setShowSkillEditor(false);

      fetchCareerProfile();

    } else {

      toast.error(result.error);

    }

  };


  // =====================================================
  // EXPERIENCE
  // =====================================================
  const handleExperienceSubmit = async (event) => {
    event.preventDefault();

    try {

      if (editingExperienceId) {
        await updateExperience(
          editingExperienceId,
          experience
        );

        toast.success(
          "Experience updated successfully"
        );
      } else {
        await addExperience(experience);

        toast.success(
          "Experience added successfully"
        );
      }

      setExperience(emptyExperience);

      setEditingExperienceId(null);

      setShowExperienceEditor(false);

      await fetchCareerProfile();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }
  };



  const handleDeleteExperience = async (
    experienceId
  ) => {

    try {

      await deleteExperience(experienceId);

      toast.success(
        "Experience removed successfully"
      );

      await fetchCareerProfile();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to delete experience"
      );

    }
  };


  // =================================
  // CREATE / UPDATE PROJECT
  // =================================

  const handleProjectSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingProjectId) {
        await updateProject(
          editingProjectId,
          project
        );

        toast.success(
          "Project updated successfully"
        );
      } else {
        await addProject(project);

        toast.success(
          "Project added successfully"
        );
      }

      setProject({ ...emptyProject });

      setEditingProjectId(null);

      setShowProjectEditor(false);

      await fetchCareerProfile();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };


  // =================================
  // DELETE PROJECT
  // =================================

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);

      toast.success(
        "Project removed successfully"
      );

      await fetchCareerProfile();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to delete project"
      );
    }
  };


  // =====================================================
  // EDUCATION
  // =====================================================

  const handleEducationSubmit = async (event) => {
    event.preventDefault();

    const educationData = {
      ...education,

      startDate: education.startDate || null,

      endDate: education.endDate || null,
    };

    const result = editingEducationId
      ? await updateEducation(
        editingEducationId,
        educationData
      )
      : await createEducation(educationData);

    if (result.success) {
      toast.success(
        editingEducationId
          ? "Education updated successfully"
          : "Education added successfully"
      );

      setEducation({
        ...emptyEducation,
      });

      setEditingEducationId(null);

      setShowEducationEditor(false);

      fetchCareerProfile();
    } else {
      toast.error(result.error);
    }
  };


  const handleDeleteEducation = async (educationId) => {
    const result = await deleteEducation(educationId);

    if (result.success) {
      toast.success("Education deleted successfully");

      fetchCareerProfile();
    } else {
      toast.error(result.error);
    }
  };


  // =====================================================
  // CERTIFICATIONS
  // =====================================================

  const handleCertificationSubmit = async (event) => {
    event.preventDefault();

    let result;

    const certificationData = {
      ...certification,

      issueDate: certification.issueDate || null,

      credentialUrl:
        certification.credentialUrl?.trim() || "",
    };

    if (editingCertificationId) {
      result = await updateCertification(
        editingCertificationId,
        certificationData
      );
    } else {
      result = await createCertification(
        certificationData
      );
    }

    if (result.success) {
      toast.success(
        editingCertificationId
          ? "Certification updated successfully"
          : "Certification added successfully"
      );

      setCertification({
        ...emptyCertification,
      });

      setEditingCertificationId(null);

      setShowCertificationEditor(false);

      fetchCareerProfile();
    } else {
      toast.error(
        result.error || "Something went wrong"
      );
    }
  };


  // =====================================================
  // DELETE CERTIFICATION
  // =====================================================

  const handleDeleteCertification = async (id) => {

    const result = await deleteCertification(id);

    if (result.success) {
      toast.success(
        "Certification deleted successfully"
      );

      fetchCareerProfile();
    } else {
      toast.error(
        result.error || "Failed to delete certification"
      );
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (isProfileLoading) {

    return (

      <div
        className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-[var(--background)]
                "
      >

        <div className="text-center">

          <div
            className="
                            mx-auto
                            mb-4
                            flex
                            h-14
                            w-14
                            animate-pulse
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[var(--primary-fixed)]
                            text-[var(--primary)]
                        "
          >

            <Sparkles size={25} />

          </div>

          <p className="font-semibold">
            Preparing your workspace...
          </p>

          <p
            className="
                            mt-1
                            text-sm
                            text-[var(--on-surface-variant)]
                        "
          >
            Loading your professional profile
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // NAVIGATION
  // =====================================================

  const sections = [
    {
      id: "profile",
      label: "Professional Profile",
      icon: UserRound,
    },
    {
      id: "skills",
      label: "Skills & Expertise",
      icon: BrainCircuit,
    },
    {
      id: "experience",
      label: "Experience",
      icon: BriefcaseBusiness,
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderKanban,
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
    },
  ];


  return (

    <div
      className="
                min-h-full
                bg-[var(--background)]
                px-4
                py-5
                sm:px-6
                sm:py-6
                lg:px-10
                lg:py-8
            "
    >


      {/* ============================================================
    CAREER PROFILE HERO
============================================================ */}

      <section
        className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        p-6
        sm:p-8
        lg:p-10
    "
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 55%, #6d7865 100%)",
          borderColor:
            "rgba(255,255,255,0.16)",
          boxShadow:
            "var(--shadow-lg)",
        }}
      >

        {/* ========================================================
        DECORATIVE BACKGROUND
    ======================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-28
            h-80
            w-80
            rounded-full
            opacity-10
        "
          style={{
            background:
              "var(--primary-fixed)",
          }}
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-32
            right-1/3
            h-64
            w-64
            rounded-full
            opacity-10
        "
          style={{
            background:
              "var(--secondary-fixed)",
          }}
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-20
            h-56
            w-56
            rounded-full
            opacity-5
        "
          style={{
            background:
              "var(--primary-fixed)",
          }}
        />


        {/* ========================================================
        HERO CONTENT
    ======================================================== */}

        <div
          className="
            relative
            flex
            flex-col
            gap-8
            xl:flex-row
            xl:items-center
            xl:justify-between
        "
        >

          {/* ====================================================
            LEFT CONTENT
        ==================================================== */}

          <div className="max-w-3xl">

            {/* Badge */}

            <div
              className="
                    mb-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-semibold
                "
              style={{
                background:
                  "rgba(255,255,255,0.12)",
                color:
                  "var(--primary-fixed)",
                border:
                  "1px solid rgba(255,255,255,0.14)",
              }}
            >

              <Sparkles size={16} />

              Career Identity Workspace

            </div>


            {/* Heading */}

            <h1
              className="
                    text-3xl
                    font-bold
                    tracking-tight
                    sm:text-4xl
                    lg:text-5xl
                "
              style={{
                fontFamily:
                  "var(--font-heading)",
                color:
                  "var(--on-primary)",
              }}
            >

              Build your career story.
              <br />

              Make every detail count.

            </h1>


            {/* Description */}

            {/* ========================================================
    IMPORT EXISTING PROFILE
======================================================== */}

            <div className="mt-7">
              <div
                className="
      flex
      flex-col
      gap-4
      rounded-2xl
      border
      p-4
      sm:flex-row
      sm:items-center
      sm:justify-between
    "
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,0.14)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
        "
                    style={{
                      background: "rgba(255,255,255,0.12)",
                    }}
                  >
                    <FileUp
                      size={19}
                      style={{
                        color: "var(--primary-fixed)",
                      }}
                    />
                  </div>

                  <div>
                    <p
                      className="
            text-sm
            font-semibold
          "
                      style={{
                        color: "var(--on-primary)",
                      }}
                    >
                      Already have a resume?
                    </p>

                    <p
                      className="
            mt-1
            max-w-xl
            text-xs
            leading-5
          "
                      style={{
                        color: "rgba(255,255,255,0.68)",
                      }}
                    >
                      Import your existing resume information
                      and use it to build your Career Profile faster.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenResumeImport}
                  className="
        inline-flex
        h-10
        shrink-0
        items-center
        justify-center
        gap-2
        rounded-xl
        px-4
        text-sm
        font-semibold
        transition-all
        duration-200
        hover:-translate-y-0.5
      "
                  style={{
                    background: "var(--primary-fixed)",
                    color: "var(--primary)",
                  }}
                >
                  <FileUp size={16} />

                  Import profile

                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>

          </div>


          {/* ====================================================
            PROFILE STRENGTH CARD
        ==================================================== */}

          <div
            className="
                w-full
                shrink-0
                rounded-[26px]
                border
                p-5
                sm:p-6
                xl:w-[360px]
            "
            style={{
              background:
                "rgba(255,255,255,0.10)",
              borderColor:
                "rgba(255,255,255,0.16)",
              backdropFilter:
                "blur(14px)",
            }}
          >

            {/* Card header */}

            <div
              className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

              <div>

                <p
                  className="
                            text-sm
                            font-semibold
                        "
                  style={{
                    color:
                      "rgba(255,255,255,0.70)",
                  }}
                >
                  Profile strength
                </p>


                <p
                  className="
                            mt-1
                            text-4xl
                            font-bold
                        "
                  style={{
                    fontFamily:
                      "var(--font-heading)",
                    color:
                      "var(--on-primary)",
                  }}
                >
                  {profileCompletion}%
                </p>

              </div>


              <div
                className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                    "
                style={{
                  background:
                    "rgba(255,255,255,0.12)",
                  color:
                    "var(--primary-fixed)",
                }}
              >

                <CircleCheck
                  size={24}
                />

              </div>

            </div>


            {/* Progress */}

            <div
              className="
                    mt-6
                    h-2.5
                    overflow-hidden
                    rounded-full
                "
              style={{
                background:
                  "rgba(255,255,255,0.14)",
              }}
            >

              <div
                className="
                        h-full
                        rounded-full
                        transition-all
                        duration-700
                    "
                style={{
                  width:
                    `${profileCompletion}%`,
                  background:
                    "var(--primary-fixed)",
                }}
              />

            </div>


            {/* Completion message */}

            <p
              className="
                    mt-4
                    text-sm
                    leading-6
                "
              style={{
                color:
                  "rgba(255,255,255,0.68)",
              }}
            >

              A stronger profile helps Skillio understand
              your background and personalize job matching,
              preparation, and career guidance.

            </p>


            {/* Completion state */}

            <div
              className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    px-3
                    py-2.5
                "
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                color:
                  "rgba(255,255,255,0.78)",
              }}
            >

              <Sparkles
                size={15}
                style={{
                  color:
                    "var(--primary-fixed)",
                }}
              />

              <span className="text-xs font-medium">

                {profileCompletion >= 80
                  ? "Your profile is looking strong."
                  : "Keep building your career profile."}

              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =============================================
                MAIN WORKSPACE
            ============================================== */}

      <main
        className="
                    mx-auto
                    py-8
                "
      >

        <div
          className="
                        grid
                        gap-8
                        lg:grid-cols-[250px_minmax(0,1fr)]
                    "
        >


          {/* =====================================
                        LEFT NAVIGATION
                    ====================================== */}

          <aside
            className="
                            lg:sticky
                            lg:top-6
                            lg:h-fit
                        "
          >

            <div
              className="
                                overflow-hidden
                                rounded-3xl
                                border
                                border-[var(--outline-variant)]
                                bg-white
                                p-3
                                shadow-[var(--shadow-sm)]
                            "
            >

              <p
                className="
                                    px-3
                                    pb-3
                                    pt-2
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[var(--on-surface-variant)]
                                "
              >
                Profile sections
              </p>


              <div className="space-y-1">

                {sections.map(
                  (section) => {

                    const Icon =
                      section.icon;

                    const isActive =
                      activeSection ===
                      section.id;

                    return (

                      <button
                        key={
                          section.id
                        }
                        type="button"
                        onClick={() =>
                          setActiveSection(
                            section.id
                          )
                        }
                        className={`
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    rounded-2xl
                                                    px-3
                                                    py-3
                                                    text-left
                                                    transition
                                                    ${isActive
                            ? `
                                                                bg-[var(--primary)]
                                                                text-white
                                                                shadow-md
                                                            `
                            : `
                                                                text-[var(--on-surface-variant)]
                                                                hover:bg-[var(--surface-container-low)]
                                                            `
                          }
                                                `}
                      >

                        <Icon
                          size={18}
                        />

                        <span
                          className="
                                                        flex-1
                                                        text-sm
                                                        font-semibold
                                                    "
                        >
                          {
                            section.label
                          }
                        </span>

                        <ChevronRight
                          size={16}
                        />

                      </button>

                    );

                  }
                )}

              </div>

            </div>


            {/* Small Tip Card */}

            <div
              className="
                                mt-5
                                rounded-3xl
                                bg-[var(--primary)]
                                p-5
                                text-white
                            "
            >

              <Layers3 size={22} />

              <p className="mt-4 font-bold">
                Build progressively
              </p>

              <p
                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-[var(--primary-fixed)]
                                "
              >
                You don't need to complete everything
                today. Save each section whenever
                you're ready.

              </p>

            </div>

          </aside>


          {/* =====================================
                        CONTENT AREA
                    ====================================== */}

          <div className="min-w-0">


            <ErrorToast error={error} />


            {/* ================================================
    PROFESSIONAL PROFILE
================================================ */}

            {activeSection === "profile" && (
              <section
                className="
      overflow-hidden
      rounded-[28px]
      border
      border-[var(--outline-variant)]
      bg-[var(--surface-container-lowest)]
      shadow-[var(--shadow-sm)]
    "
              >
                {/* ============================================
        SECTION HEADER
    ============================================ */}

                <div
                  className="
        border-b
        border-[var(--outline-variant)]
        bg-[var(--surface-container-low)]
        px-6
        py-7
        sm:px-8
      "
                >
                  <div
                    className="
          flex
          flex-col
          gap-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
                  >
                    {/* LEFT SIDE */}

                    <div className="flex items-start gap-4">
                      {/* ICON */}

                      <div
                        className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-[var(--primary-fixed)]
              text-[var(--primary)]
              shadow-[var(--shadow-sm)]
            "
                      >
                        <UserRound size={26} />
                      </div>


                      {/* TEXT */}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2
                            className="
                  font-[var(--font-heading)]
                  text-xl
                  font-bold
                  tracking-tight
                  text-[var(--on-surface)]
                  sm:text-2xl
                "
                          >
                            Professional Profile
                          </h2>


                          {hasProfile && (
                            <span
                              className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-[var(--primary-fixed)]
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-[var(--primary)]
                  "
                            >
                              <CheckCircle2 size={14} />

                              Profile created
                            </span>
                          )}
                        </div>


                        <p
                          className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-[var(--on-surface-variant)]
              "
                        >
                          Create the professional identity that introduces your experience,
                          strengths and career goals.
                        </p>
                      </div>
                    </div>


                    {/* ACTION */}

                    {/* ACTIONS */}

                    <div className="flex flex-wrap items-center gap-3">

                      {/* IMPORT FROM RESUME */}

                      <button
                        type="button"
                        onClick={handleOpenResumeImport}
                        disabled={isSubmitting || isImporting}
                        className="
      inline-flex
      h-11
      items-center
      justify-center
      gap-2
      rounded-xl
      border
      border-[var(--primary-fixed-dim)]
      bg-[var(--primary-fixed)]
      px-5
      text-sm
      font-bold
      text-[var(--primary)]
      transition-all
      duration-200
      hover:-translate-y-0.5
      hover:shadow-[var(--shadow-sm)]
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
                      >
                        <Upload size={17} />

                        Import from Resume
                      </button>


                      {/* EDIT PROFILE */}

                      {!editingProfile && hasProfile && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProfile(true)
                          }
                          className="
        inline-flex
        h-11
        shrink-0
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-[var(--outline-variant)]
        bg-[var(--surface-container-lowest)]
        px-5
        text-sm
        font-semibold
        text-[var(--on-surface)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-[var(--primary-fixed-dim)]
        hover:bg-[var(--primary-fixed)]
        hover:text-[var(--primary)]
      "
                        >
                          <Pencil size={17} />

                          Edit profile
                        </button>
                      )}

                    </div>
                  </div>
                </div>


                {/* ============================================
        PROFILE CONTENT
    ============================================ */}

                <div className="p-6 sm:p-8">

                  {/* ==========================================
          PROFILE DISPLAY
      ========================================== */}

                  {!editingProfile && hasProfile ? (
                    <div className="space-y-8">

                      {/* --------------------------------------
              PROFESSIONAL HEADLINE CARD
          -------------------------------------- */}

                      <div
                        className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-[var(--primary-fixed-dim)]
              bg-[var(--surface-container-low)]
              p-6
              sm:p-8
            "
                      >
                        {/* DECORATIVE ARTWORK */}

                        <div
                          className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-[var(--primary-fixed)]
                opacity-70
                blur-3xl
              "
                        />

                        <div
                          className="
                pointer-events-none
                absolute
                -bottom-24
                left-1/3
                h-40
                w-40
                rounded-full
                bg-[var(--secondary-fixed)]
                opacity-40
                blur-3xl
              "
                        />


                        <div className="relative">

                          {/* LABEL */}

                          <div
                            className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[var(--primary)]
                "
                          >
                            <Sparkles size={15} />

                            Professional identity
                          </div>


                          {/* HEADLINE */}

                          <h3
                            className="
                  mt-5
                  max-w-4xl
                  font-[var(--font-heading)]
                  text-2xl
                  font-bold
                  leading-tight
                  tracking-tight
                  text-[var(--primary)]
                  sm:text-3xl
                "
                          >
                            {careerProfile?.headline || "Your professional headline"}
                          </h3>


                          {/* SUPPORTING TEXT */}

                          <p
                            className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-6
                  text-[var(--on-surface-variant)]
                "
                          >
                            This headline gives people a quick understanding of your
                            professional direction and the value you bring.
                          </p>

                        </div>
                      </div>


                      {/* --------------------------------------
              ABOUT SECTION
          -------------------------------------- */}

                      <div
                        className="
              rounded-3xl
              border
              border-[var(--outline-variant)]
              bg-[var(--surface-container-lowest)]
              p-6
              sm:p-8
            "
                      >
                        {/* HEADER */}

                        <div className="flex items-start gap-4">

                          <div
                            className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--secondary-fixed)]
                  text-[var(--secondary)]
                "
                          >
                            <FileText size={22} />
                          </div>


                          <div>
                            <p
                              className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-[var(--on-surface-variant)]
                  "
                            >
                              About you
                            </p>

                            <h3
                              className="
                    mt-1
                    font-[var(--font-heading)]
                    text-xl
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              Your professional story
                            </h3>

                            <p
                              className="
                    mt-2
                    text-sm
                    leading-6
                    text-[var(--on-surface-variant)]
                  "
                            >
                              A short introduction about your background, strengths and
                              career interests.
                            </p>
                          </div>
                        </div>


                        {/* CONTENT */}

                        <div
                          className="
                mt-7
                border-t
                border-[var(--outline-variant)]
                pt-7
              "
                        >
                          <p
                            className="
                  max-w-4xl
                  whitespace-pre-line
                  text-[15px]
                  leading-8
                  text-[var(--on-surface-variant)]
                "
                          >
                            {careerProfile?.summary ||
                              "No professional summary has been added yet."}
                          </p>
                        </div>
                      </div>


                      {/* --------------------------------------
              PROFILE TIP
          -------------------------------------- */}

                      <div
                        className="
              flex
              flex-col
              gap-4
              rounded-2xl
              border
              border-[var(--primary-fixed-dim)]
              bg-[var(--primary-fixed)]/40
              p-5
              sm:flex-row
              sm:items-start
            "
                      >
                        <div
                          className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[var(--primary-fixed)]
                text-[var(--primary)]
              "
                        >
                          <Lightbulb size={20} />
                        </div>


                        <div>
                          <h4
                            className="
                  text-sm
                  font-bold
                  text-[var(--primary)]
                "
                          >
                            Keep your profile focused
                          </h4>

                          <p
                            className="
                  mt-1
                  max-w-3xl
                  text-sm
                  leading-6
                  text-[var(--on-surface-variant)]
                "
                          >
                            A strong headline and concise professional summary make it
                            easier for recruiters and collaborators to understand your
                            strengths quickly.
                          </p>
                        </div>
                      </div>

                    </div>
                  ) : (

                    /* ==========================================
                        PROFILE FORM
                    ========================================== */

                    <form
                      onSubmit={handleBasicInfoSubmit}
                      className="space-y-7"
                    >

                      {/* ======================================
              FORM INTRODUCTION
          ====================================== */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--primary-fixed-dim)]
              bg-[var(--primary-fixed)]/30
              p-5
            "
                      >
                        <div className="flex items-start gap-3">

                          <div
                            className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--primary-fixed)]
                  text-[var(--primary)]
                "
                          >
                            <UserRound size={19} />
                          </div>


                          <div>
                            <h3
                              className="
                    text-base
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              Build your professional identity
                            </h3>

                            <p
                              className="
                    mt-1
                    max-w-2xl
                    text-sm
                    leading-6
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Start with a clear professional headline and a short summary
                              describing your background and career direction.
                            </p>
                          </div>

                        </div>
                      </div>


                      {/* ======================================
              HEADLINE FIELD
          ====================================== */}

                      <div
                        className="
              rounded-3xl
              border
              border-[var(--outline-variant)]
              bg-[var(--surface-container-lowest)]
              p-5
              sm:p-6
            "
                      >
                        <div className="flex items-start gap-4">

                          {/* NUMBER */}

                          <div
                            className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--primary-fixed)]
                  text-sm
                  font-bold
                  text-[var(--primary)]
                "
                          >
                            01
                          </div>


                          <div className="min-w-0 flex-1">

                            <label
                              className="
                    block
                    text-base
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              Professional headline
                            </label>

                            <p
                              className="
                    mt-1
                    text-sm
                    leading-6
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Write a clear title that quickly explains your professional
                              focus.
                            </p>


                            <div className="mt-5">

                              <input
                                maxLength="150"
                                placeholder="Example: Full Stack Developer building modern web applications"
                                value={basicInfo.headline}
                                onChange={(event) =>
                                  setBasicInfo({
                                    ...basicInfo,
                                    headline: event.target.value,
                                  })
                                }
                                className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--outline-variant)]
                      bg-[var(--surface-container-low)]
                      px-4
                      text-sm
                      text-[var(--on-surface)]
                      outline-none
                      transition
                      placeholder:text-[var(--on-surface-variant)]/60
                      focus:border-[var(--primary)]
                      focus:ring-2
                      focus:ring-[var(--primary-fixed)]
                    "
                              />


                              <div
                                className="
                      mt-2
                      flex
                      justify-end
                      text-xs
                      text-[var(--on-surface-variant)]
                    "
                              >
                                {basicInfo.headline.length}/150
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>


                      {/* ======================================
              SUMMARY FIELD
          ====================================== */}

                      <div
                        className="
              rounded-3xl
              border
              border-[var(--outline-variant)]
              bg-[var(--surface-container-lowest)]
              p-5
              sm:p-6
            "
                      >
                        <div className="flex items-start gap-4">

                          {/* NUMBER */}

                          <div
                            className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--secondary-fixed)]
                  text-sm
                  font-bold
                  text-[var(--secondary)]
                "
                          >
                            02
                          </div>


                          <div className="min-w-0 flex-1">

                            <label
                              className="
                    block
                    text-base
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              Professional summary
                            </label>

                            <p
                              className="
                    mt-1
                    text-sm
                    leading-6
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Describe your background, key strengths, interests and the
                              direction you want your career to take.
                            </p>


                            <div className="mt-5">

                              <textarea
                                rows="8"
                                maxLength="2000"
                                placeholder="Example: I am a developer passionate about solving real-world problems and building modern, reliable web applications..."
                                value={basicInfo.summary}
                                onChange={(event) =>
                                  setBasicInfo({
                                    ...basicInfo,
                                    summary: event.target.value,
                                  })
                                }
                                className="
                      min-h-[200px]
                      w-full
                      resize-y
                      rounded-2xl
                      border
                      border-[var(--outline-variant)]
                      bg-[var(--surface-container-low)]
                      p-4
                      text-sm
                      leading-7
                      text-[var(--on-surface)]
                      outline-none
                      transition
                      placeholder:text-[var(--on-surface-variant)]/60
                      focus:border-[var(--primary)]
                      focus:ring-2
                      focus:ring-[var(--primary-fixed)]
                    "
                              />


                              <div
                                className="
                      mt-2
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                              >
                                <span
                                  className="
                        text-xs
                        text-[var(--on-surface-variant)]
                      "
                                >
                                  Keep it concise and focused on your professional journey.
                                </span>

                                <span
                                  className="
                        shrink-0
                        text-xs
                        text-[var(--on-surface-variant)]
                      "
                                >
                                  {basicInfo.summary.length}/2000
                                </span>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>


                      {/* ======================================
              FORM ACTIONS
          ====================================== */}

                      <div
                        className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-[var(--outline-variant)]
              pt-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
                      >
                        {/* LEFT STATUS */}

                        <div
                          className="
                text-sm
                text-[var(--on-surface-variant)]
              "
                        >
                          Your changes will update your professional profile.
                        </div>


                        {/* ACTIONS */}

                        <div
                          className="
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
              "
                        >
                          {hasProfile && (
                            <button
                              type="button"
                              onClick={() => setEditingProfile(false)}
                              className="
                    rounded-xl
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-[var(--on-surface-variant)]
                    transition
                    hover:bg-[var(--surface-container-low)]
                  "
                            >
                              Cancel
                            </button>
                          )}


                          <button
                            type="submit"
                            className="
                  inline-flex
                  min-w-[180px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-[var(--shadow-sm)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-container)]
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
                          >
                            <>
                              <Save size={17} />

                              {hasProfile
                                ? "Save changes"
                                : "Create career profile"}
                            </>
                          </button>
                        </div>
                      </div>

                    </form>
                  )}
                </div>
              </section>
            )}


            {/* ================================================
            SKILLS & EXPERTISE
            ================================================ */}

            {activeSection === "skills" && (
              <section
                className="
      overflow-hidden
      rounded-[28px]
      border
      border-[var(--outline-variant)]
      bg-[var(--surface-container-lowest)]
      shadow-[var(--shadow-sm)]
    "
              >
                {/* ============================================
        SECTION HEADER
    ============================================ */}

                <div
                  className="
        border-b
        border-[var(--outline-variant)]
        bg-[var(--surface-container-low)]
        px-6
        py-7
        sm:px-8
      "
                >
                  <div
                    className="
          flex
          flex-col
          gap-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
                  >
                    {/* LEFT CONTENT */}

                    <div className="flex items-start gap-4">
                      <div
                        className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-[var(--primary-fixed)]
              text-[var(--primary)]
              shadow-[var(--shadow-sm)]
            "
                      >
                        <BrainCircuit size={26} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2
                            className="
                  font-[var(--font-heading)]
                  text-xl
                  font-bold
                  tracking-tight
                  text-[var(--on-surface)]
                  sm:text-2xl
                "
                          >
                            Skills & Expertise
                          </h2>

                          {skills.length > 0 && (
                            <span
                              className="
                    rounded-full
                    bg-[var(--primary-fixed)]
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-[var(--primary)]
                  "
                            >
                              {skills.length} {skills.length === 1 ? "skill" : "skills"}
                            </span>
                          )}
                        </div>

                        <p
                          className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-[var(--on-surface-variant)]
              "
                        >
                          Add the technologies, tools and professional strengths that
                          represent what you can confidently work with.
                        </p>
                      </div>
                    </div>

                    {/* ACTION */}

                    {!showSkillEditor ? (
                      <button
                        type="button"
                        onClick={() => setShowSkillEditor(true)}
                        className="
              inline-flex
              h-11
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[var(--primary)]
              px-5
              text-sm
              font-semibold
              text-white
              shadow-[var(--shadow-sm)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[var(--primary-container)]
              active:translate-y-0
            "
                      >
                        <Plus size={18} />

                        Manage skills
                      </button>
                    ) : (
                      <div
                        className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-xl
              bg-[var(--primary-fixed)]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[var(--primary)]
            "
                      >
                        <Pencil size={16} />

                        Editing skills
                      </div>
                    )}
                  </div>
                </div>


                {/* ============================================
        MAIN CONTENT
    ============================================ */}

                <div className="p-6 sm:p-8">

                  {/* ==========================================
          CURRENT SKILLS
      ========================================== */}

                  {skills.length > 0 ? (
                    <div>
                      <div
                        className="
              mb-5
              flex
              flex-col
              gap-1
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
                      >
                        <div>
                          <h3
                            className="
                  font-[var(--font-heading)]
                  text-lg
                  font-bold
                  text-[var(--on-surface)]
                "
                          >
                            Your skills
                          </h3>

                          <p
                            className="
                  mt-1
                  text-sm
                  text-[var(--on-surface-variant)]
                "
                          >
                            These skills will be showcased on your professional profile.
                          </p>
                        </div>

                        <span
                          className="
                text-sm
                font-medium
                text-[var(--on-surface-variant)]
              "
                        >
                          {skills.length} added
                        </span>
                      </div>


                      {/* SKILLS GRID */}

                      <div
                        className="
              grid
              gap-3
              sm:grid-cols-2
              xl:grid-cols-3
            "
                      >
                        {skills.map((skill, index) => (
                          <div
                            key={skill}
                            className="
                  group
                  flex
                  min-h-[76px]
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border
                  border-[var(--outline-variant)]
                  bg-[var(--surface-container-lowest)]
                  px-4
                  py-3
                  transition-all
                  duration-200
                  hover:border-[var(--primary-fixed-dim)]
                  hover:bg-[var(--surface-container-low)]
                  hover:shadow-[var(--shadow-sm)]
                "
                          >
                            <div
                              className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                            >
                              {/* NUMBER */}

                              <div
                                className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[var(--primary-fixed)]
                      text-xs
                      font-bold
                      text-[var(--primary)]
                    "
                              >
                                {String(index + 1).padStart(2, "0")}
                              </div>


                              {/* SKILL */}

                              <div className="min-w-0">
                                <p
                                  className="
                        truncate
                        text-sm
                        font-semibold
                        text-[var(--on-surface)]
                      "
                                >
                                  {skill}
                                </p>

                                <p
                                  className="
                        mt-0.5
                        text-xs
                        text-[var(--on-surface-variant)]
                      "
                                >
                                  Added to profile
                                </p>
                              </div>
                            </div>


                            {/* REMOVE */}

                            {showSkillEditor && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      text-[var(--on-surface-variant)]
                      transition
                      hover:bg-[var(--error-container)]
                      hover:text-[var(--on-surface)]
                    "
                                title={`Remove ${skill}`}
                              >
                                <Trash2 size={17} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* ==========================================
                        EMPTY STATE
                    ========================================== */

                    <div
                      className="
            rounded-3xl
            border
            border-dashed
            border-[var(--outline-variant)]
            bg-[var(--surface-container-low)]
            px-6
            py-12
            text-center
          "
                    >
                      <div
                        className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-[var(--primary-fixed)]
              text-[var(--primary)]
            "
                      >
                        <BrainCircuit size={28} />
                      </div>

                      <h3
                        className="
              mt-5
              font-[var(--font-heading)]
              text-lg
              font-bold
              text-[var(--on-surface)]
            "
                      >
                        Start building your expertise
                      </h3>

                      <p
                        className="
              mx-auto
              mt-2
              text-sm
              leading-6
              text-[var(--on-surface-variant)]
            "
                      >
                        Add the skills, technologies and strengths that best represent
                        your professional abilities.
                      </p>

                      {!showSkillEditor && (
                        <button
                          type="button"
                          onClick={() => setShowSkillEditor(true)}
                          className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[var(--primary)]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[var(--primary-container)]
              "
                        >
                          <Plus size={17} />

                          Add your first skill
                        </button>
                      )}
                    </div>
                  )}


                  {/* ==========================================
          SKILL EDITOR
      ========================================== */}

                  {showSkillEditor && (
                    <div
                      className="
            mt-8
            overflow-hidden
            rounded-3xl
            border
            border-[var(--primary-fixed-dim)]
            bg-[var(--surface-container-low)]
          "
                    >
                      {/* EDITOR TOP */}

                      <div
                        className="
              border-b
              border-[var(--outline-variant)]
              bg-[var(--surface-container-lowest)]
              px-6
              py-5
            "
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--primary-fixed)]
                  text-[var(--primary)]
                "
                          >
                            <Plus size={19} />
                          </div>

                          <div>
                            <h3
                              className="
                    text-base
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              Add a skill
                            </h3>

                            <p
                              className="
                    mt-1
                    text-sm
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Enter one skill at a time. You can add as many as you need.
                            </p>
                          </div>
                        </div>
                      </div>


                      {/* EDITOR BODY */}

                      <div className="p-5 sm:p-6">

                        {/* INPUT */}

                        <div
                          className="
                flex
                flex-col
                gap-3
                sm:flex-row
              "
                        >
                          <div className="relative flex-1">
                            <Search
                              size={18}
                              className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[var(--on-surface-variant)]
                  "
                            />

                            <input
                              value={skillInput}
                              onChange={(event) =>
                                setSkillInput(event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleAddSkill();
                                }
                              }}
                              placeholder="Example: React, JavaScript, Problem Solving"
                              className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-lowest)]
                    pl-11
                    pr-4
                    text-sm
                    text-[var(--on-surface)]
                    outline-none
                    transition
                    placeholder:text-[var(--on-surface-variant)]/60
                    focus:border-[var(--primary)]
                    focus:ring-2
                    focus:ring-[var(--primary-fixed)]
                  "
                            />
                          </div>


                          <button
                            type="button"
                            onClick={handleAddSkill}
                            disabled={!skillInput.trim()}
                            className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[var(--primary-container)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                          >
                            <Plus size={18} />

                            Add skill
                          </button>
                        </div>


                        {/* SUGGESTIONS */}

                        <div className="mt-7">
                          <div className="mb-3 flex items-center gap-2">
                            <Sparkles
                              size={16}
                              className="text-[var(--secondary)]"
                            />

                            <p
                              className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Quick suggestions
                            </p>
                          </div>


                          <div className="flex flex-wrap gap-2">
                            {[
                              "React",
                              "JavaScript",
                              "Node.js",
                              "Express.js",
                              "MongoDB",
                              "Git",
                              "Problem Solving",
                            ]
                              .filter((suggestion) => !skills.includes(suggestion))
                              .map((suggestion) => (
                                <button
                                  key={suggestion}
                                  type="button"
                                  onClick={() => setSkillInput(suggestion)}
                                  className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        px-3.5
                        py-2
                        text-xs
                        font-medium
                        text-[var(--on-surface-variant)]
                        transition
                        hover:border-[var(--primary-fixed-dim)]
                        hover:bg-[var(--primary-fixed)]
                        hover:text-[var(--primary)]
                      "
                                >
                                  <Plus size={13} />

                                  {suggestion}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>


                      {/* ======================================
              EDITOR FOOTER
          ====================================== */}

                      <div
                        className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-[var(--outline-variant)]
              bg-[var(--surface-container-lowest)]
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-6
            "
                      >
                        <button
                          type="button"
                          onClick={() => setShowSkillEditor(false)}
                          className="
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                text-[var(--on-surface-variant)]
                transition
                hover:bg-[var(--surface-container-low)]
              "
                        >
                          Cancel
                        </button>


                        <button
                          type="button"
                          disabled={isSubmitting || !hasProfile}
                          onClick={handleSaveSkills}
                          className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--primary)]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-[var(--shadow-sm)]
                transition
                hover:bg-[var(--primary-container)]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />

                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={17} />

                              Save skills
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}


            {/* =================================
              EXPERIENCE
            ================================== */}

            {activeSection === "experience" && (
              <section
                className="
      overflow-hidden
      rounded-[28px]
      border
      border-[var(--outline-variant)]
      bg-[var(--surface-container-lowest)]
      shadow-[var(--shadow-sm)]
    "
              >
                {/* =================================
        SECTION HEADER
    ================================== */}

                <div
                  className="
        border-b
        border-[var(--outline-variant)]
        bg-[var(--surface-container-low)]
        px-6
        py-6
        sm:px-8
      "
                >
                  <div
                    className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
                  >
                    {/* LEFT */}

                    <div className="flex items-start gap-4">
                      <div
                        className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-[var(--primary-fixed)]
              text-[var(--primary)]
            "
                      >
                        <BriefcaseBusiness size={25} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2
                            className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-[var(--on-surface)]
                  sm:text-2xl
                "
                          >
                            Work experience
                          </h2>

                          {careerProfile?.experiences?.length > 0 && (
                            <span
                              className="
                    rounded-full
                    bg-[var(--primary-fixed)]
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-[var(--primary)]
                  "
                            >
                              {careerProfile.experiences.length}{" "}
                              {careerProfile.experiences.length === 1
                                ? "experience"
                                : "experiences"}
                            </span>
                          )}
                        </div>

                        <p
                          className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-[var(--on-surface-variant)]
              "
                        >
                          Add, manage and showcase the professional experiences
                          that helped shape your career.
                        </p>
                      </div>
                    </div>

                    {/* RIGHT ACTION */}

                    {!showExperienceEditor ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExperienceId(null);
                          setExperience({ ...emptyExperience });
                          setShowExperienceEditor(true);
                        }}
                        className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--primary)]
                px-4
                py-3
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-[var(--primary-container)]
            "
                      >
                        <Plus size={18} />
                        Add experience
                      </button>
                    ) : (
                      <div
                        className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-xl
              border
              border-[var(--primary-fixed-dim)]
              bg-[var(--primary-fixed)]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[var(--primary)]
            "
                      >
                        <Pencil size={16} />

                        {editingExperienceId
                          ? "Editing experience"
                          : "Adding experience"}
                      </div>
                    )}
                  </div>
                </div>

                {/* =================================
        CONTENT
    ================================== */}

                <div className="p-6 sm:p-8">

                  {/* =================================
          EXPERIENCE OVERVIEW
      ================================== */}

                  {careerProfile?.experiences?.length > 0 && (
                    <div
                      className="
            mb-8
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
                    >
                      {/* TOTAL */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              p-4
            "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--primary-fixed)]
                  text-[var(--primary)]
                "
                          >
                            <BriefcaseBusiness size={19} />
                          </div>

                          <div>
                            <p
                              className="
                    text-xs
                    font-medium
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Total experience
                            </p>

                            <p
                              className="
                    mt-1
                    text-xl
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              {careerProfile.experiences.length}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CURRENT */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              p-4
            "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--secondary-fixed)]
                  text-[var(--secondary)]
                "
                          >
                            <TrendingUp size={19} />
                          </div>

                          <div>
                            <p
                              className="
                    text-xs
                    font-medium
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Current roles
                            </p>

                            <p className="mt-1 text-xl font-bold">
                              {
                                careerProfile.experiences.filter(
                                  (item) => item.isCurrent
                                ).length
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* TIP */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--primary-fixed-dim)]
              bg-[var(--primary-fixed)]/40
              p-4
            "
                      >
                        <div className="flex gap-3">
                          <Sparkles
                            size={19}
                            className="
                  mt-0.5
                  shrink-0
                  text-[var(--primary)]
                "
                          />

                          <div>
                            <p
                              className="
                    text-sm
                    font-bold
                    text-[var(--primary)]
                  "
                            >
                              Show your impact
                            </p>

                            <p
                              className="
                    mt-1
                    text-xs
                    leading-5
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Mention achievements and technologies you used.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =================================
          EXPERIENCE LIST
      ================================== */}

                  {careerProfile?.experiences?.length > 0 ? (
                    <div>
                      <div className="mb-5">
                        <h3
                          className="
                text-lg
                font-bold
                text-[var(--on-surface)]
              "
                        >
                          Your experience
                        </h3>

                        <p
                          className="
                mt-1
                text-sm
                text-[var(--on-surface-variant)]
              "
                        >
                          Manage and update your professional journey.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {careerProfile.experiences.map((item) => (
                          <div
                            key={item._id}
                            className="
                  rounded-[22px]
                  border
                  border-[var(--outline-variant)]
                  bg-[var(--surface-container-lowest)]
                  p-5
                  transition
                  hover:border-[var(--primary-fixed-dim)]
                  hover:shadow-[var(--shadow-md)]
                "
                          >
                            {/* CARD TOP */}

                            <div
                              className="
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                  "
                            >
                              {/* EXPERIENCE INFO */}

                              <div className="flex min-w-0 gap-4">
                                <div
                                  className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[var(--primary-fixed)]
                        text-[var(--primary)]
                      "
                                >
                                  <Building2 size={21} />
                                </div>

                                <div className="min-w-0">
                                  <div
                                    className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                                  >
                                    <h3
                                      className="
                            text-base
                            font-bold
                            text-[var(--on-surface)]
                          "
                                    >
                                      {item.position}
                                    </h3>

                                    {item.isCurrent && (
                                      <span
                                        className="
                              rounded-full
                              bg-[var(--primary-fixed)]
                              px-2.5
                              py-1
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wide
                              text-[var(--primary)]
                            "
                                      >
                                        Current
                                      </span>
                                    )}
                                  </div>

                                  <p
                                    className="
                          mt-1
                          font-semibold
                          text-[var(--primary)]
                        "
                                  >
                                    {item.company}
                                  </p>

                                  <div
                                    className="
                          mt-3
                          flex
                          flex-wrap
                          gap-x-4
                          gap-y-2
                          text-xs
                          text-[var(--on-surface-variant)]
                        "
                                  >
                                    {item.location && (
                                      <span className="flex items-center gap-1.5">
                                        <MapPin size={14} />
                                        {item.location}
                                      </span>
                                    )}

                                    <span className="flex items-center gap-1.5">
                                      <CalendarDays size={14} />

                                      {formatDateForDisplay(item.startDate)} —{" "}

                                      {item.isCurrent
                                        ? "Present"
                                        : formatDateForDisplay(item.endDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* ACTIONS */}

                              <div
                                className="
                      flex
                      shrink-0
                      items-center
                      gap-2
                    "
                              >
                                {/* EDIT */}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingExperienceId(item._id);

                                    setExperience({
                                      company: item.company || "",
                                      position: item.position || "",
                                      location: item.location || "",

                                      startDate: formatDateForInput(item.startDate),

                                      endDate: formatDateForInput(item.endDate),

                                      isCurrent: Boolean(item.isCurrent),

                                      description: item.description || "",

                                      technologies: Array.isArray(item.technologies)
                                        ? item.technologies.join(", ")
                                        : item.technologies || "",
                                    });

                                    setShowExperienceEditor(true);

                                    // Scroll to editor smoothly
                                    setTimeout(() => {
                                      document
                                        .getElementById("experience-editor")
                                        ?.scrollIntoView({
                                          behavior: "smooth",
                                          block: "start",
                                        });
                                    }, 100);
                                  }}
                                  className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        px-3.5
                        text-sm
                        font-semibold
                        text-[var(--on-surface)]
                        transition
                        hover:bg-[var(--surface-container-low)]
                      "
                                >
                                  <Pencil size={15} />
                                  Edit
                                </button>

                                {/* DELETE */}

                                <button
                                  type="button"
                                  onClick={() => {
                                    const confirmed = window.confirm(
                                      `Are you sure you want to delete your experience at ${item.company}?`
                                    );

                                    if (confirmed) {
                                      handleDeleteExperience(item._id);
                                    }
                                  }}
                                  className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-[var(--on-surface-variant)]
                        transition
                        hover:bg-[var(--error-container)]
                        hover:text-[var(--error)]
                      "
                                  title="Delete experience"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>
                            </div>

                            {/* DESCRIPTION */}

                            {item.description && (
                              <div
                                className="
                      mt-5
                      border-t
                      border-[var(--outline-variant)]
                      pt-5
                    "
                              >
                                <p
                                  className="
                        text-sm
                        leading-7
                        text-[var(--on-surface-variant)]
                      "
                                >
                                  {item.description}
                                </p>
                              </div>
                            )}

                            {/* TECHNOLOGIES */}

                            {item.technologies?.length > 0 && (
                              <div
                                className="
                      mt-4
                      flex
                      flex-wrap
                      gap-2
                    "
                              >
                                {item.technologies.map((tech, index) => (
                                  <span
                                    key={`${tech}-${index}`}
                                    className="
                          rounded-full
                          border
                          border-[var(--primary-fixed-dim)]
                          bg-[var(--primary-fixed)]/60
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-[var(--primary)]
                        "
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    !showExperienceEditor && (
                      /* =================================
                          EMPTY STATE
                      ================================== */

                      <div
                        className="
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-dashed
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              px-6
              py-16
              text-center
            "
                      >
                        <div
                          className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-48
                w-48
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[var(--primary-fixed)]
                opacity-50
                blur-3xl
              "
                        />

                        <div className="relative">
                          <div
                            className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--surface-container-lowest)]
                  text-[var(--primary)]
                  shadow-[var(--shadow-sm)]
                "
                          >
                            <BriefcaseBusiness size={28} />
                          </div>

                          <h3 className="mt-5 text-lg font-bold">
                            Add your professional experience
                          </h3>

                          <p
                            className="
                  mx-auto
                  mt-2
                  text-sm
                  leading-6
                  text-[var(--on-surface-variant)]
                "
                          >
                            Showcase internships, jobs, freelance work and other
                            experiences that demonstrate your professional growth.
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingExperienceId(null);
                              setExperience({ ...emptyExperience });
                              setShowExperienceEditor(true);
                            }}
                            className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(62,74,55,0.16)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-container)]
                "
                          >
                            <Plus size={17} />
                            Add your first experience
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  {/* =================================
          EXPERIENCE EDITOR
      ================================== */}

                  {showExperienceEditor && (
                    <div
                      id="experience-editor"
                      className="
            mt-8
            overflow-hidden
            rounded-[24px]
            border
            border-[var(--primary-fixed-dim)]
            bg-[var(--surface-container-low)]
          "
                    >
                      {/* EDITOR HEADER */}

                      <div
                        className="
              border-b
              border-[var(--outline-variant)]
              bg-[var(--surface-container-lowest)]
              px-5
              py-5
              sm:px-6
            "
                      >
                        <div
                          className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
                        >
                          <div>
                            <h3
                              className="
                    text-lg
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              {editingExperienceId
                                ? "Edit experience"
                                : "Add new experience"}
                            </h3>

                            <p
                              className="
                    mt-1
                    text-sm
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Add the role, responsibilities and technologies
                              that represent this experience.
                            </p>
                          </div>

                          <div
                            className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-[var(--primary-fixed)]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[var(--primary)]
                "
                          >
                            <BriefcaseBusiness size={14} />
                            Career experience
                          </div>
                        </div>
                      </div>

                      {/* FORM */}

                      <form
                        onSubmit={handleExperienceSubmit}
                        className="p-5 sm:p-6"
                      >
                        <div className="space-y-6">

                          {/* ROLE DETAILS */}

                          <div>
                            <div className="mb-4">
                              <h4
                                className="
                      text-sm
                      font-bold
                      text-[var(--on-surface)]
                    "
                              >
                                Role details
                              </h4>

                              <p
                                className="
                      mt-1
                      text-xs
                      text-[var(--on-surface-variant)]
                    "
                              >
                                Basic information about your position.
                              </p>
                            </div>

                            <div
                              className="
                    grid
                    gap-5
                    md:grid-cols-2
                  "
                            >
                              <FormField label="Company">
                                <input
                                  required
                                  value={experience.company}
                                  onChange={(event) =>
                                    setExperience({
                                      ...experience,
                                      company: event.target.value,
                                    })
                                  }
                                  placeholder="e.g. Google"
                                  className="skillio-input"
                                />
                              </FormField>

                              <FormField label="Position">
                                <input
                                  required
                                  value={experience.position}
                                  onChange={(event) =>
                                    setExperience({
                                      ...experience,
                                      position: event.target.value,
                                    })
                                  }
                                  placeholder="e.g. Software Developer Intern"
                                  className="skillio-input"
                                />
                              </FormField>
                            </div>

                            <div className="mt-5">
                              <FormField
                                label="Location"
                                hint="Optional"
                              >
                                <input
                                  value={experience.location}
                                  onChange={(event) =>
                                    setExperience({
                                      ...experience,
                                      location: event.target.value,
                                    })
                                  }
                                  placeholder="e.g. Mumbai, Maharashtra"
                                  className="skillio-input"
                                />
                              </FormField>
                            </div>
                          </div>

                          <div className="border-t border-[var(--outline-variant)]" />

                          {/* DURATION */}

                          <div>
                            <div className="mb-4">
                              <h4 className="text-sm font-bold">
                                Duration
                              </h4>

                              <p
                                className="
                      mt-1
                      text-xs
                      text-[var(--on-surface-variant)]
                    "
                              >
                                Tell us when you worked in this role.
                              </p>
                            </div>

                            <div
                              className="
                    grid
                    gap-5
                    md:grid-cols-2
                  "
                            >
                              <FormField label="Start date">
                                <input
                                  required
                                  type="date"
                                  value={experience.startDate}
                                  onChange={(event) =>
                                    setExperience({
                                      ...experience,
                                      startDate: event.target.value,
                                    })
                                  }
                                  className="skillio-input"
                                />
                              </FormField>

                              {!experience.isCurrent && (
                                <FormField label="End date">
                                  <input
                                    type="date"
                                    value={experience.endDate}
                                    onChange={(event) =>
                                      setExperience({
                                        ...experience,
                                        endDate: event.target.value,
                                      })
                                    }
                                    className="skillio-input"
                                  />
                                </FormField>
                              )}
                            </div>

                            <label
                              className="
                    mt-5
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-lowest)]
                    p-4
                    transition
                    hover:border-[var(--primary-fixed-dim)]
                  "
                            >
                              <input
                                type="checkbox"
                                checked={experience.isCurrent}
                                onChange={(event) =>
                                  setExperience({
                                    ...experience,
                                    isCurrent: event.target.checked,
                                    endDate: event.target.checked
                                      ? ""
                                      : experience.endDate,
                                  })
                                }
                                className="
                      h-4
                      w-4
                      accent-[var(--primary)]
                    "
                              />

                              <div>
                                <p className="text-sm font-bold">
                                  I currently work here
                                </p>

                                <p
                                  className="
                        mt-0.5
                        text-xs
                        text-[var(--on-surface-variant)]
                      "
                                >
                                  Your end date will be shown as Present.
                                </p>
                              </div>
                            </label>
                          </div>

                          <div className="border-t border-[var(--outline-variant)]" />

                          {/* DESCRIPTION */}

                          <FormField
                            label="Responsibilities & achievements"
                            hint="Optional"
                          >
                            <textarea
                              rows="6"
                              value={experience.description}
                              onChange={(event) =>
                                setExperience({
                                  ...experience,
                                  description: event.target.value,
                                })
                              }
                              placeholder="Describe what you worked on, the responsibilities you handled and the impact you created..."
                              className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-lowest)]
                    p-4
                    text-sm
                    leading-6
                    outline-none
                    transition
                    placeholder:text-[var(--on-surface-variant)]/60
                    focus:border-[var(--primary)]
                    focus:ring-2
                    focus:ring-[var(--primary-fixed)]
                  "
                            />
                          </FormField>

                          {/* TECHNOLOGIES */}

                          <FormField
                            label="Technologies & tools"
                            hint="Separate multiple skills with commas"
                          >
                            <input
                              value={experience.technologies}
                              onChange={(event) =>
                                setExperience({
                                  ...experience,
                                  technologies: event.target.value,
                                })
                              }
                              placeholder="React, Node.js, MongoDB, Git"
                              className="skillio-input"
                            />
                          </FormField>
                        </div>

                        {/* FORM FOOTER */}

                        <div
                          className="
                mt-8
                flex
                flex-col-reverse
                gap-3
                border-t
                border-[var(--outline-variant)]
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setShowExperienceEditor(false);
                              setEditingExperienceId(null);
                              setExperience({ ...emptyExperience });
                            }}
                            className="
                  rounded-xl
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-[var(--on-surface-variant)]
                  transition
                  hover:bg-[var(--surface-container-high)]
                "
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(62,74,55,0.18)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-container)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2
                                  size={17}
                                  className="animate-spin"
                                />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={17} />

                                {editingExperienceId
                                  ? "Save changes"
                                  : "Add experience"}
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </section>
            )}


            {/* =================================
            PROJECTS
            ================================== */}

            {activeSection === "projects" && (
              <section
                className="
      overflow-hidden
      rounded-[28px]
      border
      border-[var(--outline-variant)]
      bg-[var(--surface-container-lowest)]
      shadow-[var(--shadow-sm)]
    "
              >
                {/* =================================
        SECTION HEADER
    ================================== */}

                <div
                  className="
        border-b
        border-[var(--outline-variant)]
        bg-[var(--surface-container-low)]
        px-6
        py-6
        sm:px-8
      "
                >
                  <div
                    className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
                  >
                    {/* LEFT */}

                    <div className="flex items-start gap-4">
                      <div
                        className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-[var(--primary-fixed)]
              text-[var(--primary)]
            "
                      >
                        <FolderKanban size={25} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2
                            className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-[var(--on-surface)]
                  sm:text-2xl
                "
                          >
                            Projects
                          </h2>

                          {careerProfile?.projects?.length > 0 && (
                            <span
                              className="
                    rounded-full
                    bg-[var(--primary-fixed)]
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-[var(--primary)]
                  "
                            >
                              {careerProfile.projects.length}{" "}
                              {careerProfile.projects.length === 1
                                ? "project"
                                : "projects"}
                            </span>
                          )}
                        </div>

                        <p
                          className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-[var(--on-surface-variant)]
              "
                        >
                          Showcase practical projects that demonstrate your technical
                          skills and problem-solving abilities.
                        </p>
                      </div>
                    </div>

                    {/* RIGHT ACTION */}

                    {!showProjectEditor ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProjectId(null);

                          setProject({
                            ...emptyProject,
                          });

                          setShowProjectEditor(true);
                        }}
                        className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--primary)]
                px-4
                py-3
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-[var(--primary-container)]
            "
                      >
                        <Plus size={18} />
                        Add project
                      </button>
                    ) : (
                      <div
                        className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-xl
              border
              border-[var(--primary-fixed-dim)]
              bg-[var(--primary-fixed)]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[var(--primary)]
            "
                      >
                        <Pencil size={16} />

                        {editingProjectId
                          ? "Editing project"
                          : "Adding project"}
                      </div>
                    )}
                  </div>
                </div>

                {/* =================================
        CONTENT
    ================================== */}

                <div className="p-6 sm:p-8">
                  {/* =================================
          PROJECT OVERVIEW
      ================================== */}

                  {careerProfile?.projects?.length > 0 && (
                    <div
                      className="
            mb-8
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
                    >
                      {/* TOTAL PROJECTS */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              p-4
            "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--primary-fixed)]
                  text-[var(--primary)]
                "
                          >
                            <FolderKanban size={19} />
                          </div>

                          <div>
                            <p
                              className="
                    text-xs
                    font-medium
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Total projects
                            </p>

                            <p
                              className="
                    mt-1
                    text-xl
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              {careerProfile.projects.length}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* LIVE PROJECTS */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              p-4
            "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--secondary-fixed)]
                  text-[var(--secondary)]
                "
                          >
                            <ExternalLink size={19} />
                          </div>

                          <div>
                            <p
                              className="
                    text-xs
                    font-medium
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Live projects
                            </p>

                            <p
                              className="
                    mt-1
                    text-xl
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              {
                                careerProfile.projects.filter(
                                  (item) => item.projectUrl
                                ).length
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* TIP */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--primary-fixed-dim)]
              bg-[var(--primary-fixed)]/40
              p-4
            "
                      >
                        <div className="flex gap-3">
                          <Sparkles
                            size={19}
                            className="
                  mt-0.5
                  shrink-0
                  text-[var(--primary)]
                "
                          />

                          <div>
                            <p
                              className="
                    text-sm
                    font-bold
                    text-[var(--primary)]
                  "
                            >
                              Showcase your work
                            </p>

                            <p
                              className="
                    mt-1
                    text-xs
                    leading-5
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Add technologies, live links and source code to make your
                              projects more impactful.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =================================
          PROJECT LIST
      ================================== */}

                  {careerProfile?.projects?.length > 0 ? (
                    <div>
                      <div className="mb-5">
                        <h3
                          className="
                text-lg
                font-bold
                text-[var(--on-surface)]
              "
                        >
                          Your projects
                        </h3>

                        <p
                          className="
                mt-1
                text-sm
                text-[var(--on-surface-variant)]
              "
                        >
                          Manage and update the projects in your portfolio.
                        </p>
                      </div>

                      <div
                        className="
              grid
              gap-5
              md:grid-cols-2
            "
                      >
                        {careerProfile.projects.map((item) => (
                          <div
                            key={item._id}
                            className="
                  group
                  flex
                  flex-col
                  rounded-[22px]
                  border
                  border-[var(--outline-variant)]
                  bg-[var(--surface-container-lowest)]
                  p-5
                  transition
                  hover:border-[var(--primary-fixed-dim)]
                  hover:shadow-[var(--shadow-md)]
                "
                          >
                            {/* TOP */}

                            <div
                              className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                            >
                              {/* PROJECT INFO */}

                              <div className="flex min-w-0 gap-4">
                                <div
                                  className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[var(--primary-fixed)]
                        text-[var(--primary)]
                      "
                                >
                                  <FolderKanban size={21} />
                                </div>

                                <div className="min-w-0">
                                  <h3
                                    className="
                          text-base
                          font-bold
                          text-[var(--on-surface)]
                        "
                                  >
                                    {item.name}
                                  </h3>

                                  {item.description && (
                                    <p
                                      className="
                            mt-2
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                          "
                                    >
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* ACTIONS */}

                              <div
                                className="
                      flex
                      shrink-0
                      items-center
                      gap-1
                    "
                              >
                                {/* EDIT */}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProjectId(item._id);

                                    setProject({
                                      name: item.name || "",
                                      description: item.description || "",

                                      technologies: Array.isArray(
                                        item.technologies
                                      )
                                        ? item.technologies.join(", ")
                                        : item.technologies || "",

                                      projectUrl: item.projectUrl || "",

                                      githubUrl: item.githubUrl || "",
                                    });

                                    setShowProjectEditor(true);
                                  }}
                                  className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-[var(--on-surface-variant)]
                        transition
                        hover:bg-[var(--surface-container-low)]
                        hover:text-[var(--primary)]
                      "
                                  title="Edit project"
                                >
                                  <Pencil size={17} />
                                </button>

                                {/* DELETE */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteProject(item._id)
                                  }
                                  className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-[var(--on-surface-variant)]
                        transition
                        hover:bg-[var(--error-container)]
                        hover:text-[var(--error)]
                      "
                                  title="Delete project"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>
                            </div>

                            {/* TECHNOLOGIES */}

                            {item.technologies?.length > 0 && (
                              <div
                                className="
                      mt-5
                      flex
                      flex-wrap
                      gap-2
                    "
                              >
                                {item.technologies.map((tech) => (
                                  <span
                                    key={tech}
                                    className="
                          rounded-full
                          border
                          border-[var(--primary-fixed-dim)]
                          bg-[var(--primary-fixed)]/60
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-[var(--primary)]
                        "
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* LINKS */}

                            {(item.projectUrl || item.githubUrl) && (
                              <div
                                className="
                      mt-5
                      flex
                      flex-wrap
                      gap-4
                      border-t
                      border-[var(--outline-variant)]
                      pt-5
                    "
                              >
                                {item.projectUrl && (
                                  <a
                                    href={item.projectUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          font-semibold
                          text-[var(--primary)]
                          transition
                          hover:underline
                        "
                                  >
                                    <ExternalLink size={16} />
                                    Live project
                                  </a>
                                )}

                                {item.githubUrl && (
                                  <a
                                    href={item.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          font-semibold
                          text-[var(--primary)]
                          transition
                          hover:underline
                        "
                                  >
                                    <Github size={16} />
                                    Source code
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* =================================
                        EMPTY STATE
                    ================================== */

                    !showProjectEditor && (
                      <div
                        className="
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-dashed
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              px-6
              py-16
              text-center
            "
                      >
                        <div
                          className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-48
                w-48
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[var(--primary-fixed)]
                opacity-50
                blur-3xl
              "
                        />

                        <div className="relative">
                          <div
                            className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--surface-container-lowest)]
                  text-[var(--primary)]
                  shadow-[var(--shadow-sm)]
                "
                          >
                            <FolderKanban size={28} />
                          </div>

                          <h3 className="mt-5 text-lg font-bold">
                            Add your first project
                          </h3>

                          <p
                            className="
                  mx-auto
                  mt-2
                  text-sm
                  leading-6
                  text-[var(--on-surface-variant)]
                "
                          >
                            Showcase projects that demonstrate what you can build and
                            the problems you can solve.
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingProjectId(null);

                              setProject({
                                ...emptyProject,
                              });

                              setShowProjectEditor(true);
                            }}
                            className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(62,74,55,0.16)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-container)]
                "
                          >
                            <Plus size={17} />
                            Add your first project
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  {/* =================================
          PROJECT EDITOR
      ================================== */}

                  {showProjectEditor && (
                    <div
                      className="
            mt-8
            overflow-hidden
            rounded-[24px]
            border
            border-[var(--primary-fixed-dim)]
            bg-[var(--surface-container-low)]
          "
                    >
                      {/* EDITOR HEADER */}

                      <div
                        className="
              border-b
              border-[var(--outline-variant)]
              bg-[var(--surface-container-lowest)]
              px-5
              py-5
              sm:px-6
            "
                      >
                        <div
                          className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
                        >
                          <div>
                            <h3
                              className="
                    text-lg
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              {editingProjectId
                                ? "Edit project"
                                : "Add new project"}
                            </h3>

                            <p
                              className="
                    mt-1
                    text-sm
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Add details about your project and the technologies used
                              to build it.
                            </p>
                          </div>

                          <div
                            className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-[var(--primary-fixed)]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[var(--primary)]
                "
                          >
                            <FolderKanban size={14} />
                            Portfolio project
                          </div>
                        </div>
                      </div>

                      {/* FORM */}

                      <form
                        onSubmit={handleProjectSubmit}
                        className="p-5 sm:p-6"
                      >
                        <div className="space-y-6">
                          {/* PROJECT DETAILS */}

                          <div>
                            <div className="mb-4">
                              <h4
                                className="
                      text-sm
                      font-bold
                      text-[var(--on-surface)]
                    "
                              >
                                Project details
                              </h4>

                              <p
                                className="
                      mt-1
                      text-xs
                      text-[var(--on-surface-variant)]
                    "
                              >
                                Tell recruiters what you created and what problem it
                                solves.
                              </p>
                            </div>

                            <FormField label="Project title">
                              <input
                                required
                                value={project.name}
                                onChange={(event) =>
                                  setProject({
                                    ...project,
                                    name: event.target.value,
                                  })
                                }
                                placeholder="e.g. Skillio — AI Career Platform"
                                className="skillio-input"
                              />
                            </FormField>

                            <div className="mt-5">
                              <FormField
                                label="Project description"
                                hint="Optional"
                              >
                                <textarea
                                  rows="6"
                                  value={project.description}
                                  onChange={(event) =>
                                    setProject({
                                      ...project,
                                      description: event.target.value,
                                    })
                                  }
                                  placeholder="Describe the problem your project solves, its important features and what you built..."
                                  className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        p-4
                        text-sm
                        leading-6
                        text-[var(--on-surface)]
                        outline-none
                        transition
                        placeholder:text-[var(--on-surface-variant)]/60
                        focus:border-[var(--primary)]
                        focus:ring-2
                        focus:ring-[var(--primary-fixed)]
                      "
                                />
                              </FormField>
                            </div>
                          </div>

                          {/* DIVIDER */}

                          <div className="border-t border-[var(--outline-variant)]" />

                          {/* TECHNOLOGIES */}

                          <div>
                            <div className="mb-4">
                              <h4
                                className="
                      text-sm
                      font-bold
                      text-[var(--on-surface)]
                    "
                              >
                                Technology stack
                              </h4>

                              <p
                                className="
                      mt-1
                      text-xs
                      text-[var(--on-surface-variant)]
                    "
                              >
                                Add the important technologies and tools used in this
                                project.
                              </p>
                            </div>

                            <FormField
                              label="Technologies & tools"
                              hint="Separate multiple technologies with commas"
                            >
                              <input
                                value={project.technologies}
                                onChange={(event) =>
                                  setProject({
                                    ...project,
                                    technologies: event.target.value,
                                  })
                                }
                                placeholder="React, Node.js, Express, MongoDB"
                                className="skillio-input"
                              />
                            </FormField>
                          </div>

                          {/* DIVIDER */}

                          <div className="border-t border-[var(--outline-variant)]" />

                          {/* PROJECT LINKS */}

                          <div>
                            <div className="mb-4">
                              <h4
                                className="
                      text-sm
                      font-bold
                      text-[var(--on-surface)]
                    "
                              >
                                Project links
                              </h4>

                              <p
                                className="
                      mt-1
                      text-xs
                      text-[var(--on-surface-variant)]
                    "
                              >
                                Add links so recruiters can explore your work.
                              </p>
                            </div>

                            <div
                              className="
                    grid
                    gap-5
                    md:grid-cols-2
                  "
                            >
                              <FormField
                                label="Live project URL"
                                hint="Optional"
                              >
                                <input
                                  type="url"
                                  value={project.projectUrl}
                                  onChange={(event) =>
                                    setProject({
                                      ...project,
                                      projectUrl: event.target.value,
                                    })
                                  }
                                  placeholder="https://yourproject.com"
                                  className="skillio-input"
                                />
                              </FormField>

                              <FormField
                                label="GitHub repository"
                                hint="Optional"
                              >
                                <input
                                  type="url"
                                  value={project.githubUrl}
                                  onChange={(event) =>
                                    setProject({
                                      ...project,
                                      githubUrl: event.target.value,
                                    })
                                  }
                                  placeholder="https://github.com/username/project"
                                  className="skillio-input"
                                />
                              </FormField>
                            </div>
                          </div>
                        </div>

                        {/* FORM FOOTER */}

                        <div
                          className="
                mt-8
                flex
                flex-col-reverse
                gap-3
                border-t
                border-[var(--outline-variant)]
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setShowProjectEditor(false);

                              setEditingProjectId(null);

                              setProject({
                                ...emptyProject,
                              });
                            }}
                            className="
                  rounded-xl
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-[var(--on-surface-variant)]
                  transition
                  hover:bg-[var(--surface-container-high)]
                "
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(62,74,55,0.18)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-container)]
                  active:translate-y-0
                "
                          >
                            <Save size={17} />

                            {editingProjectId
                              ? "Save changes"
                              : "Add project"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </section>
            )}


            {/* =================================
            EDUCATION
            ================================== */}

            {activeSection === "education" && (
              <section
                className="
      overflow-hidden
      rounded-[28px]
      border
      border-[var(--outline-variant)]
      bg-[var(--surface-container-lowest)]
      shadow-[var(--shadow-sm)]
    "
              >
                {/* =================================
        SECTION HEADER
    ================================== */}

                <div
                  className="
        border-b
        border-[var(--outline-variant)]
        bg-[var(--surface-container-low)]
        px-6
        py-6
        sm:px-8
      "
                >
                  <div
                    className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
                  >
                    {/* LEFT */}

                    <div className="flex items-start gap-4">
                      <div
                        className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-[var(--primary-fixed)]
              text-[var(--primary)]
            "
                      >
                        <GraduationCap size={25} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2
                            className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-[var(--on-surface)]
                  sm:text-2xl
                "
                          >
                            Education
                          </h2>

                          {careerProfile?.education?.length > 0 && (
                            <span
                              className="
                    rounded-full
                    bg-[var(--primary-fixed)]
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-[var(--primary)]
                  "
                            >
                              {careerProfile.education.length}{" "}
                              {careerProfile.education.length === 1
                                ? "qualification"
                                : "qualifications"}
                            </span>
                          )}
                        </div>

                        <p
                          className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-[var(--on-surface-variant)]
              "
                        >
                          Add your academic background, degrees and qualifications
                          that contribute to your professional journey.
                        </p>
                      </div>
                    </div>

                    {/* RIGHT ACTION */}

                    {!showEducationEditor ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEducationId(null);

                          setEducation({
                            ...emptyEducation,
                          });

                          setShowEducationEditor(true);
                        }}
                        className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--primary)]
                px-4
                py-3
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-[var(--primary-container)]
            "
                      >
                        <Plus size={18} />

                        Add education
                      </button>
                    ) : (
                      <div
                        className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-xl
              border
              border-[var(--primary-fixed-dim)]
              bg-[var(--primary-fixed)]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[var(--primary)]
            "
                      >
                        <Pencil size={16} />

                        {editingEducationId
                          ? "Editing education"
                          : "Adding education"}
                      </div>
                    )}
                  </div>
                </div>

                {/* =================================
        CONTENT
    ================================== */}

                <div className="p-6 sm:p-8">

                  {/* =================================
          EDUCATION OVERVIEW
      ================================== */}

                  {careerProfile?.education?.length > 0 && (
                    <div
                      className="
            mb-8
            grid
            gap-4
            sm:grid-cols-2
          "
                    >
                      {/* TOTAL EDUCATION */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              p-4
            "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--primary-fixed)]
                  text-[var(--primary)]
                "
                          >
                            <GraduationCap size={19} />
                          </div>

                          <div>
                            <p
                              className="
                    text-xs
                    font-medium
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Total qualifications
                            </p>

                            <p
                              className="
                    mt-1
                    text-xl
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              {careerProfile.education.length}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* TIP */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--primary-fixed-dim)]
              bg-[var(--primary-fixed)]/40
              p-4
            "
                      >
                        <div className="flex gap-3">
                          <Sparkles
                            size={19}
                            className="
                  mt-0.5
                  shrink-0
                  text-[var(--primary)]
                "
                          />

                          <div>
                            <p
                              className="
                    text-sm
                    font-bold
                    text-[var(--primary)]
                  "
                            >
                              Highlight your academic journey
                            </p>

                            <p
                              className="
                    mt-1
                    text-xs
                    leading-5
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Add your institution, degree and field of study.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =================================
          EDUCATION LIST
      ================================== */}

                  {careerProfile?.education?.length > 0 ? (
                    <div>
                      <div className="mb-5">
                        <h3
                          className="
                text-lg
                font-bold
                text-[var(--on-surface)]
              "
                        >
                          Your education
                        </h3>

                        <p
                          className="
                mt-1
                text-sm
                text-[var(--on-surface-variant)]
              "
                        >
                          Manage and update your academic background.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {careerProfile.education.map((item) => (
                          <div
                            key={item._id}
                            className="
                  group
                  rounded-[22px]
                  border
                  border-[var(--outline-variant)]
                  bg-[var(--surface-container-lowest)]
                  p-5
                  transition
                  hover:border-[var(--primary-fixed-dim)]
                  hover:shadow-[var(--shadow-md)]
                "
                          >
                            <div
                              className="
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                  "
                            >
                              {/* EDUCATION INFO */}

                              <div className="flex min-w-0 gap-4">
                                <div
                                  className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[var(--primary-fixed)]
                        text-[var(--primary)]
                      "
                                >
                                  <GraduationCap size={21} />
                                </div>

                                <div className="min-w-0">
                                  <h3
                                    className="
                          text-base
                          font-bold
                          text-[var(--on-surface)]
                        "
                                  >
                                    {item.institution}
                                  </h3>

                                  <p
                                    className="
                          mt-1
                          font-semibold
                          text-[var(--primary)]
                        "
                                  >
                                    {item.degree}
                                  </p>

                                  {item.fieldOfStudy && (
                                    <div
                                      className="
                            mt-3
                            inline-flex
                            items-center
                            gap-2
                            text-xs
                            text-[var(--on-surface-variant)]
                          "
                                    >
                                      <BookOpen size={14} />

                                      {item.fieldOfStudy}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* ACTIONS */}

                              <div
                                className="
                      flex
                      shrink-0
                      items-center
                      gap-2
                    "
                              >
                                {/* EDIT */}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingEducationId(item._id);

                                    setEducation({
                                      institution: item.institution || "",
                                      degree: item.degree || "",
                                      fieldOfStudy: item.fieldOfStudy || "",
                                    });

                                    setShowEducationEditor(true);
                                  }}
                                  className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        px-3.5
                        text-sm
                        font-semibold
                        text-[var(--on-surface)]
                        transition
                        hover:bg-[var(--surface-container-low)]
                      "
                                >
                                  <Pencil size={15} />

                                  Edit
                                </button>

                                {/* DELETE */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteEducation(item._id)
                                  }
                                  className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-[var(--on-surface-variant)]
                        transition
                        hover:bg-[var(--error-container)]
                        hover:text-[var(--error)]
                      "
                                  title="Delete education"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* =================================
                        EMPTY STATE
                    ================================== */

                    !showEducationEditor && (
                      <div
                        className="
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-dashed
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              px-6
              py-16
              text-center
            "
                      >
                        <div
                          className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-48
                w-48
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[var(--primary-fixed)]
                opacity-50
                blur-3xl
              "
                        />

                        <div className="relative">
                          <div
                            className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--surface-container-lowest)]
                  text-[var(--primary)]
                  shadow-[var(--shadow-sm)]
                "
                          >
                            <GraduationCap size={28} />
                          </div>

                          <h3 className="mt-5 text-lg font-bold">
                            Add your educational background
                          </h3>

                          <p
                            className="
                  mx-auto
                  mt-2
                  text-sm
                  leading-6
                  text-[var(--on-surface-variant)]
                "
                          >
                            Showcase your degrees, institutions and academic
                            qualifications that helped build your foundation.
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingEducationId(null);

                              setEducation({
                                ...emptyEducation,
                              });

                              setShowEducationEditor(true);
                            }}
                            className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(62,74,55,0.16)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-container)]
                "
                          >
                            <Plus size={17} />

                            Add your education
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  {/* =================================
          EDUCATION EDITOR
      ================================== */}

                  {showEducationEditor && (
                    <div
                      className="
            mt-8
            overflow-hidden
            rounded-[24px]
            border
            border-[var(--primary-fixed-dim)]
            bg-[var(--surface-container-low)]
          "
                    >
                      {/* EDITOR HEADER */}

                      <div
                        className="
              border-b
              border-[var(--outline-variant)]
              bg-[var(--surface-container-lowest)]
              px-5
              py-5
              sm:px-6
            "
                      >
                        <div
                          className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
                        >
                          <div>
                            <h3
                              className="
                    text-lg
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              {editingEducationId
                                ? "Edit education"
                                : "Add education"}
                            </h3>

                            <p
                              className="
                    mt-1
                    text-sm
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Add details about your institution and academic
                              qualification.
                            </p>
                          </div>

                          <div
                            className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-[var(--primary-fixed)]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[var(--primary)]
                "
                          >
                            <GraduationCap size={14} />

                            Academic background
                          </div>
                        </div>
                      </div>

                      {/* FORM */}

                      <form
                        onSubmit={handleEducationSubmit}
                        className="p-5 sm:p-6"
                      >
                        <div className="space-y-6">

                          {/* EDUCATION DETAILS */}

                          <div>
                            <div className="mb-4">
                              <h4
                                className="
                      text-sm
                      font-bold
                      text-[var(--on-surface)]
                    "
                              >
                                Education details
                              </h4>

                              <p
                                className="
                      mt-1
                      text-xs
                      text-[var(--on-surface-variant)]
                    "
                              >
                                Tell us about your academic qualification.
                              </p>
                            </div>

                            <div className="space-y-5">

                              {/* INSTITUTION */}

                              <FormField label="Institution">
                                <input
                                  required
                                  value={education.institution}
                                  onChange={(event) =>
                                    setEducation({
                                      ...education,
                                      institution: event.target.value,
                                    })
                                  }
                                  placeholder="e.g. University of Mumbai"
                                  className="skillio-input"
                                />
                              </FormField>

                              {/* DEGREE */}

                              <FormField label="Degree">
                                <input
                                  required
                                  value={education.degree}
                                  onChange={(event) =>
                                    setEducation({
                                      ...education,
                                      degree: event.target.value,
                                    })
                                  }
                                  placeholder="e.g. Master of Computer Applications"
                                  className="skillio-input"
                                />
                              </FormField>

                              {/* FIELD OF STUDY */}

                              <FormField
                                label="Field of study"
                                hint="Optional"
                              >
                                <input
                                  value={education.fieldOfStudy}
                                  onChange={(event) =>
                                    setEducation({
                                      ...education,
                                      fieldOfStudy: event.target.value,
                                    })
                                  }
                                  placeholder="e.g. Computer Applications"
                                  className="skillio-input"
                                />
                              </FormField>
                            </div>
                          </div>
                        </div>

                        {/* FORM FOOTER */}

                        <div
                          className="
                mt-8
                flex
                flex-col-reverse
                gap-3
                border-t
                border-[var(--outline-variant)]
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setShowEducationEditor(false);

                              setEditingEducationId(null);

                              setEducation({
                                ...emptyEducation,
                              });
                            }}
                            className="
                  rounded-xl
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-[var(--on-surface-variant)]
                  transition
                  hover:bg-[var(--surface-container-high)]
                "
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(62,74,55,0.18)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-container)]
                "
                          >
                            <Save size={17} />

                            {editingEducationId
                              ? "Save changes"
                              : "Add education"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </section>
            )}


            {/* =================================
            CERTIFICATIONS
            ================================== */}

            {activeSection === "certifications" && (
              <section
                className="
      overflow-hidden
      rounded-[28px]
      border
      border-[var(--outline-variant)]
      bg-[var(--surface-container-lowest)]
      shadow-[var(--shadow-sm)]
    "
              >
                {/* =================================
        SECTION HEADER
    ================================== */}

                <div
                  className="
        border-b
        border-[var(--outline-variant)]
        bg-[var(--surface-container-low)]
        px-6
        py-6
        sm:px-8
      "
                >
                  <div
                    className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
                  >
                    {/* LEFT */}

                    <div className="flex items-start gap-4">
                      <div
                        className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-[var(--secondary-fixed)]
              text-[var(--secondary)]
            "
                      >
                        <Award size={25} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2
                            className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-[var(--on-surface)]
                  sm:text-2xl
                "
                          >
                            Certifications
                          </h2>

                          {careerProfile?.certifications?.length > 0 && (
                            <span
                              className="
                    rounded-full
                    bg-[var(--secondary-fixed)]
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-[var(--secondary)]
                  "
                            >
                              {careerProfile.certifications.length}{" "}
                              {careerProfile.certifications.length === 1
                                ? "certification"
                                : "certifications"}
                            </span>
                          )}
                        </div>

                        <p
                          className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-[var(--on-surface-variant)]
              "
                        >
                          Highlight certifications and professional credentials that
                          strengthen your professional profile.
                        </p>
                      </div>
                    </div>

                    {/* RIGHT ACTION */}

                    {!showCertificationEditor ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCertificationId(null);

                          setCertification({
                            ...emptyCertification,
                          });

                          setShowCertificationEditor(true);
                        }}
                        className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--primary)]
                px-4
                py-3
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-[var(--primary-container)]
            "
                      >
                        <Plus size={18} />
                        Add certification
                      </button>
                    ) : (
                      <div
                        className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-xl
              border
              border-[var(--secondary-fixed-dim)]
              bg-[var(--secondary-fixed)]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[var(--secondary)]
            "
                      >
                        <Pencil size={16} />

                        {editingCertificationId
                          ? "Editing certification"
                          : "Adding certification"}
                      </div>
                    )}
                  </div>
                </div>

                {/* =================================
        CONTENT
    ================================== */}

                <div className="p-6 sm:p-8">

                  {/* =================================
          CERTIFICATION OVERVIEW
      ================================== */}

                  {careerProfile?.certifications?.length > 0 && (
                    <div
                      className="
            mb-8
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
                    >
                      {/* TOTAL */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              p-4
            "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--secondary-fixed)]
                  text-[var(--secondary)]
                "
                          >
                            <Award size={19} />
                          </div>

                          <div>
                            <p
                              className="
                    text-xs
                    font-medium
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Total credentials
                            </p>

                            <p
                              className="
                    mt-1
                    text-xl
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              {careerProfile.certifications.length}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* WITH LINKS */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              p-4
            "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--primary-fixed)]
                  text-[var(--primary)]
                "
                          >
                            <BadgeCheck size={19} />
                          </div>

                          <div>
                            <p
                              className="
                    text-xs
                    font-medium
                    text-[var(--on-surface-variant)]
                  "
                            >
                              With credential links
                            </p>

                            <p
                              className="
                    mt-1
                    text-xl
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              {
                                careerProfile.certifications.filter(
                                  (item) => item.credentialUrl
                                ).length
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* TIP */}

                      <div
                        className="
              rounded-2xl
              border
              border-[var(--secondary-fixed-dim)]
              bg-[var(--secondary-fixed)]/40
              p-4
            "
                      >
                        <div className="flex gap-3">
                          <Sparkles
                            size={19}
                            className="
                  mt-0.5
                  shrink-0
                  text-[var(--secondary)]
                "
                          />

                          <div>
                            <p
                              className="
                    text-sm
                    font-bold
                    text-[var(--secondary)]
                  "
                            >
                              Strengthen your profile
                            </p>

                            <p
                              className="
                    mt-1
                    text-xs
                    leading-5
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Add recognized certifications and verification links.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =================================
          CERTIFICATION LIST
      ================================== */}

                  {careerProfile?.certifications?.length > 0 ? (
                    <div>
                      <div className="mb-5">
                        <h3
                          className="
                text-lg
                font-bold
                text-[var(--on-surface)]
              "
                        >
                          Your certifications
                        </h3>

                        <p
                          className="
                mt-1
                text-sm
                text-[var(--on-surface-variant)]
              "
                        >
                          Manage the professional credentials you've earned.
                        </p>
                      </div>

                      <div
                        className="
              grid
              gap-5
              md:grid-cols-2
            "
                      >
                        {careerProfile.certifications.map((item) => (
                          <div
                            key={item._id}
                            className="
                  group
                  flex
                  flex-col
                  rounded-[22px]
                  border
                  border-[var(--outline-variant)]
                  bg-[var(--surface-container-lowest)]
                  p-5
                  transition
                  hover:border-[var(--secondary-fixed-dim)]
                  hover:shadow-[var(--shadow-md)]
                "
                          >
                            {/* TOP */}

                            <div className="flex items-start justify-between gap-4">

                              <div className="flex min-w-0 gap-4">
                                <div
                                  className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[var(--secondary-fixed)]
                        text-[var(--secondary)]
                      "
                                >
                                  <Award size={21} />
                                </div>

                                <div className="min-w-0">
                                  <h3
                                    className="
                          text-base
                          font-bold
                          text-[var(--on-surface)]
                        "
                                  >
                                    {item.name}
                                  </h3>

                                  {item.issuer && (
                                    <p
                                      className="
                            mt-1
                            text-sm
                            font-semibold
                            text-[var(--secondary)]
                          "
                                    >
                                      {item.issuer}
                                    </p>
                                  )}

                                  {item.issueDate && (
                                    <div
                                      className="
                            mt-3
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            text-[var(--on-surface-variant)]
                          "
                                    >
                                      <CalendarDays size={14} />

                                      Issued on{" "}
                                      {new Date(item.issueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* ACTIONS */}

                              <div
                                className="
                      flex
                      shrink-0
                      items-center
                      gap-1
                    "
                              >
                                {/* EDIT */}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCertificationId(item._id);

                                    setCertification({
                                      name: item.name || "",
                                      issuer: item.issuer || "",

                                      issueDate: item.issueDate
                                        ? new Date(item.issueDate)
                                          .toISOString()
                                          .split("T")[0]
                                        : "",

                                      credentialUrl:
                                        item.credentialUrl || "",
                                    });

                                    setShowCertificationEditor(true);
                                  }}
                                  className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-[var(--on-surface-variant)]
                        transition
                        hover:bg-[var(--surface-container-low)]
                        hover:text-[var(--primary)]
                      "
                                  title="Edit certification"
                                >
                                  <Pencil size={17} />
                                </button>

                                {/* DELETE */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteCertification(item._id)
                                  }
                                  className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-[var(--on-surface-variant)]
                        transition
                        hover:bg-[var(--error-container)]
                        hover:text-[var(--error)]
                      "
                                  title="Delete certification"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>
                            </div>

                            {/* CREDENTIAL LINK */}

                            {item.credentialUrl && (
                              <div
                                className="
                      mt-5
                      border-t
                      border-[var(--outline-variant)]
                      pt-5
                    "
                              >
                                <a
                                  href={item.credentialUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-[var(--primary)]
                        transition
                        hover:underline
                      "
                                >
                                  <ExternalLink size={16} />

                                  View credential
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* =================================
                        EMPTY STATE
                    ================================== */

                    !showCertificationEditor && (
                      <div
                        className="
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-dashed
              border-[var(--outline-variant)]
              bg-[var(--surface-container-low)]
              px-6
              py-16
              text-center
            "
                      >
                        <div
                          className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-48
                w-48
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[var(--secondary-fixed)]
                opacity-50
                blur-3xl
              "
                        />

                        <div className="relative">
                          <div
                            className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--surface-container-lowest)]
                  text-[var(--secondary)]
                  shadow-[var(--shadow-sm)]
                "
                          >
                            <Award size={28} />
                          </div>

                          <h3 className="mt-5 text-lg font-bold">
                            Add your first certification
                          </h3>

                          <p
                            className="
                  mx-auto
                  mt-2
                  text-sm
                  leading-6
                  text-[var(--on-surface-variant)]
                "
                          >
                            Showcase certifications and professional credentials that
                            demonstrate your knowledge and expertise.
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingCertificationId(null);

                              setCertification({
                                ...emptyCertification,
                              });

                              setShowCertificationEditor(true);
                            }}
                            className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(62,74,55,0.16)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-container)]
                "
                          >
                            <Plus size={17} />

                            Add your first certification
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  {/* =================================
          CERTIFICATION EDITOR
      ================================== */}

                  {showCertificationEditor && (
                    <div
                      className="
            mt-8
            overflow-hidden
            rounded-[24px]
            border
            border-[var(--secondary-fixed-dim)]
            bg-[var(--surface-container-low)]
          "
                    >
                      {/* EDITOR HEADER */}

                      <div
                        className="
              border-b
              border-[var(--outline-variant)]
              bg-[var(--surface-container-lowest)]
              px-5
              py-5
              sm:px-6
            "
                      >
                        <div
                          className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
                        >
                          <div>
                            <h3
                              className="
                    text-lg
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              {editingCertificationId
                                ? "Edit certification"
                                : "Add new certification"}
                            </h3>

                            <p
                              className="
                    mt-1
                    text-sm
                    text-[var(--on-surface-variant)]
                  "
                            >
                              Add your professional credential and verification details.
                            </p>
                          </div>

                          <div
                            className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-[var(--secondary-fixed)]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[var(--secondary)]
                "
                          >
                            <BadgeCheck size={14} />

                            Professional credential
                          </div>
                        </div>
                      </div>

                      {/* FORM */}

                      <form
                        onSubmit={handleCertificationSubmit}
                        className="p-5 sm:p-6"
                      >
                        <div className="space-y-6">

                          {/* CERTIFICATION DETAILS */}

                          <div>
                            <div className="mb-4">
                              <h4
                                className="
                      text-sm
                      font-bold
                      text-[var(--on-surface)]
                    "
                              >
                                Credential details
                              </h4>

                              <p
                                className="
                      mt-1
                      text-xs
                      text-[var(--on-surface-variant)]
                    "
                              >
                                Information about your certification.
                              </p>
                            </div>

                            <div className="space-y-5">
                              <FormField label="Certification name">
                                <input
                                  required
                                  value={certification.name}
                                  onChange={(event) =>
                                    setCertification({
                                      ...certification,
                                      name: event.target.value,
                                    })
                                  }
                                  placeholder="e.g. AWS Certified Cloud Practitioner"
                                  className="skillio-input"
                                />
                              </FormField>

                              <FormField
                                label="Issuing organization"
                                hint="Optional"
                              >
                                <input
                                  value={certification.issuer}
                                  onChange={(event) =>
                                    setCertification({
                                      ...certification,
                                      issuer: event.target.value,
                                    })
                                  }
                                  placeholder="e.g. Amazon Web Services"
                                  className="skillio-input"
                                />
                              </FormField>
                            </div>
                          </div>

                          {/* DIVIDER */}

                          <div className="border-t border-[var(--outline-variant)]" />

                          {/* VERIFICATION DETAILS */}

                          <div>
                            <div className="mb-4">
                              <h4
                                className="
                      text-sm
                      font-bold
                      text-[var(--on-surface)]
                    "
                              >
                                Verification details
                              </h4>

                              <p
                                className="
                      mt-1
                      text-xs
                      text-[var(--on-surface-variant)]
                    "
                              >
                                Add the issue date and credential link if available.
                              </p>
                            </div>

                            <div
                              className="
                    grid
                    gap-5
                    md:grid-cols-2
                  "
                            >
                              <FormField
                                label="Issue date"
                                hint="Optional"
                              >
                                <input
                                  type="date"
                                  value={certification.issueDate}
                                  onChange={(event) =>
                                    setCertification({
                                      ...certification,
                                      issueDate: event.target.value,
                                    })
                                  }
                                  className="skillio-input"
                                />
                              </FormField>

                              <FormField
                                label="Credential URL"
                                hint="Optional"
                              >
                                <input
                                  type="url"
                                  value={certification.credentialUrl}
                                  onChange={(event) =>
                                    setCertification({
                                      ...certification,
                                      credentialUrl: event.target.value,
                                    })
                                  }
                                  placeholder="https://credential-link.com"
                                  className="skillio-input"
                                />
                              </FormField>
                            </div>
                          </div>
                        </div>

                        {/* FORM FOOTER */}

                        <div
                          className="
                mt-8
                flex
                flex-col-reverse
                gap-3
                border-t
                border-[var(--outline-variant)]
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setShowCertificationEditor(false);

                              setEditingCertificationId(null);

                              setCertification({
                                ...emptyCertification,
                              });
                            }}
                            className="
                  rounded-xl
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-[var(--on-surface-variant)]
                  transition
                  hover:bg-[var(--surface-container-high)]
                "
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(62,74,55,0.18)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-container)]
                  active:translate-y-0
                "
                          >
                            <Save size={17} />

                            {editingCertificationId
                              ? "Save changes"
                              : "Add certification"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </section>
            )}


            {/* ============================================================
    RESUME IMPORT MODAL
============================================================ */}

            {showResumeImportModal && (
              <div
                className="
      fixed
      inset-0
      z-[100]
      flex
      items-center
      justify-center
      bg-black/40
      p-4
      backdrop-blur-sm
    "
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    handleCloseResumeImport();
                  }
                }}
              >

                <div
                  className="
        w-full
        max-w-xl
        overflow-hidden
        rounded-[28px]
        border
        border-[var(--outline-variant)]
        bg-[var(--surface-container-lowest)]
        shadow-[var(--shadow-lg)]
      "
                >

                  {/* ==================================================
          HEADER
      ================================================== */}

                  <div
                    className="
          border-b
          border-[var(--outline-variant)]
          bg-[var(--surface-container-low)]
          px-6
          py-6
          sm:px-7
        "
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-4">

                        <div
                          className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[var(--primary-fixed)]
                text-[var(--primary)]
              "
                        >
                          {resumeImportStep === "select" ? (
                            <Upload size={22} />
                          ) : (
                            <FileCheck2 size={22} />
                          )}
                        </div>

                        <div>

                          <h2
                            className="
                  font-[var(--font-heading)]
                  text-xl
                  font-bold
                  tracking-tight
                  text-[var(--on-surface)]
                "
                          >
                            {resumeImportStep === "select"
                              ? "Import from a resume"
                              : "Ready to import?"
                            }
                          </h2>

                          <p
                            className="
                  mt-1
                  text-sm
                  leading-6
                  text-[var(--on-surface-variant)]
                "
                          >
                            {resumeImportStep === "select"
                              ? "Choose one of your AI-parsed resumes to build your Career Profile."
                              : "Review your selection before replacing your Career Profile."
                            }
                          </p>

                        </div>

                      </div>


                      <button
                        type="button"
                        onClick={handleCloseResumeImport}
                        disabled={isImporting}
                        className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-[var(--on-surface-variant)]
              transition
              hover:bg-[var(--surface-container-high)]
              hover:text-[var(--on-surface)]
              disabled:opacity-50
            "
                      >
                        <X size={18} />
                      </button>

                    </div>

                  </div>


                  {/* ==================================================
          BODY
      ================================================== */}

                  <div className="p-6 sm:p-7">

                    {resumeImportStep === "select" ? (

                      <>

                        {/* INFO */}

                        <div
                          className="
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-[var(--primary-fixed-dim)]
                bg-[var(--primary-fixed)]/40
                p-4
              "
                        >

                          <Sparkles
                            size={18}
                            className="
                  mt-0.5
                  shrink-0
                  text-[var(--primary)]
                "
                          />

                          <p
                            className="
                  text-sm
                  leading-6
                  text-[var(--on-surface-variant)]
                "
                          >
                            Skillio will use the information already
                            extracted from the selected resume.
                          </p>

                        </div>


                        {/* RESUME LIST */}

                        <div className="mt-6">

                          <div
                            className="
                  mb-3
                  flex
                  items-center
                  justify-between
                "
                          >

                            <label
                              className="
                    text-sm
                    font-bold
                    text-[var(--on-surface)]
                  "
                            >
                              Select a resume
                            </label>

                            <span
                              className="
                    text-xs
                    font-medium
                    text-[var(--on-surface-variant)]
                  "
                            >
                              {availableResumes.length} available
                            </span>

                          </div>


                          {isLoadingResumes ? (

                            <div
                              className="
                    flex
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-low)]
                    px-5
                    py-12
                  "
                            >

                              <div className="text-center">

                                <Loader2
                                  size={25}
                                  className="
                        mx-auto
                        animate-spin
                        text-[var(--primary)]
                      "
                                />

                                <p
                                  className="
                        mt-3
                        text-sm
                        font-semibold
                        text-[var(--on-surface)]
                      "
                                >
                                  Loading your resumes...
                                </p>

                              </div>

                            </div>

                          ) : availableResumes.length === 0 ? (

                            <div
                              className="
                    rounded-2xl
                    border
                    border-dashed
                    border-[var(--outline)]
                    bg-[var(--surface-container-low)]
                    px-5
                    py-10
                    text-center
                  "
                            >

                              <div
                                className="
                      mx-auto
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[var(--surface-container-high)]
                      text-[var(--on-surface-variant)]
                    "
                              >
                                <FileText size={22} />
                              </div>

                              <h3
                                className="
                      mt-4
                      text-sm
                      font-bold
                      text-[var(--on-surface)]
                    "
                              >
                                No parsed resumes available
                              </h3>

                              <p
                                className="
                      mx-auto
                      mt-1
                      max-w-sm
                      text-xs
                      leading-5
                      text-[var(--on-surface-variant)]
                    "
                              >
                                Upload and parse a resume first,
                                then you can import it into your
                                Career Profile.
                              </p>

                            </div>

                          ) : (

                            <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">

                              {availableResumes.map((resume) => {

                                const isSelected =
                                  selectedResumeId === resume._id;

                                const parsedData =
                                  resume?.parsedData || {};

                                const displayName =
                                  parsedData.name ||
                                  resume.fileName ||
                                  "Untitled Resume";

                                const headline =
                                  parsedData.headline ||
                                  "Professional resume";

                                return (
                                  <button
                                    key={resume._id}
                                    type="button"
                                    onClick={() =>
                                      setSelectedResumeId(
                                        resume._id
                                      )
                                    }
                                    className={`
                          flex
                          w-full
                          items-start
                          gap-4
                          rounded-2xl
                          border
                          p-4
                          text-left
                          transition-all
                          duration-200
                          ${isSelected
                                        ? `
                                border-[var(--primary)]
                                bg-[var(--primary-fixed)]
                                shadow-[var(--shadow-sm)]
                              `
                                        : `
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-lowest)]
                                hover:border-[var(--primary-fixed-dim)]
                                hover:bg-[var(--surface-container-low)]
                              `
                                      }
                        `}
                                  >

                                    {/* RADIO */}

                                    <div
                                      className={`
                            mt-0.5
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            ${isSelected
                                          ? `
                                  border-[var(--primary)]
                                  bg-[var(--primary)]
                                `
                                          : `
                                  border-[var(--outline)]
                                `
                                        }
                          `}
                                    >
                                      {isSelected && (
                                        <div
                                          className="
                                h-2
                                w-2
                                rounded-full
                                bg-white
                              "
                                        />
                                      )}
                                    </div>


                                    {/* ICON */}

                                    <div
                                      className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[var(--primary-fixed)]
                            text-[var(--primary)]
                          "
                                    >
                                      <FileText size={19} />
                                    </div>


                                    {/* CONTENT */}

                                    <div className="min-w-0 flex-1">

                                      <div
                                        className="
                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                                      >

                                        <p
                                          className="
                                break-words
                                text-sm
                                font-bold
                                text-[var(--on-surface)]
                              "
                                        >
                                          {displayName}
                                        </p>

                                        {resume.isPrimary && (
                                          <span
                                            className="
                                  rounded-full
                                  bg-[var(--primary)]
                                  px-2
                                  py-0.5
                                  text-[10px]
                                  font-bold
                                  text-white
                                "
                                          >
                                            Primary
                                          </span>
                                        )}

                                      </div>

                                      <p
                                        className="
                              mt-1
                              line-clamp-1
                              text-xs
                              text-[var(--on-surface-variant)]
                            "
                                      >
                                        {headline}
                                      </p>

                                      <div
                                        className="
                              mt-2
                              flex
                              flex-wrap
                              gap-2
                              text-[10px]
                              font-semibold
                              text-[var(--on-surface-variant)]
                            "
                                      >

                                        <span>
                                          {parsedData.skills?.length || 0} skills
                                        </span>

                                        <span>•</span>

                                        <span>
                                          {parsedData.experience?.length || 0} experience
                                        </span>

                                        <span>•</span>

                                        <span>
                                          {parsedData.projects?.length || 0} projects
                                        </span>

                                      </div>

                                    </div>

                                  </button>
                                );
                              })}

                            </div>

                          )}

                        </div>

                      </>

                    ) : (

                      /* ==================================================
                         CONFIRM STEP
                      ================================================== */

                      <div>

                        {(() => {

                          const selectedResume =
                            availableResumes.find(
                              (resume) =>
                                resume._id === selectedResumeId
                            );

                          if (!selectedResume) {
                            return null;
                          }

                          const parsedData =
                            selectedResume.parsedData || {};

                          const displayName =
                            parsedData.name ||
                            selectedResume.fileName ||
                            "Selected resume";

                          return (
                            <>

                              {/* WARNING */}

                              <div
                                className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      border
                      border-[var(--error)]/40
                      bg-[var(--error-container)]
                      p-4
                    "
                              >

                                <AlertTriangle
                                  size={19}
                                  className="
                        mt-0.5
                        shrink-0
                        text-[var(--error)]
                      "
                                />

                                <div>

                                  <p
                                    className="
                          text-sm
                          font-bold
                          text-[var(--on-error-container)]
                        "
                                  >
                                    This will replace your current profile
                                  </p>

                                  <p
                                    className="
                          mt-1
                          text-xs
                          leading-5
                          text-[var(--on-error-container)]
                        "
                                  >
                                    Your existing headline, summary,
                                    skills, experience, projects,
                                    education and certifications will
                                    be replaced with the information
                                    from this resume.
                                  </p>

                                </div>

                              </div>


                              {/* SELECTED RESUME */}

                              <div
                                className="
                      mt-5
                      rounded-2xl
                      border
                      border-[var(--primary-fixed-dim)]
                      bg-[var(--primary-fixed)]/50
                      p-5
                    "
                              >

                                <div className="flex items-center gap-4">

                                  <div
                                    className="
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          bg-[var(--primary-fixed)]
                          text-[var(--primary)]
                        "
                                  >
                                    <FileCheck2 size={22} />
                                  </div>

                                  <div className="min-w-0">

                                    <p
                                      className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-[var(--primary)]
                          "
                                    >
                                      Selected resume
                                    </p>

                                    <h3
                                      className="
                            mt-1
                            break-words
                            text-base
                            font-bold
                            text-[var(--on-surface)]
                          "
                                    >
                                      {displayName}
                                    </h3>

                                    <p
                                      className="
                            mt-1
                            text-xs
                            text-[var(--on-surface-variant)]
                          "
                                    >
                                      AI-parsed professional information
                                    </p>

                                  </div>

                                </div>

                              </div>

                            </>
                          );

                        })()}

                      </div>

                    )}

                  </div>


                  {/* ==================================================
          FOOTER
      ================================================== */}

                  <div
                    className="
          flex
          flex-col-reverse
          gap-3
          border-t
          border-[var(--outline-variant)]
          bg-[var(--surface-container-low)]
          px-6
          py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-7
        "
                  >

                    {resumeImportStep === "select" ? (

                      <>

                        <button
                          type="button"
                          onClick={handleCloseResumeImport}
                          disabled={isImporting}
                          className="
                rounded-xl
                px-5
                py-2.5
                text-sm
                font-semibold
                text-[var(--on-surface-variant)]
                transition
                hover:bg-[var(--surface-container-high)]
                disabled:opacity-50
              "
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={handleContinueResumeImport}
                          disabled={
                            !selectedResumeId ||
                            isLoadingResumes ||
                            availableResumes.length === 0
                          }
                          className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--primary)]
                px-6
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-[var(--shadow-sm)]
                transition
                hover:-translate-y-0.5
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
                        >
                          Continue
                          <ChevronRight size={16} />
                        </button>

                      </>

                    ) : (

                      <>

                        <button
                          type="button"
                          onClick={() =>
                            setResumeImportStep("select")
                          }
                          disabled={isImporting}
                          className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                px-5
                py-2.5
                text-sm
                font-semibold
                text-[var(--on-surface-variant)]
                transition
                hover:bg-[var(--surface-container-high)]
                disabled:opacity-50
              "
                        >
                          <ArrowLeft size={16} />
                          Choose another
                        </button>


                        <button
                          type="button"
                          onClick={handleConfirmResumeImport}
                          disabled={isImporting}
                          className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--primary)]
                px-6
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-[var(--shadow-sm)]
                transition
                hover:-translate-y-0.5
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
                        >

                          {isImporting ? (
                            <>
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                              Importing...
                            </>
                          ) : (
                            <>
                              <FileCheck2 size={16} />
                              Replace & Import
                            </>
                          )}

                        </button>

                      </>

                    )}

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>

  );

};




/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
  label,
  hint,
  required,
  children,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-4">
        <label className="text-sm font-semibold text-[var(--on-surface)]">
          {label}

          {required && (
            <span className="ml-1 text-[var(--secondary)]">
              *
            </span>
          )}
        </label>

        {hint && (
          <span className="text-xs text-[var(--on-surface-variant)]">
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  );
};



const Github = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
    </svg>
  );
}


export default CareerProfile;