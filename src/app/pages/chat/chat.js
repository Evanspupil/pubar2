import tpl from './chat.jade'
import './chat.scss'
import { angular, ionic } from 'library'
import imgResource from 'assets/images'
import md5 from 'md5'
export default angular.module('chat',[ionic])
    .config(function ($stateProvider) {
        "ngInject"
        $stateProvider
            .state('chat', {
                url: '/chat/:id',
                controllerAs: 'vm',
                controller: ChatController,
                template: tpl(),
                resolve:{
                    friendInfo:function(resourcePool,$stateParams){
                        return resourcePool.getUserInfo.request({
                            fid:$stateParams.id
                        })
                    }
                }
            })
    });


class ChatController {
    constructor ($ionicScrollDelegate,application,$stateParams,$scope,friendInfo,socket,resourcePool) {
        "ngInject"
        this.name = 'chat';
        this.scrollHandle = $ionicScrollDelegate;
        ChatController.productItem = imgResource.productItem;
        this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        this.friendInfo = friendInfo.data.info;
        this.chatsMsg = [];
        this.application = application;
        this.stateParams = $stateParams;
        this.scope = $scope;
        this.socket = socket;
        this.headHost = application.headHost;
        this.msgInfo = {
            sender:'00',
            nickname:'Anna sui',
            content:'',
            avatar:'',
            id:'sdf'
        };


        var _this = this;
        this.fUserInfo = {
            sender:_this.friendInfo.id,
            nickname:_this.friendInfo.nickname,
            content:'',
            avatar:_this.friendInfo.avatar,
            createtime :''

        }
        var input = document.getElementById('textComment');
        input.onfocus = function () {
            _this.scrollHandle.resize();
        };


        socket.on('sendSid',function(res){
            _this.chatsMsg.push({
                content:res.mess,
                createtime:new Date().getTime()/1000,
                sender:_this.fUserInfo.id,
                nickname:_this.fUserInfo.nickname,
                avatar:_this.fUserInfo.headIcon
            });
            _this.scrollHandle.resize();
            _this.scrollHandle.scrollBottom(true);

        });

        /**
         * 加载聊天记录
         */
        resourcePool.getMsgRecord.request({
            reid:$stateParams.id
        }).then(res=>{

            _this.chatsMsg = res.data.info || [];
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollBottom(true);
        })

    }


    /**
     * 发送消息
     */
    sendMsg(){
        let _this = this;
        let $stateParams = _this.stateParams;
        let application = this.application;
        application.im.send($stateParams.id,_this.msgInfo.content).then(res=>{

            _this.chatsMsg.push({
                sender:_this.userInfo.id,
                nickname:_this.userInfo.nickname,
                content:document.getElementById('textComment').value,
                avatar:_this.userInfo.headIcon,
                createtime:new Date().getTime()/1000
            });
            _this.scrollHandle.resize();
            _this.scrollHandle.scrollBottom(true);
            document.getElementById('textComment').value='';
        });
    }
}