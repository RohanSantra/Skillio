import mongoose from "mongoose";

/**
 * @Name : Resume
 *
 * @param : userId, fileName, fileUrl, fileType, fileSize,
 * extractedText, parsedData, isPrimary
 *
 * @description :
 * Mongoose schema representing a user's uploaded resume.
 *
 * Stores the original resume file information, extracted text,
 * and structured resume data.
 *
 * Job-specific ATS analysis is handled through JobWorkspace
 * because the same resume can be analyzed against multiple jobs.
 */


const experienceSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            default: "",
        },

        position: {
            type: String,
            default: "",
        },

        startDate: {
            type: String,
            default: "",
        },

        endDate: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },
    },
    {
        _id: false,
    }
)

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },

        technologies: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    {
        _id: false,
    }
)

const educationSchema = new mongoose.Schema(
    {
        institution: {
            type: String,
            default: "",
        },

        degree: {
            type: String,
            default: "",
        },

        fieldOfStudy: {
            type: String,
            default: "",
        },

        startDate: {
            type: String,
            default: "",
        },

        endDate: {
            type: String,
            default: "",
        },
    },
    {
        _id: false,
    }
)

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        fileName: {
            type: String,
            required: true,
            trim: true,
        },

        fileUrl: {
            type: String,
            required: true,
        },

        cloudinaryPublicId: {
            type: String,
            default: "",
        },

        fileType: {
            type: String,
            required: true,
            enum: ["pdf", "doc", "docx"],
        },

        fileSize: {
            type: Number,
            required: true,
        },

        extractedText: {
            type: String,
            default: "",
        },

        parsedData: {
            name: {
                type: String,
                default: "",
            },

            email: {
                type: String,
                default: "",
            },

            phone: {
                type: String,
                default: "",
            },

            headline: {
                type: String,
                default: "",
            },

            summary: {
                type: String,
                default: "",
            },

            skills: [
                {
                    type: String,
                    trim: true,
                },
            ],

            experience: [experienceSchema],

            projects: [projectSchema],

            education: [educationSchema],

            certifications: [
                {
                    type: String,
                    trim: true,
                },
            ],
        },

        isPrimary: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

resumeSchema.index({
    userId: 1,
    isPrimary: 1,
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
