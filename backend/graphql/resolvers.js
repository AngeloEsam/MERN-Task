const bcrypt = require("bcryptjs");
const fs = require("fs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { GraphQLUpload } = require("graphql-upload");
const path = require("path");

dotenv.config();
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    getProfile: async (_, __, { req }) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new Error("❌ Authentication required");
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return await User.findById(decoded.userId);
    },
  },

  Mutation: {
    register: async (_, { email, password, profilePicture }) => {

      if (!profilePicture)
        throw new Error(
          "No profile picture provided. Please upload a profile picture."
        );

      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error(" User already exists");

        let imageUrl = null;
        if (profilePicture) {
          const file = await profilePicture;
          const { createReadStream, filename } = file;

          if (typeof createReadStream !== "function") {
            throw new Error("❌ createReadStream is not a function");
          }

          const uploadDir = path.join(process.cwd(), "uploads");
          const filePath = path.join(
            uploadDir,
            Date.now() + path.extname(filename)
          );
          const stream = createReadStream();
          const buffer = await new Promise((resolve, reject) => {
            const chunks = [];
            stream.on("data", (chunk) => chunks.push(chunk));
            stream.on("end", () => resolve(Buffer.concat(chunks)));
            stream.on("error", reject);
          });

          await fs.promises.writeFile(filePath, buffer);
          imageUrl = `/uploads/${path.basename(filePath)}`;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          email,
          password: hashedPassword,
          profilePicture: imageUrl,
        });
        await newUser.save();

        const token = jwt.sign({ userId: newUser.id }, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });

        return { ...newUser._doc, id: newUser._id, token };
      } catch (error) {
        console.error("❌ Error:", error.message);
        throw new Error("Error: " + error.message);
      }
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("❌ user not found");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("❌ password not correct");

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      return { userId: user.id, token };
    },
  },
};

module.exports = resolvers;
