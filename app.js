const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var users_data = [
    {
        name: "tauseef",
        data: [
            {
                project_title: "AI in Agriculture",
                project_content: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."

            }
        ]
    },
    {
        name: "faizan",
        data: [
            {
                project_title: "AI in Agriculture",
                project_content: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."

            }
        ]
    },
    {
        name: "bansh",
        data: [
            {
                project_title: "AI in Agriculture",
                project_content: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."

            }
        ]
    },
    {
        name: "vikash",
        data: [
            {
                project_title: "AI in Agriculture",
                project_content: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."

            }
        ]
    }
];


// Rendering all the projects along with the name and project details
app.get("/listAllProjects", (req, res) => {
    res.send(users_data);
});


// Rendering only the users name currently enlist in the databases
app.get("/listAllUsers", (req, res) => {
    users = []
    n = users_data.length;
    for(var i = 0; i < n; i++){
        users.push(users_data[i].name);
    }
    res.send(users);
});


// Rendering all project titles 
app.get("/listAllProjectTitle", (req, res) => {
    project_title = [];
    n = users_data.length;
    for(var i = 0; i < n; i++){
        project_title.push(users_data[i].data[0].project_title);
    }
    res.send(project_title);
});


// Rendering only the projects
app.get("/listAllData", (req, res) => {
    each_projects = []
    n = users_data.length;
    for(var i = 0; i < n; i++){
        each_projects.push(users_data[i].data[0]);
    }
    res.send(each_projects);
});


// Adding a complete entry to the existing database
app.post("/addUser", (req, res) => {
    const new_user = req.body.name;
    const new_user_title = req.body.title;
    const new_user_project_content = req.body.content;
    const new_data = {
        name: new_user,
        data: [
            {
                project_title: new_user_title,
                project_content: new_user_project_content
            }
        ]
    };
    users_data.push(new_data);
    res.send("Data Added Successfully");
});


// Adding the project to the existing project
app.put("/addProject", (req, res) => {
    const target_user = req.body.name;
    const new_title = req.body.title;
    const new_content = req.body.content;
    const new_project = {
        project_title: new_title,
        project_content: new_content
    };
    for(var i = 0; i < users_data.length; i++){
        if(users_data[i].name == target_user){
            users_data[i].data.push(new_project);
            break;
        }
    }
    res.send("Data Updated Successfully");
});

app.delete("/deleteData", (req, res) => {
    const target_user = req.body.name;
    for(var i = 0; i < users_data.length; i++){
        if(users_data[i].name == target_user){
            users_data.splice(i, 1);
            break;
        }
    }
    res.send(`Data deleted successfully`);
});


app.listen(3000, (req, res) => {
    console.log("Server started on port 3000");
});