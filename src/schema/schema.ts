import { randomUUID } from "crypto";
import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => randomUUID(),
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const artistSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, default: () => randomUUID() },
    name: { type: String, required: true },
    description: {
      type: String,
      required: true,
      length: 5000,
      validate: {
        validator: (v: string) => {
          return v.length <= 5000;
        },
      },
    },
    username: { type: String, required: true },
    image: { type: String },
    instaLink: { type: String },
    websiteUrl: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Categories" },
  },
  { timestamps: true }
);

const artWorkSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, default: () => randomUUID() },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: [{ type: String, required: true }],
    artistId: { type: Schema.Types.ObjectId, ref: "Artist" },
    likes: { type: Number, default: 0 },
    featured: {type: Boolean, default: false},
    comments: [
      {
        name: { type: String, required: true },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: "Categories" },
  },
  { timestamps: true }
);

const categoriesSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

categoriesSchema.virtual("artworks", {
  ref: "ArtWork", // The model to populate
  localField: "id", // The field in the Categories model that holds the category's ID
  foreignField: "category", // The field in the ArtWork model that holds the category's ID
});

categoriesSchema.set("toJSON", { virtuals: true });
categoriesSchema.set("toObject", { virtuals: true });

artistSchema.virtual("artworks", {
  ref: "ArtWork", // The model to populate
  localField: "id", // The field in the Artist model that holds the artist's ID
  foreignField: "artistId", // The field in the ArtWork model that holds the artist's ID
});

artistSchema.set("toJSON", { virtuals: true });
artistSchema.set("toObject", { virtuals: true });

categoriesSchema.index({ name: 1 }, { unique: true });
artistSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

export const UserModel = mongoose.model("User", userSchema);
export const ArtistModel = mongoose.model("Artist", artistSchema);
export const CategoriesModel = mongoose.model("Categories", categoriesSchema);
export const ArtWorkModel = mongoose.model("ArtWork", artWorkSchema);

// module.exports = { Categories, Artist, User } as {
//   Categories: typeof Categories;
//   Artist: typeof Artist;
//   User: typeof User;
// };
