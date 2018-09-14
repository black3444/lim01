$(document).ready(function () {
	
	//faqUpDown �ʱ�ȭ
	$(".faq_lst > dd").not(":first").hide();
	$(".faq_lst > dt:first").addClass("is_select");

	//tabArea1 �ʱ�ȭ
	$(".tab_area1_cont").not(":first").hide();	
	$(".tab_area1 > li:first").addClass("is_select");

	//faqUpDown
	faqUpDown();

	//tabArea1 �ʱ�ȭ
	tabArea1();
	
	//checkboxChng
	checkboxChng();

});

//faqUpDown
function faqUpDown(){
	$(".faq_lst dt > a").click(function(){
		var $parent = $(this).parent();	

		//�ʱ�ȭ
		$(".faq_lst dt").removeClass("is_select");
		
		//upDown
		$parent.addClass("is_select").next().slideDown(300);
		$parent.siblings("dt").removeClass("is_select").next().slideUp(300);
		return false;
	});
}

//tabArea1
function tabArea1(){
	$(".tab_area1 > li > a").click(function(){
		var $idx = $(this).parent().index();
		var $tabLeng = $(".tab_area1 > li").length;

		$(this).parent().addClass("is_select").siblings().removeClass("is_select");
		if($tabLeng < 3){
			for(i=0;i<=$tabLeng;i++){
				if(i==$idx){
					$(".tab_area1_cont").hide();	
					$(".tab1_cont"+(i+1)).show();
				}
			}
		}
		return false;
	});
}

function checkboxChng(){
	//checkbox
	console.log("체크박스 진입")
	$(".checkbox > span > input").click(function(){
		var cls = $(this).parent().parent().prop("class");
		console.log("cls : " + cls)
		if($(this).prop("checked")){
			$(this).parent().parent().addClass("is_checked");
		}else{
			$(this).parent().parent().removeClass("is_checked");
		}		
	});

	//radiobox
	$(".radiobox > span > input").click(function(){
		var cls = $(this).parent().parent().prop("class");
		console.log("cls : " + cls)
		if($(this).prop("checked")){
			$(this).parent().parent().addClass("is_checked");
		}else{
			$(this).parent().parent().removeClass("is_checked");
		}		
	});
}