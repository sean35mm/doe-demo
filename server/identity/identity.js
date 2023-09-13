process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const config = require('../config/config.json');
const axios = require('axios');
const qs = require('qs');
const wrapper = require('axios-cookiejar-support').wrapper;
const CookieJar = require('tough-cookie').CookieJar;
const jar = new CookieJar();
const client = wrapper(axios.create({jar}));


const identity = {
    username : "",
    password : "",
    token : "",
    client : client,
    async connect (username, password){
        identity.username = username;
        identity.password = password;
        let data = qs.stringify({
        'grant_type': `${config.environment.grant}`,
        'username': username,
        'password': password,
        'scope': `${config.environment.scope}`,
        'client_id': `${config.environment.clientid}`,
        'client_secret': `${config.environment.secret}`,
        'tenant': `${config.environment.tenant}` 
        });
        let request = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${config.environment.baseuri}${config.environment.idpbase}/connect/token`,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };        
        const response = await client.request(request);   
        this.token = await response.data;
        return this.token;
    },    
    async getCookie(){
        let data = '';
        let request = {
            method: 'get',
            url: `${config.environment.baseuri}${config.environment.apibase}/onbase/core/document-type-groups`,
            headers: {
                'Authorization': `${this.token.token_type} ${this.token.access_token}`            
            },      
            redirect: 'follow',
            data : data
        };
        const response = await client.request(request);
        return response.data;
    },
    async heartbeat(){
        let request = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${config.environment.baseuri}${config.environment.apibase}/onbase/core/session/heartbeat`,
            withCredentials: true,
            headers: {
                'Authorization': `${this.token.token_type} ${this.token.access_token}`             
            }            
        };
        const response = await client.request(request);
        return response.data;
    },
    async disconnect(){
        let request = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${config.environment.baseuri}${config.environment.apibase}/onbase/core/session/disconnect`,
            headers: {
                'Authorization': `${this.token.token_type} ${this.token.access_token}`                
            },
            redirect: 'follow',            
        };
        const response = await client.request(request);
        return response.data;
    }
}
module.exports = identity;