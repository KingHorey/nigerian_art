import { Strategy } from "passport-local";
import passport from "passport";
import { UserModel } from "../../schema/schema";
import { compare } from "bcrypt";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    await UserModel.findById(id, (err: any, user: any) => {
      if (err) {
        done(err, null);
      } else done(null, user);
    });
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        compare(user.password, password, async (err: any, result) => {
          if (err) {
            done(err, false);
          } else {
            return done(null, user);
          }
        });
      } else {
        return done(null, false, { message: "No user found with this email" });
      }
    } catch (err) {
      done(err, false);
    }
  })
);
