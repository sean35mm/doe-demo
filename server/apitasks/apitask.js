process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const config = require('../config/config.json');
const axios = require('axios');
const qs = require('qs');
const wrapper = require('axios-cookiejar-support').wrapper;
const CookieJar = require('tough-cookie').CookieJar;

class ApiTask {
    identity = "";
    taskname = "";
    taskid = "";    
    constructor(identity, taskname){
        this.identity = identity;
        this.taskname = taskname;       
    }    
    async run(reqData){
        let data = JSON.stringify(reqData);
        let request = {
            method: 'post',
            url: `${config.environment.baseuri}${config.environment.apibase}/onbase/workflow/api-tasks/${this.taskid}/execute`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${this.identity.token.token_type} ${this.identity.token.access_token}`            
            },      
            redirect: 'follow',
            data : data
        };
        const response = await this.identity.client.request(request);
        return response;
        return true;
    }
    async getTask(){
        let data = '';
        let request = {
            method: 'get',
            url: `${config.environment.baseuri}${config.environment.apibase}/onbase/workflow/api-tasks`,
            headers: {
                'Authorization': `${this.identity.token.token_type} ${this.identity.token.access_token}`            
            },      
            redirect: 'follow',
            data : data
        };
        const response = await this.identity.client.request(request);
        return response;
    }
}

/*const apitask = {    
    load(indentity){

    },
    async getTask (client, token, taskname){
        let data = '';
        let request = {
            method: 'get',
            url: `${config.environment.baseuri}${config.environment.apibase}/onbase/workflow/api-tasks`,
            headers: {
                'Authorization': `${token.token_type} ${token.access_token}`            
            },      
            redirect: 'follow',
            data : data
        };
        const response = await client.request(request);
        
        console.log(task);
        return task.id;
    },
    async run (client, token, taskname, reqData){
        this.getTask(token, taskname)
        .then(resp => this.runTask(client, token, resp, reqData)
            .then(resp => console.log(resp)))
            .catch(err => console.error(err))
        .catch(err => console.error(err))
        return true;
    },
    async runTask(client, token, taskid, reqData){
        let data = JSON.stringify(reqData);
        let request = {
            method: 'get',
            url: `${config.environment.baseuri}${config.environment.apibase}/onbase/workflow/api-tasks${taskid}/execute`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token.token_type} ${token.access_token}`            
            },      
            redirect: 'follow',
            data : data
        };
        const response = await client.request(request);
        return response;
    }
}*/
module.exports = ApiTask;