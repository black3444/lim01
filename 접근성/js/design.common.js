$(document).ready(function () {
	
	//gnb 마지막 메뉴 depth2 box 위치 right 처리
	$(".header_lst > li:nth-last-child(1),.header_lst > li:nth-last-child(2)").find(".header_depth2_sec").css("right","0");

	//gnbMenu
	gnbMenu()

	//leftNavTab 초기화
	//$(".lnb_nav_cont").hide();	
	$(".lnb_nav_cont:first").show();
	$(".lnb_tab_lst > li:first").addClass("is_select");

	//leftNavTab
	lnbNavTab();

});

//gnbMenu
function gnbMenu(){
	$(".header_lst > li").removeClass("is_select");
		
	$(".header_lst > li > a").mouseover(function(){
		$(".header_lst > li").removeClass("is_select");
		var $idx = $(this).parent().index();
		$(this).parent().find(".header_depth2_sec").slideDown(100).parent().siblings().find(".header_depth2_sec").slideUp(100);
		$(this).parent().addClass("is_select").parent().siblings().removeClass("is_select");
	}).focus(function(){
		$(".header_lst > li").removeClass("is_select");
		$(this).parent().find(".header_depth2_sec").slideDown(100).parent().siblings().find(".header_depth2_sec").slideUp(100);
		$(this).parent().addClass("is_select").parent().siblings().removeClass("is_select");
	});

	$(".header_lst").mouseleave(function () {
		$(".header_depth2_sec").slideUp(100);
		$(".header_lst > li").removeClass("is_select");
	});

	$(".header_lst > li:nth-last-child(1) .header_depth2_lst > li:nth-last-child(1) .bookmark_link").blur(function(){
		$(".header_depth2_sec").slideUp(100);
		$(".header_lst > li").removeClass("is_select");
	});

}

//leftNavTab
function lnbNavTab(){

	$(".lnb_tab_lst > li > a").click(function(){
		var $idx = $(this).parent().index();
		var $lnbTabLi = $(".lnb_tab_lst > li").length;

		for(i=0;i<=$lnbTabLi;i++){
			if(i==$idx){
				$(this).parent().find(".lnb_nav_cont").slideDown(100).end().siblings().find(".lnb_nav_cont").slideUp(100);
				$(this).parent().addClass("is_select").end().parent().siblings().removeClass("is_select");
			}
		}
		return false;
	}).focus(function(){
		var $idx = $(this).parent().index();
		var $lnbTabLi = $(".lnb_tab_lst > li").length;

		for(i=0;i<=$lnbTabLi;i++){
			if(i==$idx){
				$(this).parent().find(".lnb_nav_cont").slideDown(100).end().siblings().find(".lnb_nav_cont").slideUp(100);
				$(this).parent().addClass("is_select").end().parent().siblings().removeClass("is_select");
			}
		}
	});

}
