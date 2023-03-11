const jwt = require("jsonwebtoken");

const {db}=require("../config/db");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      try {
        if (err) {
          return res.status(401).json({ error: "Unauthorized!" });
        }

        const q_searchemail="SELECT * FROM users WHERE id = ?";
    db.query(q_searchemail,[payload.id],async (err,result)=>
    {
      if(!result.length)
      {
        res.status(401).send("Unauthorised");
      }
      else{
        result.password=undefined;
        req.user = result;
        next();
      }
     });
     } catch (err) {
        console.log(err);
      }
    });
  } else {
    return res.status(403).json({ error: "Forbidden 🛑🛑" });
  }
};
