//确认收货
$(".footer button").on("click",function(){
    $(".delPop").show()
})
//取消确认收货按钮
$(".delCancel").on("click",function(){
    $(".delPop").hide()
})
var url=window.location.href;
var orderId=getUrlValue(url, "id");//获取采购单id
var status=getUrlValue(url, "status"); //获取采购单状态
//toastBox("-------------------"+orderId);
//返回按钮
var payStatus=0;
$(".arrowLeft").on("click",function(){
    // 返回按钮根据点击不同状态返回对应的状态
    // 4、6、7分别为交易关闭状态，所以默认改为3才可以返回对应状态
    if(status=='4'||status=='6'||status=='7'){
        status='3';
        location.href='purchaseList.html?status='+status;
    }else {
        location.href='purchaseList.html?status='+status;
    }

})

//渲染页面
$.ajax({
    url:commonUrl+'orders/queryOrderInfoById?orderId='+orderId,
//	url:commonUrl+'/orders/queryOrderInfoById?orderId=ff80808162605e8401626078393e002a',
//    url:'http://local-mqps.zhiyiyunzhenshi.com/orders/queryOrderInfoById?orderId=40289fab6262202201626671c437006b',
    type:'post',
    async:false,
    success:function(data){
        var datas=eval("("+data+")");
        payStatus=datas.paymentType;
        var html="" ;
        var data=data;
        console.log(data)
        console.log(typeof data)
        console.log(datas.consigneeName)
        //订单编号
//        $(".identifiers").text(datas.orderNum)
        //订单编号
        $(".drug_total span").html(datas.remianTime);
        $(".drug_list").text(datas.orderNum)
//        $(".Purchasing").text("采购时间："+datas.dateCreated)
        $(".drug_purchase").text(datas.dateCreated)
//        $(".Noreceived").text(datas.orderStatus)//订单状态
        $(".drug_waits").text(datas.orderStatus)//订单状态
        $(".drug_off").text(datas.deliveryTime)//发货时间
        $(".drug_on").text(datas.receivingTime)//收货时间
        // 支付方式
        var pay_method='';
        if(datas.paymentType==1){
            pay_method="线上支付";
        }else if(datas.paymentType==2){
            pay_method="货到付款";
        }
        $(".drug_method").text(pay_method)//收货时间
        $(".drug_time").text(datas.payTime); //支付时间
        $('.drug_hour').text(datas.refundTime) //退款时间

        $(".particulars_header span").text(datas.orderStatus+"详情"); //标题
        $(".drug_totals").html(datas.currStatus);//退款状态
        var drug_page=$(window).height(); //页面高度
        var drug_top=$(".particulars_header").height(); //头部高度
        $(".return_content").height(drug_page-drug_top);
        // var drug_bottom=$(".drug_store").height(); //底部高度
        var drug_bottom=70; //底部高度
        console.log(status)
        if(status=='1'&&datas.orderStatus=="待收货"){
            $(".footer").css("display","block");
            $(".drug_store,.drug_payment,.drug_refund,.drug_again").css("display","none");
            $(".particulars").height(drug_page-drug_top-drug_bottom);
        } else if(status=='5'&&datas.orderStatus=="待支付"){
            $(".drug_payment").css("display","block");
            $(".footer,.drug_store,.drug_refund,.drug_again").css("display","none");
            $(".particulars").height(drug_page-drug_top-drug_bottom);
        } else if(status=='0'&&datas.orderStatus=="待发货"&&datas.paymentType==1){
            $(".drug_refund").css("display","block");
            $(".footer,.drug_store,.drug_payment,.drug_again").css("display","none");
            $(".particulars").height(drug_page-drug_top-drug_bottom);
        } else if(status=='7'&&datas.orderStatus=="交易关闭"){
            $(".drug_again").css("display","block");
            $(".footer,.drug_store,.drug_payment,.drug_refund").css("display","none");
            $(".particulars").height(drug_page-drug_top-drug_bottom);
        }
        if(status=='2'&&datas.yjrkBtnIsShow=="1"){ //收货状态和一键入库按钮根据不同状态计算当中内容高度
            $(".drug_store").css("display","block");
            $(".footer,.drug_payment,.drug_refund,.drug_again").css("display","none");
            $(".particulars").height(drug_page-drug_top-drug_bottom);
        }
        if(status=='2'&&datas.yjrkBtnIsShow=="0"||status=="undefined"||status=="0"){
            $(".particulars").height(drug_page-drug_top);
        }
        $(".ConsigneeName").text(datas.consigneeName)//收货人姓名
        $(".Consigneetel").text(datas.consigneePhone)//收货人联系电话
        $(".address").text(datas.consigneeAddress)//收货地址

        $(".Companyname").text(datas.companyName)//商家公司名称
        $(".Contacts").text(datas.linkman)//商家联系人
        $(".ContactNumber").text(datas.phone)//商家联系电话
        $(".orderFee span").text(datas.freight)//运费
        $(".orderTotal em").text(datas.orderBusTotalPrice); //订单总额：
        if(datas.words==""){
            $(".message").css("display","none")
        }else{
            $(".leave_words").text(datas.words)//留言
        }
        //药品详情
        $.each(datas.busData,function(key,ele){
            var star="",line=""
            if(ele.norms!="" && ele.scaler!="" && ele.smallUnit!="" && ele.unit!=""){
                star='<span>*</span>'
            }
            if(ele.unit!=""){
                line='<span>/</span>'
            }
//           根据当前入库状态加标识
            if(ele.isSave=="0"){
                var drug_img= '';
                var Label='';
            }else if(ele.isSave=="1"){
                $(".Drugs").css("text-align","center")
                var drug_img= '<img src="../img/drug_storage.png" class="drug_img">'; //已入库标识
                var Label='<span style="display:inline-block;width:30px"></span>'
            }
            html+='<ol class="main">'+
                '<li>'+
                '<p class="drugName">'+Label+''+ele.medicinalName+'</p>'+
                '<p class="companyName">'+Label+''+ele.medicinalCompanyName+'</p>'+
                '</li>'+
                '<li>'+
                '<p>'+ele.norms+''+star+''+ele.scaler+''+ele.smallUnit+''+line+''+ele.unit+'</p>'+
                '</li>'+
                '<li>'+
                '<p>'+ele.invalidTime+'</p>'+
                '</li>'+
                '<li><span>'+ele.price+'</span>元</li>'+
                '<li><span>'+ele.num+''+ele.unit+'</span></li>'+drug_img+
                '</ol>'
        })
        $(".header").after(html)
        var particularsheight=$(".particulars").height()
        var windowH=$(window).height()
        if(particularsheight>windowH){
            $(".Drug_details").css("padding-bottom","100px")
        }
    },
    error:function(){
        // alert("程序异常！")
        Toast();
    }

})

//根据状态显示发货时间和收获时间
$(function () {
    if(status=='1'&&payStatus==1){
        $(".drug_pay,.drug_day,.drug_deliver,.drug_total").css("display","block");
    }if(status=='1'&&payStatus==2){
        $(".drug_pay,.drug_deliver,.drug_total").css("display","block");
    }else if(status=='2'&&payStatus==1){
        $(".drug_pay,.drug_day,.drug_receive,.drug_deliver").css("display","block");
    }else if(status=='2'&&payStatus==2){
        $(".drug_pay,.drug_receive,.drug_deliver").css("display","block");
    }else if(status=='0'&&payStatus==1){
        // 待收货状态和线上支付
        $(".drug_pay,.drug_day").css("display","block");
    }else if(status=='0'&&payStatus==2){
        // 待收货状态和货到付款
        $(".drug_pay").css("display","block");
    }else if(status=='5'){
        $(".drug_pay").css("display","block");
    }else if(status=='3'&&payStatus==1||status=='6'&&payStatus==1||status=='7'&&payStatus==1){
        $(".drug_pay,.drug_day,.drug_return,.drug_totals").css("display","block");
    }else if(status=='3'&&payStatus==2){
        $(".drug_pay,.drug_day,.drug_totals").css("display","block");
    }
})


//确定确认收货按钮

$(".delConfirm,.drug_store button").on("click",function(){
//        点击确认按钮传给后台采购单id
//        通过判断当前的状态待收货还是已收货
    if(status=="1"){
        console.log(444)
        $.ajax({
            url:commonUrl+'orders/confirmOrder', //确认收货
            type:'post',
            data:{
                 'orderId': orderId
                // 'orderId': "ff808081652024460165207fb7390023"
            },
            success:function(data){
                console.log("返回数据msg：",)
                if(JSON.parse(data).code=="0000"){
                    // 托管代付申请
                    $.ajax({
                        url: commonUrl + "pay/substituteapplyMMB",
                        type: "post",
                        async: false,
                        data: {
                            'orderNo': $(".drug_list").html(),            //订单编号
                            'tradeCode': '3001',      //3001 代收消费 金
                            // 'amount': '0.01',           //金额
                            'amount': $(".orderTotal em").html(),           //金额
                            'fee': '0'                //手续费
                        },
                        success:function (obj) {
                            console.log("返回数据：",obj)
                            if(obj.code=='1200005'){     //1200005代表该托管代付订单已申请过
                                console.log("收获："+obj.data)
                            }
                        }
                    })
                }else if(JSON.parse(data).code=="9002"){
                    alert(6)
                    toastBox(data.msg)
                }
            },
            error:function(){
                // alert("程序异常！")
                Toast();
            }
        })
    }
//        弹出药品入库列表
    $(".delPop").hide();
    $(".drug_layer,.drug_storage").show();
    $.ajax({
        url:commonUrl+'orders/queryOrderInfoList',    //采购单列表
        type:'post',
        async:false,
        data:{
//                'orderBusinessId':"ff80808162605e8401626078393e002a"
            'orderBusinessId':orderId
        },
        success:function(obj){
            console.log(obj)
            var drug_new=JSON.parse(obj);
            console.log(drug_new)
            $(".drug_caption").find("label").html(drug_new.data.companyName);//商业公司名称
            var drug_list='';
            for(var i=0;i<drug_new.data.orderInfoList.length;i++){
                console.log(drug_new.data.orderInfoList[i].orderInfoId)
                drug_list+= '<div class="drug_row medicine_center"  date-id="'+drug_new.data.orderInfoList[i].orderInfoId+'">'+
                    '<div class="drug_choice">'+
                    '		<input type="hidden" name="" value="" checked="checked">'+
                    '		<label class=""></label>'+
                    '	</div>'+
                    '	<div class="drug_message">'+
                    '		<span>'+drug_new.data.orderInfoList[i].medicinalName+'</span>'+
                    '		<font>'+drug_new.data.orderInfoList[i].medicinalCompanyName+'</font>'+
                    '	</div>'+
                    '	<div class="drug_format">'+
                    '		<span>'+drug_new.data.orderInfoList[i].norms+'*'+drug_new.data.orderInfoList[i].scaler+''+drug_new.data.orderInfoList[i].smallUnit+'/'+drug_new.data.orderInfoList[i].unit+'</span>'+
                    '		<font>效期：'+drug_new.data.orderInfoList[i].invalidTime+'</font>'+
                    '	</div>'+
                    '	<div class="drug_price">'+
                    '		<input type="tel" name="" value="'+drug_new.data.orderInfoList[i].price+'">元'+
                    '	</div>'+
                    '	<div class="drug_number medicine_center">'+
                    '		<span class="drug_reduce"></span>'+
                    '		<input type="tel" name=""   value="'+drug_new.data.orderInfoList[i].num+'" maxlength="4" >'+
                    '		<span class="drug_add"></span>'+
                    '	</div>'+
                    '</div>'
            }
            $(".drug_bill").append(drug_list);
        }
    })
//        待入库药品显示在页面当中
    var page_current=$(window).height()-60;
    var page_content=$(".drug_storage").height();
    $(".drug_storage").css("top",(page_current-page_content)/2+60);
})

//    当点击复选框
$(document).on("click",".drug_bill .drug_choice label",function(){
    if($(this).attr("class")==""){
        $(this).prev().removeAttr("checked");
        $(this).addClass("drug_default");

    }else{
        $(this).prev().attr("checked","true");
        $(this).removeClass("drug_default");

    }
    allchk();
})
function allchk() {//设置全选复选框
    var chknum = $(".drug_bill .drug_choice").length;//选项总个数
    var chk = 0;//全选
    var chkGray = 0;//全部不选中
    $(".drug_bill").find(".drug_choice input").each(function () {
        console.log("1")
        if ($(this).attr("checked") == "checked") {
            console.log("2")
            chk++;
        }else{
            console.log("3")
            chkGray++;
        }
    });
    if (chknum == chk) {//全选
        console.log("1全选")
        $(".drug_all .drug_choice").find("label").removeClass("drug_default");
        $(".drug_all .drug_choice").find("input").attr("checked","true");
        $(".drug_once").removeClass("hide");
        $(".drug_notice").addClass("hide");
    }else if(chknum == chkGray){//全部不选中
        console.log("1全部不选中")
        $(".drug_all .drug_choice").find("label").addClass("drug_default");
        $(".drug_all .drug_choice").find("input").removeAttr("checked");
        $(".drug_once").addClass("hide");
        $(".drug_notice").removeClass("hide");
    } else {//不全选
        console.log("1不全选")
        $(".drug_all .drug_choice").find("label").addClass("drug_default");
        $(".drug_all .drug_choice").find("input").removeAttr("checked");
        $(".drug_once").removeClass("hide");
        $(".drug_notice").addClass("hide");
    }
}

//点击全选
$(".drug_all .drug_choice label").on("click",function(){
    if($(this).attr("class")==""){
        $(this).prev().removeAttr("checked");
        $(this).addClass("drug_default");
        $(".drug_bill .drug_choice input").removeAttr("checked");
        $(".drug_bill .drug_choice label").addClass("drug_default");
        $(".drug_once").addClass("hide");
        $(".drug_notice").removeClass("hide");
    }else{
        $(this).prev().attr("checked","true");
        $(this).removeClass("drug_default");
        $(".drug_bill .drug_choice input").attr("checked","true");
        $(".drug_bill .drug_choice label").removeClass("drug_default");
        $(".drug_once").removeClass("hide");
        $(".drug_notice").addClass("hide");
    }
})

//    点击加号 每次数量+5
$(".drug_bill").on("click",".drug_number .drug_add",function(){
    var drug_num=parseInt($(this).prev().val());
    if(drug_num>=9994){
        $(this).prev().val(9999);
        toastBox("最多只能入库9999件");
    }else{
        var drug_val=parseInt($(this).prev().val());
        $(this).prev().val(drug_val+5);
    }
})

//    点击input只能输入整数
$(".drug_bill").on("input propertychange",".drug_number input",function(){
    var r = /^-?\d+$/ ;//正整数
    if($(this).val() !=''&&!r.test($(this).val())){
        $(this).val("");  //正则表达式不匹配置空
    }
})



//    点击减号 每次数量-1
$(".drug_bill").on("click",".drug_number .drug_reduce",function(){
    var drug_num=parseInt($(this).next().val());
    if(drug_num<=1){
        $(this).prev().val(9999);
        toastBox("数量不可为0");
    }else{
        var drug_val=parseInt($(this).next().val());
        $(this).next().val(drug_val-1);
    }
})

//    单价保留4位整数，两位小数
$(".drug_bill").on("input propertychange",".drug_price input",function(){
    var v=amount($(this).val());
    var reg=/^\d+$/;
    if(reg.test(v)==true){
        $(this).removeAttr("maxlength");
        $(this).attr("maxlength","7");
        var reg = /^\d{1,4}$/;
        if(reg.test(v)==false){
            v=$(this).val().substring(0,4);
            $(this).val(v);
        }
        return true;
    }else{
        console.log(2)
        $(this).val(v);
        $(this).removeAttr("maxlength");
        $(this).attr("maxlength","7");
        return false;
    }
})



//    点稍后入库
$(".drug_wait").on("click",function(){
    $(".drug_layer,.drug_storage").hide();
    window.location.href="purchaseList.html?status="+status;
})


//    点击立即入库
var getlocalStorage={//取值
    "clinicIdVal":localStorage.getItem("clinicIdStorage"), //存下clinicId
    "doctorIdVal":localStorage.getItem("clinicEmployIdStorage")  //存下clinicEmployId
}
var drug_arr=[];
var drug_flag=0;
$(".drug_once").on("click",function(){
    console.log(1111)
    if(drug_flag==0){
        drug_flag=1;
        drug_arr=[];
        $(".drug_bill .drug_choice input").each(function(){
            if($(this).attr("checked")){
                var orderInfoId=$(this).parents(".drug_row").attr("date-id");
                var price=$(this).parents(".drug_row").find(".drug_price input").val();//单价
                var num=$(this).parents(".drug_row").find(".drug_number input").val();//数量
                var drug_obj={orderInfoId: orderInfoId,price: price,num: num};
                drug_arr.push(drug_obj);
            };
        })
//        传给后台前台选择的药品
        var listObj=JSON.stringify(drug_arr);
        $.ajax({
            url:commonUrl+'orders/addOrderInfoListToYjsForYjrk',
            type:'post',
            data:{
//                'orderBusinessId':"ff80808162605e8401626078393e002a",
                'orderBusinessId':orderId,
//                'clinicId':'110288f4a5160a0520151656ed0panda',
                'clinicId':getlocalStorage.clinicIdVal,
//                'sysUserId':'30288f4a5160a0520151656ed0panda1',
                'sysUserId':getlocalStorage.doctorIdVal,
                'orderInfoList':listObj
            },
            success:function(data){
                var data=JSON.parse(data)
                if(data.code=="0000"){
                    toastBox("入库成功！");
                    setTimeout('window.location.href="purchaseList.html?status="+status;',2100);
                    setTimeout(function(){
                        drug_flag=0;
                    },2200);
                }else{
                    toastBox("入库失败！");
                    setTimeout(function(){
                        drug_flag=0;
                    },2200);
                }
            }
        })
    }


})



//吐司提示
function Toast(){
    $(".dialogue_alert").show();
    setTimeout(" $('.dialogue_alert').hide()",2000)  //toast提示2秒消失
    $(".dialogue_alert p").html("程序异常！");
}

	// 申请退款
$(".drug_refund button,.drug_again button").click(function () {
    document.getElementById("delLayer").style.display="block";
    document.getElementById("delLayer").getElementsByTagName("button")[1].style.display='none';
    document.getElementById("delLayer").getElementsByTagName("button")[2].style.display='inline-block';
    document.getElementById("delLayer").getElementsByTagName("section")[0].innerHTML="确认退款吗？";
})

// 确定申请退款
$("#delLayer .returnConfirm").click(function () {
    document.getElementById("delLayer").style.display="none";
    // 第一步： 获得XMLHttpRequest对象
    var ajax=new XMLHttpRequest();
    // 第二步： 设置状态监听函数

    // 第三步： open一个链接
    var get_address=commonUrl+"pay/refundOrder";
    ajax.open("POST",get_address,true);//true异步请求，false同步
    // 使用send方法传递参数使用的是POST方法，需要设定Content-Type头信息，模拟HTTP    POST方法发送一个表单，这样服务器才会知道如何处理上传的内容
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // 第四步： send一个请求。 可以发送对象和字符串，不需要传递数据发送null
    // var get_data={
    //     orderNum:$(".drug_list").html(),  //退款申请
    //     amount:'0.01' //退款金额
    // }
    ajax.send("orderNum="+$(".drug_list").html()+"&amount="+$(".orderTotal em").html()); //测试环境和正式环境放开
    // ajax.send("orderNum="+$(".drug_list").html()+"&amount="+0.01); //开发环境使用
    ajax.onreadystatechange=function () {
        console.log(ajax.readyState);
        console.log(ajax.status);
        // 第五步：在监听函数中，判断readyState=4 && status=200表示请求成功
        if(ajax.readyState==4 && ajax.status==200){
            // 第六步： 使用responseText、responseXML接受响应数据，并使用原生JS操作DOM进行显示
            console.log(ajax.responseText);
            console.log(ajax.responseXML);// 返回不是XML，显示null
            // JOSN.parse() 纯粹的将JSON字符串解析为数组或对象
            console.log(JSON.parse(ajax.responseText));
            console.log(eval("("+ajax.responseText+")"));
            var data=JSON.parse(ajax.responseText);
            if(data.code=='0000'){
                $(".particulars").addClass("hide");
                $(".return_content").removeClass("hide");
                // 申请成功退款金额
                $(".drawbackOne_num").html($(".orderTotal em").html())
            }else if(data.code=='9003'){
                $(".particulars").addClass("hide");
                toastBox(data.data);
            }else if(data.code=='9007'){
                $(".particulars").addClass("hide");
                toastBox(data.data);
            }
        }
    }
})

// 点击查看订单
$(".drawbackThree_look").click(function () {
    // 跳转到采购单，交易关闭当前状态所以后面加参数status为3
    location.href='purchaseList.html?status='+3;
})

// 去支付
$(".drug_payment button").click(function () {
    var location_address=window.location.href.split("html")[0]
// 托管代收申请
    $.ajax({
        url:commonUrl+'pay/collectionapplyMMB',
        type:'get',
        dataType:'json',
        data:{
            // sysUserId:'40289d3a651eb2ec01651eb46dd60003',
            orderNo:$(".drug_list").html(),  //订单编号
            tradeCode:'3001',
            // amount:'0 .01',  //金额
            amount:$(".orderTotal em").html(),  //金额
            frontUrl:location_address+'html/purchaseList.html?clinicId='+getlocalStorage.clinicIdVal, //前台回调地址
            // frontUrl:"https://www.baidu.com/", //前台回调地址
            industryCode:'1930',  //行业代码
            industryName:'行业名称',  //医疗
            visitFrom:'1',  //访问终端类型 1.移动端 2.PC端
            returnUrl:location_address+'html/purchaseList.html?clinicId='+localStorage.getItem("clinicIdStorage")+"&clinicName="+localStorage.getItem("clinicNameStorage")+"&clinicEmployId="+localStorage.getItem("clinicEmployIdStorage")+"&realName="+localStorage.getItem("realNameStorage")
        },
        success:function (res) {
            if(res.code=="0000"){
                window.location.href=res.data;
            }
        }
    })
})
