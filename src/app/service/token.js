/**
 * Created by wj on 2016/6/6.
 * happy everyday!
 *
 * TOKEN = md5(模块+时间戳+用户ID+登录返回的token)
 */
'use strict'
import md5 from 'md5'
import {angular,ionic} from 'library'


class Token {
    // 用户名默认为0
    constructor(){
        'ngInject';
        this._userId = 0
        this._token = ''
    }

    get timeStamp(){
        // 转化成10位数的时间戳
        return parseInt(new Date().getTime() / 1000)
    }

    tokenString(module){
        if(module !== 'Meb' && this._userId === 0){

        }
        if(!!this._userId && !this.loginToken) throw new Error('没有取到loginToken，请检查');

        let timeStamp = this.timeStamp;
        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        let userid = userInfo ? userInfo.id : 0;
        // let str = module + timeStamp + userid + this.loginToken;
        let str = module + timeStamp + userid + this.loginToken;
        console.log(`module:${module}  userid:${userid}  timeStamp:${timeStamp}  loginToken:${this.loginToken}`)
        let token = md5(str.trim());
        return { token,timeStamp }
    }

    // setter and getter for loginToken
    // 也许要从localStorage 里面取值
    set loginToken(t){
     
        this._token = t
    }

    get loginToken(){
        var token = JSON.parse(window.localStorage.getItem('userInfo'));
        if(!token) token = '0';
        token = token.token;
        return token;
    }

    set userId(id){
        this._userId = id
    }

    get userId(){
        return this._userId
    }

    getToken(module = 'Meb'){
        if(this._check(module)) this._reset();
        return this.tokenString(module)
    }

    _check(module){
        //处理 module : Meb , _userId 存在  loginToken存在时 return true  也就是需要重新登陆和注册时
        return module === 'Meb' && this._userId !== 0 && !!this.loginToken
    }

    /**
     * 重置_userId和loginToken
     */
    _reset(){
        this._userId = 0;
        this.loginToken = ''
    }
    
    loginAfter(id,token){
        this.userId=id;
        this.loginToken=token
    }

}
let token = new Token();
export default token 
