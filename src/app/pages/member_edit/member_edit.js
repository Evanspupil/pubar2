import tpl from './member_edit.jade'
import './member_edit.scss'
import { angular, ionic } from 'library'
import imgSrc from 'assets/images'

export default angular.module('member_edit',[ionic])
    .config(function ($stateProvider) {
        "ngInject"
        $stateProvider
            .state('member_edit', {
                url: '/member_edit',
                controllerAs: 'vm',
                controller: Member_editController,
                template: tpl(),
                resolve:{
                    userInfo:function(application,resourcePool){
                        return resourcePool.getUserInfo.request({
                            userid:application.userId
                        })
                    }
                }
            })
    });


class Member_editController {
    constructor ($ionicActionSheet,userInfo,$ionicLoading,resourcePool,application,$http,$scope) {
        "ngInject"
        this.name = 'member_edit';
        this.actionSheet = $ionicActionSheet;
        this.resource = resourcePool;
        this.loading = $ionicLoading;
        this.headHost = application.headHost;
        this.http = $http;
        this.background = userInfo.data.info.bgpic;
        this.pics = userInfo.data.info.pic || [];
        this.actionSheet = $ionicActionSheet;
        let _this = this;

        this.userInfo = userInfo.data.info;


        this.personStatus = [{
            id:0,
            text:'单身'
        },{
            id:1,
            text:'已婚'
        },{
            id:2,
            text:'离异'
        },{
            id:3,
            text:'保密'
        }];
        const _status = this.userInfo.sentiment || 0;
        this.initStatus = {id:_status};
        $scope.uploadImages = function(){

            var fileObject = document.getElementById('uploadImages');
            // _this.tempUrl = window.URL.createObjectURL(fileObject.files[0]);
            //

            var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
            var form = new FormData();
            form.append('uploadFile',document.getElementById('uploadImages').files[0]);

            $http({
                url:'api/user/upload_pic',
                params:{
                    userid:userInfo.id
                },
                data:form,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                method:'post'
            }).then(res=>{
                if(res.data.status ==1){
                    _this.pics.push(res.data.info) ;
                }
            });
        };
        $scope.uploadBackground = function(){

            var fileObject = document.getElementById('uploadBackground');
            _this.tempUrl = window.URL.createObjectURL(fileObject.files[0]);

            let t = this;
            var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
            console.log(userInfo);
            var form = new FormData();
            form.append('uploadFile',document.getElementById('uploadBackground').files[0]);

            $http({
                url:'api/user/upload_bgpic',
                params:{
                    userid:userInfo.id
                },
                data:form,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                method:'post'
            }).then(res=>{

                if(res.data.status !=1){
                    $ionicLoading.show({
                        template:res.data.info,
                        duration:1000
                    })
                }
            });
        }
    }
    changeSex(){
        let t = this;
        let $ionicActionSheet = t.actionSheet;
        $ionicActionSheet.show({
            buttons: [
                { text: '男' },
                { text: '女' }
            ],
            titleText: '修改性别',
            cancelText: '取消',
            buttonClicked: function(index) {
                if(index===0){
                    t.userInfo.sex=1;
                }
                if(index===1){
                    t.userInfo.sex=0;
                }
                t.resource.userEdit.request({
                    sex:t.userInfo.sex,
                    userid:t.userInfo.id
                }).then(res=>{
                    console.log(res);
                    if(res.data.status != 1){
                        t.loading.show({
                            template:'Error：'+res.data.info,
                            duration:1500
                        })
                    }
                },()=>{
                    t.loading.show({
                        template:'系统繁忙，请稍后再试',
                        duration:1500
                    })
                });

                return true;
            }
        });

    }
    showMenu(name){
        let $ionicActionSheet = this.actionSheet;
        let resourcePool = this.resource;
        let _this = this;
        $ionicActionSheet.show({
            destructiveText: '删除',
            titleText: '删除此张照片吗?',
            cancelText: '取消',
            destructiveButtonClicked:function(){
                resourcePool.deleteUserImg.request({
                    pic:name
                }).then(res=>{
                    if(res.data.status ==1){
                        for(var i =0;i<_this.pics.length;i++){
                            if(_this.pics[i] == name){
                                _this.pics.splice(i,1);
                            }
                        }
                    }else{
                        _this.loading.show({
                            template:res.data.info,
                            duration:1000
                        })
                    }
                });
                return true;
            }
        });
    }

    /**
     * 修改情感状况
     */


    changeStatus(){
        let _initValue = this.initStatus;
        let _this = this;
        this.resource.userEdit.request({
            sentiment:_initValue.id
        }).then((res)=>{
            if(res.status != 1){
                _this.loading.show({
                    template:res.data.info,
                    duration:1000
                })
            }
        });



    }

}