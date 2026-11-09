
import mongoose from "mongoose";
import { createHash } from "crypto";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI;

const toObjectId = (value) => {
    if (value instanceof mongoose.Types.ObjectId) {
        return value;
    }

    if (mongoose.Types.ObjectId.isValid(value)) {
        return new mongoose.Types.ObjectId(value);
    }

    return null;
};

// Generate a repeatable ID if an old embedded comment has no _id.
const generateStableId = (postId, index, comment) => {
    const hash = createHash("sha256")
        .update(`${postId}:${index}:${comment.userId}:${comment.text}`)
        .digest("hex")
        .slice(0, 24);

    return new mongoose.Types.ObjectId(hash);
};

const migratePostComments = async () => {
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is missing from environment variables.");
    }

    const APPLY = process.argv.includes("--apply");

    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully.");

        const db = mongoose.connection.db;

        const postsCollection = db.collection("posts");
        const commentsCollection = db.collection("comments");

        const totalPosts = await postsCollection.countDocuments();

        console.log(`Total posts found: ${totalPosts}`);

        const cursor = postsCollection.find({
            comments: { $exists: true, $type: "array" },
        });

        let migratedPosts = 0;
        let migratedComments = 0;
        let skippedPosts = 0;

        for await (const post of cursor) {
            const oldComments = post.comments || [];

            const commentsToMigrate = [];

            let invalidPost = false;

            for (let i = 0; i < oldComments.length; i++) {
                const oldComment = oldComments[i];

                const userId = toObjectId(oldComment.userId);

                if (!userId || !oldComment.username || !oldComment.text?.trim()) {
                    console.error(
                        `Invalid comment found in post ${post._id}. Skipping this post.`
                    );

                    invalidPost = true;
                    break;
                }

                const commentId = toObjectId(oldComment._id)
                    || generateStableId(post._id, i, oldComment);

                const createdAt =
                    oldComment.createdAt || post.createdAt || new Date();

                const newComment = {
                    _id: commentId,
                    postId: post._id,
                    userId,
                    username: oldComment.username,
                    userImage: oldComment.userImage || "",
                    text: oldComment.text.trim(),

                    // All old comments are original comments.
                    parentComment: null,

                    replyToUserId: null,
                    replyToUsername: "",

                    likes: [],
                    likesCount: 0,
                    repliesCount: 0,

                    status: "active",

                    createdAt,
                    updatedAt: oldComment.updatedAt || createdAt,
                };

                commentsToMigrate.push(newComment);
            }

            if (invalidPost) {
                skippedPosts++;
                continue;
            }

            if (!APPLY) {
                migratedPosts++;
                migratedComments += commentsToMigrate.length;

                console.log(
                    `[DRY RUN] Post ${post._id}: ${commentsToMigrate.length} comments`
                );

                continue;
            }

            // Upsert using the original comment ID prevents duplicates.
            if (commentsToMigrate.length > 0) {
                const operations = commentsToMigrate.map((comment) => ({
                    updateOne: {
                        filter: { _id: comment._id },
                        update: {
                            $setOnInsert: comment,
                        },
                        upsert: true,
                    },
                }));

                await commentsCollection.bulkWrite(operations, {
                    ordered: true,
                });
            }

            // Update Post only after its comments have been migrated.
            const updateFields = {
                userImage: post.userImage ?? "",
                visibility: post.visibility ?? "public",
                likesCount: Array.isArray(post.likes)
                    ? post.likes.length
                    : 0,
                status: post.status ?? "active",
                isEdited: post.isEdited ?? false,
                editedAt: post.editedAt ?? null,
            };

            // Update commentsCount only when the old comments array exists.
            updateFields.commentsCount = oldComments.length;

            await postsCollection.updateOne(
                { _id: post._id },
                {
                    $set: updateFields,
                    $unset: { comments: "" },
                }
            );

            migratedPosts++;
            migratedComments += commentsToMigrate.length;

            console.log(
                `Migrated Post ${post._id} (${commentsToMigrate.length} comments)`
            );
        }

        if (APPLY) {
            await commentsCollection.createIndex({
                postId: 1,
                parentComment: 1,
                createdAt: 1,
            });

            await commentsCollection.createIndex({
                userId: 1,
                createdAt: -1,
            });
        }

        console.log("\n========== MIGRATION SUMMARY ==========");
        console.log(`Posts processed: ${migratedPosts}`);
        console.log(`Comments processed: ${migratedComments}`);
        console.log(`Posts skipped: ${skippedPosts}`);

        if (!APPLY) {
            console.log("\nDRY RUN MODE");
            console.log("No database changes were made.");
            console.log("Review the output and run with --apply.");
        } else {
            console.log("\nMIGRATION COMPLETED SUCCESSFULLY.");
        }

    } catch (error) {
        console.error("Migration failed:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB connection closed.");
    }
};

migratePostComments();
