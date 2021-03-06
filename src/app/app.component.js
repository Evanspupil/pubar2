/**
 * Created by wj on 2016/5/28.
 */
import { angular, ionic } from "library"
import cart from './component/cart/cart.component'
import numberPick from './component/numberPick/numberPick.component'
import location from './directive/location/location'
import filter from './directive/filter/filter.tpl'
import shortBtn from './directive/shortBtn/shortBtn.directive'
import share from './directive/share/share.directive'
import collect from './directive/collect/collect.directive'
import sex from './directive/sex/sex.directive'
import map from './directive/map/map.directive'
import nodata from './directive/nodata/nodata'
import codebox from './directive/codeBox/codebox.directive'
import password from './directive/password/password.directive'
import shareList from './directive/shareList/share.list'
import preview from  './directive/viewImage/viewImage.directive'


export default angular.module('app.component', [ionic])
    .directive('cart', cart)
    .directive('numberPick',numberPick)
    .directive('filter',filter)
    .directive('location',location)
    .directive('sBtn',shortBtn)
    .directive('share',share)
    .directive('collect',collect)
    .directive('sex',sex)
    .directive('map',map)
    .directive('nodata',nodata)
    .directive('codebox',codebox)
    .directive('password',password)
    .directive('shareList',shareList)
    .directive('ngPreview',preview)