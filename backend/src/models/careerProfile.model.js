import mongoose from "mongoose";

/**
 * @Name : CareerProfile
 * @param : userId, headline, summary, skills, experiences, projects, education, certifications
 * @description :
 * Mongoose schema representing a user's professional career profile.
 * Stores structured career information that can be reused for job matching,
 * resume optimization, preparation planning, and AI-powered career assistance.
 */

const experienceSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true,
        },

        position: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            trim: true,
            default: "",
        },

        startDate: {
            type: Date,
            default: null,
        },

        endDate: {
            type: Date,
            default: null,
        },

        isCurrent: {
            type: Boolean,
            default: false,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 3000,
            default: "",
        },

        technologies: [
            {
                type: String,
                trim: true,
            },
        ],
    }
)

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: "",
        },

        technologies: [
            {
                type: String,
                trim: true,
            },
        ],

        projectUrl: {
            type: String,
            trim: true,
            default: "",
        },

        githubUrl: {
            type: String,
            trim: true,
            default: "",
        },
    }
)

const educationSchema = new mongoose.Schema(
    {
        institution: {
            type: String,
            required: true,
            trim: true,
        },

        degree: {
            type: String,
            trim: true,
            default: "",
        },

        fieldOfStudy: {
            type: String,
            trim: true,
            default: "",
        },

        startDate: {
            type: Date,
            default: null,
        },

        endDate: {
            type: Date,
            default: null,
        },
    }
)

const certificationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        issuer: {
            type: String,
            trim: true,
            default: "",
        },

        issueDate: {
            type: Date,
            default: null,
        },

        credentialUrl: {
            type: String,
            trim: true,
            default: "",
        },
    }
)

const careerProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },

        headline: {
            type: String,
            trim: true,
            maxlength: 150,
            default: "",
        },

        summary: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: "",
        },

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        experiences: [experienceSchema],

        projects: [projectSchema],

        education: [educationSchema],

        certifications: [certificationSchema],
    },
    {
        timestamps: true,
    }
);

const CareerProfile = mongoose.model("CareerProfile", careerProfileSchema);

export default CareerProfile;