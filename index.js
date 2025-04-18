import express from "express";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session"

const app=express();
const port=3000;

// salt round for bcrypt
const saltRounds = 10;
// enviroment variables
env.config();

// set up express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// static files location
app.use(express.static("public"));  

// body parser which comes pre bundled with express
app.use(express.urlencoded({extended: true})); 

// passport initialize
app.use(passport.initialize());
app.use(passport.session());

// database connection
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();


// default route
app.get("/", (req, res) => {
    res.render("signin.ejs");
});

// render posts page 
app.get("/posts", async (req,res) => {
    if(req.isAuthenticated()){
    try{
        const res_posts = await db.query("select posts.id, blog_title, blog_content, email from posts join users on posts.user_id = users.id order by id asc")
        const posts = res_posts.rows;
        res.render("posts.ejs", {posts:posts});
    }
    catch(err)
    {
        console.log(err);
    }
}
    else
    {
        res.redirect("/");
    }
});

// edit posts
app.get("/edit", (req,res) => {
    if(req.isAuthenticated()){
    res.render("editform.ejs");
    }
    else
    {
        res.redirect("/");
    }

});


// render blog submission page
app.get("/index", (req, res) => {
    if(req.isAuthenticated())
    {
        res.render("index.ejs");
    }
    else
    {
        res.redirect("/");
    }
});

// render signin page
app.get("/signin", (req, res) => {
    res.render("signin.ejs")
});

// render signup page
app.get("/signup", (req, res) => {
    res.render("signup.ejs")
});

// handle signout
app.get("/signout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

  // google Oauth
  app.get("/auth/google",
    passport.authenticate("google", {
      scope: ["profile","email"]
    })
  );
  
  // google Oauth redirect
  app.get("/auth/google/posts",
    passport.authenticate("google", {
      failureRedirect: "/signin",
      successRedirect: "/posts"
    })
  );
  

// handle signin
app.post("/signin", passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/signin",
  })
);

// handle signup
app.post("/signup", async (req, res) => {
    const email = req.body["email"];
    const password = req.body["password"];
    try
    {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (checkResult.rows.length > 0) 
            {
                res.redirect("/");
            }
            else
            {
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if (err) 
                        {
                            console.error("Error hashing password:", err);
                        }
                    else 
                    {
                        const result = await db.query("INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",[email, hash]);
                        const user = result.rows[0];
                        console.log("manual signiup",user);
                        req.login(user, (err) => {
                        console.log("success logging in");
                        res.redirect("/posts");
                        });
                    }
                })
            }
        }
        catch(err)
        {
            console.log(err);
        }


});

// create post
app.post("/create", async (req, res) => {
    try{
        console.log(req.user);
        const user_id = req.user.id;
        const title = req.body["title"];
        const cont = req.body["content"];

        await db.query("insert into posts (user_id, blog_title, blog_content) values ($1,$2,$3)", [user_id,title,cont]);
        res.redirect("/posts");
    }
    catch(err)
    {
        console.log(err);
    }
});



// selecting to edit or delete post
app.post("/edited", async (req,res) => {
    try{
    const post_id = req.body["id"]
    if(req.body["option"]==="edit")
    {
        if(post_id)
        {
            const result = await db.query("select id, blog_title,blog_content from posts where id=$1", [post_id]);
            const post_info = result.rows[0];
            const p_id = post_info.id;
            const p_title = post_info.blog_title;
            const p_content = post_info.blog_content;
            
            res.render("editform.ejs", {id:p_id,title:p_title,content:p_content});
            return;
        }
    }
    if(req.body["option"]==="delete")
    {
        await db.query("delete from posts where id=$1",[post_id]);
        res.redirect("/posts");
        return;
    }}
    catch(err)
    {
        console.log(err);
    }
});


// modifying content in chosen post
app.post("/editdone", async (req, res) => {
    const p_id = req.body["id"];
    const new_title = req.body["editedtitle"];
    const new_content = req.body["editedcontent"];
    await db.query("update posts set blog_title=$1,blog_content=$2 where id=$3",[new_title,new_content,p_id]);
    res.redirect("/posts");
});


// passport setup : local
passport.use(
  "local",
  new Strategy({usernameField: "email",passwordField: "password"}, async function verify(email, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        email,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password_hash;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("null,false");
      }
    } catch (err) {
      return cb(err);
    }
  })
);

// passport setup: googleOauth
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/posts",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try{
        const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email]);
        if(result.rows.length===0)
        {
          const newUser = await db.query("INSERT INTO users (email, password_hash) VALUES ($1, $2) returning *",
            [profile.email, "google"]
          );
          return cb(null, newUser.rows[0]);
        }
        else
        {
          return cb(null,result.rows[0]);
        }
      }
      catch(err)
      {
        return cb(err);
      }
    }
  )
);

// passport serialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id);
  });
  
// passport deserialize user
passport.deserializeUser(async (id, cb) => {
    try {
      const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      if (result.rows.length > 0) {
        // user found, send full details
        cb(null, result.rows[0]); 
      } else {
        // user does not exist
        cb(new Error('User not found')); 
      }
    } catch (err) {
      cb(err); 
    }
  });
  


app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})

