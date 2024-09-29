const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./user.model");
const Item = require("./item.model");
var app = express();
var session = require("express-session");
var MongoStore = require("connect-mongo");

app.use(cors({ origin: ["http://appserver.alunos.di.fc.ul.pt:3008"], credentials: true }));

app.use(bodyParser.json());
app.use(express.static("public"));

mongoDbUrl =
    "mongodb://psi008:psi008@localhost:27017/psi008?retryWrites=true&authSource=psi008";

mongoose.connect(mongoDbUrl);

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

const store = MongoStore.create({
    mongoUrl: mongoDbUrl,
    collectionName: "sessions",
});

app.use(
    session({
        secret: "Aguadestilada123",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

const validatePayloadMiddleware = (req, res, next) => {
    if (req.body) {
        next();
    } else {
        res.status(403).send({
            errorMessage: "You need a payload",
        });
    }
};

app.get("/users", async(req, res) => {
    await User.find({})
        .select("-_id -__v")
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            console.log("err");
            res.status(500).json({ error: err });
        });
});

app.post("/follow/:name", async(req, res) => {
    try {
        const targetUserName = req.params.name;
        const sessionUserName = req.body.name;

        const currentUser = await User.findOne({ name: sessionUserName });
        const targetUser = await User.findOne({ name: targetUserName });

        if (!targetUser) {
            return res.status(404).json("User not found");
        }

        targetUser.followerLists.push(currentUser.name);
        currentUser.followingLists.push(targetUser.name);

        await targetUser.save();
        await currentUser.save();

        req.session.user = currentUser;

        res.json("Followed successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.get("/following/:name", async(req, res) => {
    const user = await User.findOne({ name: req.params.name });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const following = user.followingLists;
    return res.status(200).json({ following: following });
});

app.get("/items", async(req, res) => {
    await Item.find({})
        .select("-_id -__v")
        .then((items) => {
            res.json(items);
        })
        .catch((err) => {
            console.log("err");
            res.status(500).json({ error: err });
        });
});

app.put("/user/library/:name", async(req, res) => {
    var existingItem;

    await Item.findOne({ name: req.body.name }).then((item) => {
        existingItem = item;
    });
    if (existingItem === null) {
        return res.status(400).json({ error: "Item doesnt exist" });
    }

    await User.findOne({ name: req.params.name })
        .then(async(user) => {
            user.library.push(existingItem.name);
            await user.save();
            req.session.user = user;
            res.json();
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.put("/user/wishlist/:name", async(req, res) => {
    var existingItem;

    await Item.findOne({ name: req.params.name }).then((item) => {
        existingItem = item;
    });

    if (existingItem === null) {
        return res.status(400).json({ error: "Item doesnt exist" });
    }

    await User.findOne({ name: req.session.user.name })
        .then(async(user) => {
            user.wishlist.push(existingItem.name);
            await user.save();
            req.session.user = user;
            res.json();
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.get('/user/wishlist', (req, res) => {
    const user = req.session.user; 
    const wishlistItems = user.wishlist; 
  
    res.json(wishlistItems);
  });

app.put("/user/cart/:name", async(req, res) => {

    var existingItem;

    await Item.findOne({ name: req.params.name }).then((item) => {
        existingItem = item;
    });
    if (existingItem === null) {
        return res.status(400).json({ error: "Item doesnt exist" });
    }

    await User.findOne({ name: req.session.user.name })
        .then(async(user) => {
            if (!user) {
                return res.status(400).json({ error: "User is not defined!" });
            }
            if (!user.carrinho) user.carrinho = [];
            if (user.carrinho.some((i) => i.includes(existingItem.name))) {
                let carrinho_item = user.carrinho.find((i) =>
                    i.includes(existingItem.name)
                );
                let strs = carrinho_item.split("|");
                if (strs.length == 1) strs.push("1"); // no caso de não ter sido bem feito à primeira vez
                strs[1] = strs[1] * 1 + 1;
                user.carrinho = user.carrinho.filter((i) => i != carrinho_item);
                user.carrinho.push(strs[0] + "|" + strs[1]);
            } else {
                user.carrinho.push(existingItem.name + "|1");
            }
            await user.save();
            req.session.user = user;
            res.json();
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.put("/user/cart/dec/:name", async(req, res) => {

    await User.findOne({ name: req.session.user.name })
        .then(async(user) => {
            if (!user) {
                return res.status(400).json({ error: "User is not defined!" });
            }
            if (!user.carrinho) user.carrinho = [];
            if (user.carrinho.some((i) => i.includes(req.params.name))) {
                let carrinho_item = user.carrinho.find((i) =>
                    i.includes(req.params.name)
                );
                let strs = carrinho_item.split("|");
                if (strs.length == 1) strs.push("1"); // no caso de não ter sido bem feito à primeira vez
                strs[1] = strs[1] * 1 - 1;

                if (strs[1] == 0) {
                    user.carrinho = user.carrinho.filter((i) => i != carrinho_item);
                } else {
                    user.carrinho = user.carrinho.filter((i) => i != carrinho_item);
                    user.carrinho.push(strs[0] + "|" + strs[1]);
                }
            } else {
                res.json();
                return;
            }
            await user.save();
            req.session.user = user;
            res.json();
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.post("/users", async(req, res) => {
    const existingUser = await User.findOne({ name: req.body.name });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
        name: req.body.name,
        password: req.body.password,
    });

    await newUser
        .save()
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: error });
        });
});

app.get("/login", async(req, res) => {
    try {
        if (req.session.user) {
            res.status(200).send(req.session.user);
        } else {
            res.status(401).send({ errorMessage: "User not logged in" });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/followers/:name", async(req, res) => {
    const user = await User.findOne({ name: req.params.name });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const followers = user.followerLists;
    return res.status(200).json({ followers: followers });
});
app.post("/unfollow/:name", async(req, res) => {
    try {
        const targetUserName = req.params.name;
        const sessionUserName = req.body.name;

        const currentUser = await User.findOne({ name: sessionUserName });
        const targetUser = await User.findOne({ name: targetUserName });

        if (!targetUser) {
            return res.status(404).json("User not found");
        }

        targetUser.followerLists = targetUser.followerLists.filter(
            (follower) => follower !== currentUser.name
        );
        currentUser.followingLists = currentUser.followingLists.filter(
            (following) => following !== targetUser.name
        );

        await targetUser.save();
        await currentUser.save();

        req.session.user = currentUser;

        res.json("Unfollowed successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/item/:name", async(req, res) => {
    await Item.findOne({ name: req.params.name })
        .then((item) => {
            if (item) {
                res.json(item);
            } else {
                res.status(404).send("No item found with that name");
            }
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});
app.get("/itemprice/:name", async(req, res)=>{
    await Item.findOne({name:req.params.name})
        .then((item)=>{
            if(item){
                res.json(item.price);
            }else{
                res.status(404).send("No item found with that name");
            }
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.delete("/user/wishlist/:name", async(req, res) => {
    var existingItem;
    await Item.findOne({ name: req.params.name }).then((item) => {
        existingItem = item;
    });
    if (existingItem === null) {
        return res.status(400).json({ error: "Item doesnt exist" });
    }

    

    await User.findOne({ name: req.session.user.name })
        .then(async(user) => {
            const index = user.wishlist.findIndex(item => item === existingItem.name);
            if (index !== -1) {
                user.wishlist.splice(index, 1);
            }
            await user.save();
            req.session.user = user;
            res.json();
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.delete("/user/cart", async(req, res) => {
    var existingItems = req.session.user.carrinho;
    const itemNames = existingItems.map(item => item.split("|")[0]);
    await User.findOne({ name: req.session.user.name })
        .then(async(user) => {
            user.carrinho = []
            for(let item of itemNames){
                if(!user.library.includes(item)){
                    console.log(item);
                    user.library.push(item);
                }
            }
            user.wishlist= user.wishlist.filter(item => !itemNames.includes(item));
            await user.save();
            req.session.user = user;
            res.json();
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.post("/items", async(req, res) => {
    const existingItem = await Item.findOne({ name: req.body.name });
    if (existingItem) {
        return res.status(400).json({ error: "Item already exists" });
    }

    const newItem = new Item({
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        platform: req.body.platform,
        languages: req.body.languages,
        price: req.body.price,
    });

    await newItem
        .save()
        .then((item) => {
            res.json(item);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: error });
        });
});
app.get("/user/:name", async(req, res) => {
    await User.findOne({ name: req.params.name })
        .select("-_id -__v -password")
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).send("No user found with that name");
            }
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.post("/login", validatePayloadMiddleware, async(req, res) => {
    const { name, password } = req.body;
    await User.findOne({ name, password })
        .select("-_id -__v -password")
        .then((user) => {
            if (user) {
                req.session.user = user;
                res.send(req.session.user);
            } else {
                res
                    .status(401)
                    .send({ errorMessage: "Username ou password inválidos" });
            }
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.get("/logout", async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send("Could not log out");
        } else {
            res.send({ message: "Logged out" });
        }
    });
});

app.get("/edit-profile/:name", async(req, res) => {
    await User.findOne({ name: req.params.name })
        .select("-_id -__v -password")
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).send("No user found with that name");
            }
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.patch("/editprofile/:name/editname", async(req, res) => {
    const { name } = req.params;
    const { newUsername } = req.body;

    try {
        const currentUser = await User.findOne({ name });

        if (!currentUser) {
            res.status(404).send("User not found");
        } else {
            
            const following = currentUser.followingLists;

            // Find all the users who are being followed by the current user
            const usersBeingFollowed = await User.find({ name: { $in: following } });

            // Update the followers list of each user being followed by the current user
            usersBeingFollowed.map(async user => {
            const index = user.followerLists.indexOf(name);
            if (index !== -1) {
                user.followerLists[index] = newUsername;
                await user.save();
            }
        });

            const followers = currentUser.followerLists;

            const usersFollowingOldUsername = await User.find({ name: { $in: followers } });

            // Update the followerLists array for each user
            const updatedUsers = usersFollowingOldUsername.map(async user => {
            const index = user.followingLists.indexOf(name);
            if (index !== -1) {
                user.followingLists[index] = newUsername;
                await user.save();
            }
        });

            currentUser.name = newUsername;
            await currentUser.save();
            req.session.user = currentUser;
            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
            });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.patch("/editprofile/:username/editpicture", async(req, res) => {
    const { currentUsername, newProfilePicture } = req.body;

    try {
        const currentUser = await User.findOne({ name: currentUsername });

        if (!currentUser) {
            res.status(404).send("User not found");
        } else {
            currentUser.profilePicture = newProfilePicture;
            await currentUser.save();
            res.status(200).json({
                success: true,
                message: "Profile picture updated successfully",
            });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/username-availability/:username", async(req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({ name: username });

        if (user) {
            res.status(200).json(false); // Nome de usuário não disponível
        } else {
            res.status(200).json(true); // Nome de usuário disponível
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put("/item/rating/:name", validatePayloadMiddleware, async(req, res) => {
    const { userName, rating, comment } = req.body;

    var existingItem;

    // find the item with the matching name in the database
    await Item.findOne({ name: req.params.name }).then((item) => {
        const userReviewed = item.ratings.find(
            (rating) => rating.name === req.body.name
        );

        if (userReviewed) {
            // User has already reviewed the item
            res.status(401).send({ errorMessage: "User already reviewed the item!" });
        }
        existingItem = item;
        item.ratings.push({
            name: req.body.name,
            rating: rating,
            comment: comment,
        });

        const sum = item.ratings.reduce((acc, rating) => acc + rating.rating, 0);
        // Update the overallrating property of the item object
        item.overallRating = sum / item.ratings.length;

        item.save();
    });

    if (existingItem === null) {
        return res.status(400).json({ error: "Item doesnt exist" });
    } else {
        return res.json();
    }
});

app.listen(3058, () => console.log(`Express server running on port 3058`));