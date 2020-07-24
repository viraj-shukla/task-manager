const functions = require('firebase-functions');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.js');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://task-manager-ed416.firebaseio.com"
});
const db = admin.firestore();

const firebase = require('firebase');
const firebaseConfig = require('./firebaseConfig.js')
firebase.initializeApp(firebaseConfig);

const express = require('express');
const app = express();

const testOrigin = 'http://localhost:3000'
const prodOrigin = 'https://task-manager-ed416.web.app'
const clientOrigin = prodOrigin

const cors = require('cors');
const corsOptions = {
    credentials: true,
    origin: clientOrigin
};
app.use(cors(corsOptions));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.text());

const cookieParser = require('cookie-parser');
const { user } = require('firebase-functions/lib/providers/auth');
const { auth } = require('firebase-admin');
app.use(cookieParser())

/*
    To-Do/Reminders:
    /signup: edit access-control origin for hosting url
*/

// Keep track of current user
var currentUser = firebase.auth().currentUser

firebase.auth().onAuthStateChanged(user => {
    currentUser = user
})

// Set headers for CORS compliance
addHeaders = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', clientOrigin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
}

// Generate random 20-character ID
genRandomId = () => {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

    let id = ""
    for (let i = 0; i < 20; i++) {
        let index = Math.floor(Math.random() * 62)
        id = id + chars[index]
    }

    return id
}

// Task management
app.post('/get-project', addHeaders, (req, res) => {

    // Get user's recent project ID, & get that project
    if (currentUser) {
        let uid = currentUser.uid
        
        db.collection('users').doc(uid).get()
            .then(doc => {
                let projectId = doc.data().recentProject
                db.collection('projects').doc(projectId).get()
                    .then(doc => {
                        let projectData = doc.data()
                        let subjectData = projectData.subjects

                        // If due data is 2 days away or less, make high priority
                        //      & update project in db
                        let currentDate = new Date()
                        let isProjectModified = false
                        let taskFunc = (task) => {
                            //let taskDue = Date.parse()
                            if (Date.parse(task.due) - currentDate.getTime() < 1000 * 60 * 60 * 24 * 2) {
                                let newTask = task
                                newTask.priority = "1"
                                isProjectModified = true
                                return newTask
                            }
                            else {
                                return task
                            }
                        }
                        let subjectFunc = (subject) => {
                            subject.tasks.forEach(taskFunc)
                        }
                        subjectData.forEach(subjectFunc)

                        if (isProjectModified) {
                            projectData.subjects = subjectData
                            db.collection('projects').doc(projectId).update({
                                subjects: subjectData
                            })
                        }


                        let projectDataObj = { project: projectData }
                        return res.json(projectDataObj)
                    })
            })
            .catch(err => res.json({ error: err.code }))

    }
    else {
        return res.status(403).json({ error: 'invalid user' })
    }
    
})

app.post('/add-project', addHeaders, (req, res) => {
    if (currentUser) {
        // Initialize request body & new project doc
        let reqBody = JSON.parse(req.body)
        let projectRef = db.collection('projects').doc()
        let projectId = projectRef.id

        let priorityColors = {
            "1": {
                color: "#ed4c2f",
                name: "High Priority"
            },
            "2": {
                color: "#f1da0b",
                name: "Medium Priority"
            },
            "3": {
                color: "#1dc434",
                name: "Low Priority"
            },
            "4": {
                color: "#ebebeb",
                name: "No Priority"
            }
        }

        
        // Update user's project fields & add project
        let uid = currentUser.uid
        admin.firestore().collection('users').doc(uid).update({
            recentProject: projectId,
            projectIds: admin.firestore.FieldValue.arrayUnion(projectId)
        })
            .then(() => {
                projectRef.set({
                    name: reqBody.name,
                    id: projectId,
                    users: [],
                    subjects: [],
                    priorityColors,
                    quickTasks: ''
                })
                .then(() => {
                    res.json({ success: 'success' })
                })
            })
            .catch(err => res.json({ error: err.code }))
    }
    else {
        return res.status(403).json({ error: 'invalid user' })
    }
})

app.post('/edit-project', addHeaders, (req, res) => {
    // Initialize request body & new project doc
    let reqBody = JSON.parse(req.body)
    
    if (currentUser) {
        db.collection('projects').doc(reqBody.projectId).update({
            name: reqBody.name
        })
            .then(() => res.json({ success: 'success' }))
            .catch(err => res.json({ error: err.code }))
    }
})

app.post('/delete-project', addHeaders, (req, res) => {
    // Initialize request body & new project doc
    let reqBody = JSON.parse(req.body)
    
    
    if (currentUser) {
        // Delete nested collections
        db.collection('projects').doc(reqBody.projectId).delete()
            .then(() => {
                // Remove projectId from user data
                let uid = currentUser.uid
                admin.firestore().collection('users').doc(uid).update({
                    projectIds: admin.firestore.FieldValue.arrayRemove(reqBody.projectId)
                })
                .then(() => {
                    admin.firestore().collection('users').doc(uid).get()
                    .then(doc => {
                        let projectIds = doc.data().projectIds
                        if (projectIds.length == 0) {
                            admin.firestore().collection('users').doc(uid).update({
                                recentProject: null
                            })
                            .then(() => res.json({ status: 'no recent projects' }))
                            .catch(err => res.json({ error: err.code }))
                        }
                        else {
                            admin.firestore().collection('users').doc(uid).update({
                                recentProject: projectIds[0]
                            })
                            .then(() => res.json({ status: 'success' }))
                            .catch(err => res.json({ error: err.code }))
                        }
                    })
                    .catch(err => res.json({ error: err.code }))
                })
                .catch(err => res.json({ error: err.code }))
            })
            .catch(err => res.json({ error: err.code }))
    }
})

app.post('/select-project', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    // Set user's recent project
    if (currentUser) {
        let uid = currentUser.uid
        admin.firestore().collection('users').doc(uid).update({
            recentProject: reqBody.projectId
        })
            .then(() => res.json({ success: 'success' }))
            .catch(err => res.json({ error: err.code }))
    }
})

app.post('/list-projects', addHeaders, (req, res) => {
    // Get user's project list, and fetch projects' info
    if (currentUser) {
        let uid = currentUser.uid
        admin.firestore().collection('users').doc(uid).get()
            .then(userDoc => {
                let projectIdList = userDoc.data().projectIds
                let recentProjectId = userDoc.data().recentProject

                db.collection('projects').where("id", "in", projectIdList).get()
                    .then(querySnapshot => {
                        let projectData = { projects: [] }
                        let recentProjectObj = {}
                        querySnapshot.forEach(projectDoc => {
                            projectObj = {
                                name: projectDoc.data().name, 
                                id: projectDoc.data().id 
                            }
                            projectDoc.data().id == recentProjectId ?
                                recentProjectObj = projectObj :
                                projectData.projects.unshift(projectObj)
                        })
                        // Recent project is first element in project array
                        projectData.projects.unshift(recentProjectObj)
                        res.json(projectData)
                    })
                    .catch(err => res.json({ error: err.code }))
            })
            .catch(err => res.json({ error: err.code }))
    }
    else {
        return res.status(403).json({ error: 'invalid user' })
    }
})

app.post('/add-subject', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    let subjectId = genRandomId()
    let newSubject = {
        name: reqBody.name,
        id: subjectId,
        tasks: []
    }

    db.collection('projects').doc(reqBody.projectId).update({
        subjects: admin.firestore.FieldValue.arrayUnion(newSubject)
    })
    .then(() => {
        res.json({ success: 'success' })
    })
    .catch(err => res.json({ error: err.code }))
})

app.post('/edit-subject', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    db.collection('projects').doc(reqBody.projectId).get()
        .then(doc => {
            let newSubjectArr = doc.data().subjects
            let subjectFunc = (subject) => {
                return subject.id == reqBody.subjectId ? 
                    Object.assign(subject, { name: reqBody.name }) : 
                    subject
            }
            newSubjectArr.forEach(subjectFunc)

            db.collection('projects').doc(reqBody.projectId).update({
                subjects: newSubjectArr
            })
            .then(() => res.json({ success: 'success' }))
            .catch(err => res.json({ error: err.code }))
        })
        .catch(err => res.json({ error: err.code }))
})

app.post('/edit-subject-order', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    db.collection('projects').doc(reqBody.projectId).update({
        subjects: reqBody.subjects
    })
        .then(() => res.json({ success: 'success' }))
        .catch(err => res.json({ error: err.code }))
})

app.post('/delete-subject', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    db.collection('projects').doc(reqBody.projectId).get()
        .then(doc => {
            let newSubjectArr = doc.data().subjects
            let subjectFunc = (subject, index, subjects) => {
                if (subject.id == reqBody.subjectId) subjects.splice(index, 1)
            }
            newSubjectArr.forEach(subjectFunc)

            db.collection('projects').doc(reqBody.projectId).update({
                subjects: newSubjectArr
            })
            .then(() => res.json({ success: 'success' }))
            .catch(err => res.json({ error: err.code }))
        })
        .catch(err => res.json({ error: err.code }))
})

app.post('/add-task', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    let taskId = genRandomId()
    let newTask = {
        id: taskId,
        name: reqBody.name,
        priority: reqBody.priority,
        description: reqBody.description,
        due: reqBody.due
    }

    db.collection('projects').doc(reqBody.projectId).get()
        .then(doc => {
            let newSubjectArr = doc.data().subjects
            let subjectFunc = (subject) => {
                return subject.id == reqBody.subjectId ? 
                    subject.tasks.push(newTask) : 
                    subject
            }
            newSubjectArr.forEach(subjectFunc)

            db.collection('projects').doc(reqBody.projectId).update({
                subjects: newSubjectArr
            })
            .then(() => res.json({ success: 'success' }))
            .catch(err => res.json({ error: err.code }))
        })
        .catch(err => res.json({ error: err.code }))
})

app.post('/edit-task', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    let newTask = {
        id: reqBody.taskId,
        name: reqBody.name,
        priority: reqBody.priority,
        description: reqBody.description,
        due: reqBody.due
    }

    db.collection('projects').doc(reqBody.projectId).get()
        .then(doc => {
            let newSubjectArr = doc.data().subjects
            let taskFunc = (task) => {
                return task.id == reqBody.taskId ?
                    Object.assign(task, newTask) :
                    task
            }
            let subjectFunc = (subject) => {
                return subject.id == reqBody.subjectId ? 
                    subject.tasks.forEach(taskFunc) : 
                    subject
            }
            newSubjectArr.forEach(subjectFunc)

            db.collection('projects').doc(reqBody.projectId).update({
                subjects: newSubjectArr
            })
            .then(() => res.json({ success: 'success' }))
            .catch(err => res.json({ error: err.code }))
        })
        .catch(err => res.json({ error: err.code }))
})

app.post('/delete-task', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    db.collection('projects').doc(reqBody.projectId).get()
        .then(doc => {
            let newSubjectArr = doc.data().subjects
            let taskFunc = (task, index, tasks) => {
                if (task.id == reqBody.taskId) tasks.splice(index, 1)
            }
            let subjectFunc = (subject) => {
                return subject.id == reqBody.subjectId ? 
                    subject.tasks.forEach(taskFunc) : 
                    subject
            }
            newSubjectArr.forEach(subjectFunc)

            db.collection('projects').doc(reqBody.projectId).update({
                subjects: newSubjectArr
            })
            .then(() => res.json({ success: 'success' }))
            .catch(err => res.json({ error: err.code }))
        })
        .catch(err => res.json({ error: err.code }))
})

app.post('/edit-quicktask', addHeaders, (req, res) => {
    // Initialize request body & new project doc
    let reqBody = JSON.parse(req.body)
    
    if (currentUser) {
        db.collection('projects').doc(reqBody.projectId).update({
            quickTasks: reqBody.quickTasks
        })
            .then(() => res.json({ success: 'success' }))
            .catch(err => res.json({ error: err.code }))
    }
})

// Sign-up
app.post('/signup', addHeaders, (req, res) => {
    const newUser = JSON.parse(req.body)
    let errors = {};

    for (let field of ['firstName', 'lastName', 'email', 'password', 'confirmPassword']) {
        if (newUser[field] === '' || !newUser[field]) {
            return res.status(400).json({ error: 'field-empty' })
        }
    }

    if (newUser.password != newUser.confirmPassword) {
        return res.status(400).json({ error: "passwords-unmatched" })
    }

    var userVar;
    //var userID;
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(userCred => {
            return userCred.user
        })
        .then(user => {
            userVar = user

            let userCreds = {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                uid: user.uid,
                projectIds: [],
                recentProject: null
            }
            db.collection('users').doc(user.uid).set(userCreds)

            res.json({ success: 'success' })
        })
        .catch(err => res.json({ error: err.code }))
})


// User routes
app.post('/login', addHeaders, (req, res) => {
    const user = JSON.parse(req.body)

    for (let field of ['email', 'password']) {
        if (user[field] === '' || !user[field]) {
            return res.status(400).json({ error: 'field-empty' })
        }
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(() => {
            res.json({ success: 'success' })
        })
        .catch(err => res.json({ error: err.code }))
})

app.get('/logout', (req, res) => {
    firebase.auth().signOut()
        .then(() => res.json({ status: 'success' }))
        .catch(err => res.json({ err: err.code }))
})

app.post('/edit-user-name', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    if (currentUser) {
        let uid = currentUser.uid
        db.collection('users').doc(uid).get()
            .then(doc => {
                if (reqBody.oldFirstName != doc.data().firstName || 
                    reqBody.oldLastName != doc.data().lastName) {
                    return res.json({ error: 'invalid-old-names' })
                }
                admin.firestore().collection('users').doc(uid).update({
                    firstName: reqBody.newFirstName,
                    lastName: reqBody.newLastName
                })
                    .then(() => res.json({ success: 'success' }))
                    .catch(err => res.json({ error: err.code }))
            })
            .catch(err => res.json({ error: err.code }))
    }
})

app.post('/edit-user-email', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    if (currentUser) {
        let uid = currentUser.uid
        if (reqBody.oldEmail != currentUser.email) {
            return res.json({ error: 'invalid-old-email' })
        }
        currentUser.updateEmail(reqBody.newEmail)
            .then(() => {
                admin.firestore().collection('users').doc(uid).update({
                    email: reqBody.newEmail
                })
                    .then(() => res.json({ status: 'success' }))
                    .catch(err => res.json({ error: err.code }))
            })
            .catch(err => res.json({ error: err.code }))
    }
})

app.post('/edit-user-password', addHeaders, (req, res) => {
    let reqBody = JSON.parse(req.body)

    if (currentUser) {
        let uid = currentUser.uid
        if (reqBody.oldPassword != currentUser.password) {
            return res.json({ error: 'invalid-old-password' })
        }
        currentUser.updatePassword(reqBody.newPassword)
            .then(() => {
                auth.sendPasswordResetEmail(currentUser.email)
                    .then(() => res.json({ status: 'success' }))
                    .catch(err => res.json({ error: err.code }))
            })
            .then(() => res.json({ status: 'success' }))
            .catch(err => res.json({ error: err.code }))
    }
})

app.post('/delete-user', addHeaders, (req, res) => {
    if (currentUser) {
        currentUser.delete()
            .then(() => res.json({ status: 'success' }))
            .catch(err => res.json({ error: err.code }))
    }
})

exports.api = functions.https.onRequest(app)