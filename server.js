var express = require("express");
let app = express();
let mysql2 = require("mysql2");
var fileUpload = require("express-fileupload");
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
let nodemailer = require("nodemailer");

//let config = {
  //  host: "127.0.0.1",
    //user: "root",
   // password: "kishika@2007",
    //database: "project"
//};

let config = {
    host: "b2yvoodds1ygbxrmytkt-mysql.services.clever-cloud.com",
    user: "u4v7ofthnlu4fsgy",
    password: "i2cWM2ur5zI48z5nGamT",
    database: "b2yvoodds1ygbxrmytkt",
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
};

var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null) {
        console.log("connected to database successfully");
    } else {
        console.log(err.message);
    }
});

app.listen(2009, function (req, resp) {
    console.log("Your server started ❤️");
});

app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);
});
app.get("/infl-dash", function (req, resp) {
    let path = __dirname + "/public/infl-dash.html";
    resp.sendFile(path);
});

app.get("/infl-profile", function (req, resp) {
    let path = __dirname + "/public/infl-profile.html";
    resp.sendFile(path);
});

app.get("/client-profile", function (req, resp) {
    let path = __dirname + "/public/client-profile.html";
    resp.sendFile(path);
});

app.get("/influ-finder", function (req, resp) {
    let path = __dirname + "/public/influ-finder.html";
    resp.sendFile(path);
});

app.get("/client-dash", function (req, resp) {
    let path = __dirname + "/public/client-dash.html";
    resp.sendFile(path);
});

app.get("/event-manager", function (req, resp) {
    let path = __dirname + "/public/event-manager.html";
    resp.sendFile(path);
});

app.get("/admin", function (req, resp) {
    let path = __dirname + "/public/admin.html";
    resp.sendFile(path);
});

app.get("/signup-process", function (req, resp) {
    console.log(req.query);

    let email = req.query.txtEmail;
    let pwd = req.query.pwd;
    let utype = req.query.combo;

    mysql.query("insert into users values(?,?,?,1)", [email, pwd, utype], function (err) {
        if (err == null) {
            resp.send("SignedUp Successfullyy");
        } else {
            resp.send(err.message);
        }
    });
});
app.get("/login-process", function (req, resp) {
    let emaill = req.query.txtEmaill;
    let txtPwd = req.query.txtPwd;

    mysql.query("select * from users where email=? and pwd=?", [emaill, txtPwd], function (err, result) {
        if (err != null) {
            resp.send(err.message); return;
        }
        if (result.length == 0) {
            resp.send("Invalid Id or Password"); return;
        }
        if (result[0].status == 1) {
            resp.send(result[0].utype); return;
        } else {
            resp.send("U R Blocked!!!"); return;
        }
    });
});
app.get("/login", function (req, resp) {
    let emaill = req.query.txtEmaill;
    let txtPwd = req.query.txtPwd;

    if (emaill === "kishika7355@gmail.com" && txtPwd === "proud@2007") {
        resp.send("LoggedIn");
    } else {
        resp.send("Invalid Id or Password");
    }
});

app.post("/infl-profile", function (req, resp) {
    console.log(req.body);
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/myuploads/" + fileName;
        req.files.ppic.mv(path);
    } else {
        fileName = "nopic.jpg";
    }

    let email = req.body.txtEmail;
    let name = req.body.name;
    let address = req.body.address;
    let number = req.body.number;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let gender = req.body.gender;
    let field = req.body.field;
    let youtube = req.body.youtube;
    let insta = req.body.insta;
    let facebook = req.body.facebook;
    let other = req.body.other;

    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [email, name, fileName, address, number, city, state, zip, gender, field.toString(), youtube, insta, facebook, other], function (err) {
        if (err == null) {
            resp.redirect("result.html");
        } else {
            resp.send(err.message);
        }
    });
});

app.post("/client-profile", function (req, resp) {
    console.log(req.body);

    let email = req.body.txtEmail;
    let name = req.body.name;
    let address = req.body.address;
    let number = req.body.number;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let category = req.body.category

    mysql.query("insert into clprofile values(?,?,?,?,?,?,?,?)", [email, name, address, number, city, state, zip, category], function (err) {
        if (err == null) {
            resp.redirect("result1.html");
        } else {
            resp.send(err.message);
        }
    });
});
app.post("/client-update", function (req, resp) {
    console.log(req.body);

    let email = req.body.txtEmail;
    let name = req.body.name;
    let address = req.body.address;
    let number = req.body.number;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let category = req.body.category;
    mysql.query("update clprofile set name=?, address=? , number=? , city=? , state=? , zip=?, category=? where email=?", [name, address, number, city, state, zip, category, email], function (err, result) {
        if (err == null) {
            if (result.affectedRows >= 1) {
                resp.redirect("result3.html");
            } else {
                resp.send("Invalid Email ID");
            }
        } else {
            resp.send(err.message);
        }
    });
});
app.get("/find-client-details", function (req, resp) {
    let email = req.query.txtEmail;

    mysql.query("select * from clprofile where email=?", [email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);
    });
});
app.get("/change-pwd", function (req, resp) {
    // console.log(req.query);

    mysql.query("select pwd from users where email=?", [req.query.email], function (err, res) {
        if (!err) {
            console.log(res[0].pwd);
            if ((req.query.oldpwd) != (res[0].pwd)) {
                resp.send("Old password is incorrect and does not match with password saved in database");
                return;
            }

            else {
                mysql.query("update users set pwd=? where email=?", [req.query.newpwd, req.query.email], function (err, res) {
                    if (!err) {
                        resp.send("Password changed");
                    }
                    else {
                        resp.send(err.message);
                    }
                })
            }
        }
        else {
            // console.log(err.message);
            resp.send(err.message);
        }
    })
})
app.get("/do-find", function (req, resp) {
    mysql.query("select * from iprofile where field like ? and city = ?", ["%" + req.query.field + "%", req.query.city], function (err, resultJsonAry) {
        if (err) {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    });
});

app.get("/do-findbyname", function (req, resp) {
    mysql.query("select * from iprofile where name like ?", ["%" + req.query.name + "%"], function (err, resultJsonAry) {
        if (err) {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    });
});

app.get("/find-influ", function (req, resp) {
    mysql.query("select distinct city from iprofile where field like ?", ["%" + req.query.fields + "%"], function (err, resultJsonAry) {
        if (err) {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    });
});
app.post("/booking-event", function (req, resp) {
    console.log(req.body);
    let email = req.body.txtEmail;
    let title = req.body.title;
    let date = req.body.date;
    let time = req.body.time;
    let city = req.body.city;
    let venue = req.body.venue;
    mysql.query("insert into bookings (email, title, date, time, city, venue) values (?, ?, ?, ?, ?, ?)", [email, title, date, time, city, venue], function (err) {
        if (err == null) {
            resp.send("Event Posted Successfully");
        } else {
            resp.send(err.message);
        }
    });
});
app.get("/find-user-details", function (req, resp) {
    let email = req.query.txtEmail;

    mysql.query("select * from iprofile where email=?", [email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);
    });
});
app.post("/infl-update", function (req, resp) {
    console.log(req.body);

    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/myuploads/" + fileName;
        req.files.ppic.mv(path);
    } else {
        fileName = req.body.hdn;
    }
    let email = req.body.txtEmail;
    let name = req.body.name;
    let address = req.body.address;
    let number = req.body.number;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let gender = req.body.gender;
    let field = req.body.field;
    let youtube = req.body.youtube;
    let insta = req.body.insta;
    let facebook = req.body.facebook;
    let other = req.body.other;
    mysql.query("update iprofile set name=?, ppic=? ,address=? , number=? , city=? , state=? , zip=?, gender=?, field=?, youtube=? , insta=? , facebook=? ,other=? where email=?", [name, fileName, address, number, city, state, zip, gender, field.toString(), youtube, insta, facebook, other, email], function (err, result) {
        if (err == null) {
            if (result.affectedRows >= 1) {
                resp.redirect("result4.html");
            } else {
                resp.send("Invalid Email ID");
            }
        } else {
            resp.send(err.message);
        }
    });
});
app.get("/change-pw", function (req, resp) {
    // console.log(req.query);

    mysql.query("select pwd from users where email=?", [req.query.email], function (err, res) {
        if (!err) {
            console.log(res[0].pwd);
            if ((req.query.oldpwd) != (res[0].pwd)) {
                resp.send("Old password is incorrect and does not match with password saved in database");
                return;
            }

            else {
                mysql.query("update users set pwd=? where email=?", [req.query.newpwd, req.query.email], function (err, res) {
                    if (!err) {
                        resp.send("Password changed");
                    }
                    else {
                        resp.send(err.message);
                    }
                })
            }
        }
        else {
            // console.log(err.message);
            resp.send(err.message);
        }
    })
})
app.get("/fetch-all-profile", function (req, resp) {
    mysql.query("select * from iprofile", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-all-user", function (req, resp) {
    mysql.query("select * from users", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-all", function (req, resp) {
    mysql.query("select * from users", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/del-one", function (req, resp) {
    mysql.query("delete from users where email=?", [req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.sqlMsg);


        }
        resp.send("Deleted");

    })

})
app.get("/block-one", function (req, resp) {
    mysql.query("update users set status=0 where email=?", [req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.sqlMsg);
            return;

        }

        else {
            resp.send(resultJsonAry);
        }


    })

})
app.get("/unblock-one", function (req, resp) {
    mysql.query("update users set status=1 where email=?", [req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        else {
            resp.send(resultJsonAry);
        }


    })

})
app.get("/fetch-future-events", function (req, resp) {
    mysql.query("select * from bookings where email=?", [req.query.email], function (err, resultJsonAry) {
        if (err) {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    });
});
app.get("/delete-future-events", function (req, resp) {
    mysql.query("delete from bookings where email=? ", [req.query.email], function (err, resultJsonAry) {
        if (err) {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
app.get("/send-mail", function (req, resp) {
    console.log(req.query);

    let retPwd;
    let mail = req.query.mail;

    mysql.query("select * from users where email=?", [mail], function (err, result) {
        if (err == null) {
            if (result.length > 0) {
                console.log(result);
                retPwd = result[0].pwd; // Correctly accessing the password

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "kishika0000@gmail.com",
                        pass: 'kixc bjek okrr hbsv'
                    }
                });

                let mailOptions = {
                    from: 'kishika0000@gmail.com',
                    to: mail,
                    subject: 'Password for cSpark',
                    html: "Thank you For placing your request <br> Visit again <br> Password : " + retPwd,
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                resp.send("Password retrieved and email sent.");
            } else {
                resp.send("No user found with this email address.");
            }
        } else {
            resp.send(err.message);
        }
    });
});