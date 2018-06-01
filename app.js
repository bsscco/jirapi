console.log(new Date().toTimeString());

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));
const JIRA_SERVER_DOMAIN = config.jira_server_domain;
const APP_ACCESS_TOKEN = config.app_access_token;
const USER_NAME = config.username;
const PWD = config.pwd;

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const pathToRegexp = require('path-to-regexp');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('Hello, JiraApi!').end();
});

app.post('/issues', (req, res) => {
    console.log(req.body);
    res.send('');

    login()
        .then(res => getIssues(res.headers['set-cookie'].join(';'), req.body.text))
        .then(res => sendMsg(req.body.response_url, makeIssuesMsgPayload(res.data)))
        .then(res => console.log(res.data))
        .catch(err => console.log(err.message));
});


function login() {
    return axios
        .post(JIRA_SERVER_DOMAIN + '/rest/auth/1/session',
            JSON.stringify({
                username: USER_NAME,
                password: PWD
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
}

function getIssues(setCookie, versionQuery) {
    return axios
        .get(JIRA_SERVER_DOMAIN + '/rest/api/2/search?jql=project=ok and component=Android and ' + versionQuery, {
            headers: {
                'Cookie': setCookie,
                'Content-Type': 'application/json'
            }
        });
}

function makeIssuesMsgPayload(data) {
    let text = '';
    data.issues.forEach(issue => {
        text += '\n' + issue.key.substring(3) + ' ' + issue.fields['customfield_11013'];
    });

    return {
        text: text
    };
}

function sendMsg(responseUrl, payload) {
    return axios
        .post(responseUrl ? responseUrl : 'https://slack.com/api/chat.postMessage', JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + APP_ACCESS_TOKEN
            }
        });
}


// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});