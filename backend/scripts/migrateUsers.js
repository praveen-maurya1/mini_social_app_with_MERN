
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const migrateUsers = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully.");

        const usersCollection = mongoose.connection.collection("users");

        const totalUsers = await usersCollection.countDocuments();

        console.log(`Total users found: ${totalUsers}`);

        // Preserve existing data and add only missing fields.
        const migrationPipeline = [
            {
                $set: {
                    displayName: {
                        $ifNull: ["$displayName", "$username"]
                    },

                    firstName: {
                        $ifNull: ["$firstName", ""]
                    },

                    lastName: {
                        $ifNull: ["$lastName", ""]
                    },

                    image: {
                        $ifNull: ["$image", ""]
                    },

                    bio: {
                        $ifNull: ["$bio", ""]
                    },

                    location: {
                        $ifNull: ["$location", ""]
                    },

                    dateOfBirth: {
                        $ifNull: ["$dateOfBirth", null]
                    },

                    verified: {
                        $ifNull: ["$verified", false]
                    },
                    isPlatformVerified: {
                        $ifNull: ["$isPlatformVerified", false]
                    },

                    emailVerifiedAt: {
                        $ifNull: ["$emailVerifiedAt", null]
                    },

                    status: {
                        $ifNull: ["$status", "active"]
                    },

                    isOnline: {
                        $ifNull: ["$isOnline", false]
                    },

                    lastSeen: {
                        $ifNull: ["$lastSeen", null]
                    },

                    // Preserve existing preferences.
                    preferences: {
                        $mergeObjects: [
                            {
                                $ifNull: ["$preferences", {}]
                            },
                            {
                                theme: {
                                    $ifNull: [
                                        "$preferences.theme",
                                        "system"
                                    ]
                                },

                                notifications: {
                                    $mergeObjects: [
                                        {
                                            $ifNull: [
                                                "$preferences.notifications",
                                                {}
                                            ]
                                        },
                                        {
                                            likes: {
                                                $ifNull: [
                                                    "$preferences.notifications.likes",
                                                    true
                                                ]
                                            },

                                            comments: {
                                                $ifNull: [
                                                    "$preferences.notifications.comments",
                                                    true
                                                ]
                                            },

                                            followers: {
                                                $ifNull: [
                                                    "$preferences.notifications.followers",
                                                    true
                                                ]
                                            },

                                            messages: {
                                                $ifNull: [
                                                    "$preferences.notifications.messages",
                                                    true
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        ];

        // DRY RUN: No database changes without --apply.
        if (!process.argv.includes("--apply")) {
            console.log("\nDRY RUN MODE");
            console.log("No database changes were made.");
            console.log("Review the migration and run with --apply to execute it.");
            return;
        }

        // Actual migration
        const result = await usersCollection.updateMany(
            {},
            migrationPipeline
        );

        console.log("\nUSER MIGRATION COMPLETED");
        console.log("--------------------------------");
        console.log("Matched documents:", result.matchedCount);
        console.log("Modified documents:", result.modifiedCount);
        console.log("Migration acknowledged:", result.acknowledged);
        console.log("--------------------------------");

    } catch (error) {
        console.error("\nUSER MIGRATION FAILED:");
        console.error(error);

        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log("\nMongoDB connection closed.");
    }
};

migrateUsers();
