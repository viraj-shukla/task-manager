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

const cors = require('cors');
const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000'
};
app.use(cors(corsOptions));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.text());

const cookieParser = require('cookie-parser')
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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
}

// Generate random 20-character ID
genRandomId = () => {
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

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
        console.log(uid)
        
        db.collection('users').doc(uid).get()
            .then(doc => {
                let projectId = doc.data().recentProject
                console.log(projectId)
                db.collection('projects').doc(projectId).get()
                    .then(doc => {
                        let projectData = { project: doc.data() }
                        return res.json(projectData)
                    })
            })
            .catch(err => res.json({ error: err.code }))

    }
    
})

app.post('/add-project', addHeaders, (req, res) => {
    // Initialize request body & new project doc
    let reqBody = JSON.parse(req.body)
    let projectRef = db.collection('projects').doc()
    let projectId = projectRef.id

    
    // Update user's project fields & add project
    if (currentUser) {
        let uid = currentUser.uid
        console.log(uid)
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
                quickTasks: ''
            })
            .then(() => {
                res.json({ success: 'success' })
            })
        })
        .catch(err => res.json({ error: err.code }))
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

app.post('/list-projects', addHeaders, (req, res) => {
    if (currentUser) {
        // Delete nested collections
        let uid = currentUser.uid
        admin.firestore().collection('users').doc(uid).get()
            .then(userDoc => {
                let projectIdList = userDoc.data().projectIds
                db.collection('projects').where("id", "in", projectIdList).get()
                    .then(querySnapshot => {
                        projectData = { projects: [] }
                        querySnapshot.forEach(projectDoc => {
                            projectData.projects.unshift({ name: projectDoc.data().name, id: projectDoc.data().id })
                            console.log(projectData.projects)
                        })
                        res.json(projectData)
                    })
                    .catch(err => res.json({ error: err.code }))
            })
            .catch(err => res.json({ error: err.code }))
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
    console.log(newTask)

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

    var userVar;
    //var userID;
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(userCred => {
            console.log('got here 2')
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

            console.log(`${currentUser.uid}`)

            res.json({ success: 'success' })
        })
        /*.then(() => {
            userVar.getIdTokenResult(true)
                .then(tokenResult => {
                    var token = tokenResult.token
                    console.log(`token: ${token}`)
                    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
                    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
                    res.setHeader('Access-Control-Allow-Credentials', 'true')
                    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None`)
                    return res.json({ token })
                })
                .catch(err => res.json({error: err.code }))
        })*/
        .catch(err => {
            message = err.code
            if (message === 'auth/email-already-in-use') {
                res.json({ email: 'Email already in use' })
            }
            else {
                res.json({ message })
            }
        })
})


// Login route
app.post('/login', addHeaders, (req, res) => {
    const user = JSON.parse(req.body)

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        /*.then(userCred => {
            userCred.user.getIdTokenResult(true)
                .then(tokenResult => {
                    var token = tokenResult.token
                    console.log(`token: ${token}`)
                    return res.json({ token })
                })
                .catch(err => res.json({error: err.code }))
        })
        .then(user => {
            firebase.auth().getIdToken(true)
                .then(token => {
                    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
                    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
                    //res.setHeader('Access-Control-Allow-Credentials', 'true')
                    //res.setHeader('Access-Control-Allow-Headers', 'true')
                    //let options = {httpOnly: true, secure: true, sameSite: 'none'}
                    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
                    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None`)

                    return res.json({ token })
                })
        })*/
        .then(() => {
            res.json({ success: 'success' })
        })
        .catch(err => res.json({ error: err.code }))
})

// Sign out
app.post('/logout', (req, res) => {
    firebase.auth().signOut()
        .catch(err => {
            return res.json({ err: err.code })
        })
})

exports.api = functions.https.onRequest(app)