/*jshint multistr: true */
/**
 * @namespace Yjs [공통 모듈]
 */
var Yjs= {
  /**
   * [ver 스크립트 version]
   * @type {String}
   */
  ver: '1.0.0',  // 스크립트 version

  dependency: {
    jQuery: {
      version: '1.12.4',
      //url: '//code.jquery.com/jquery-1.12.4.min.js',                    // 로컬 설치시 로딩 속도 향상
      url: '//www.seoul.go.kr/v2016/js/jquery-1.11.1.min.js',                    // 로컬 설치시 로딩 속도 향상
      
    }
  },
  /**
   * [JQ jQuery deffered Object 변수]
   * @type {[Object]}
   */
  JQ: null,

  /**
   * [Gnb 공통 Gnb Object]
   * @type {Object}
   */
  Gnb: {},

  /**
   * [Board 공통 게시판 Object]
   * @type {Object}
   */
  Board: {},

  /**
   * [Conf Yjs Configuration 정보 Object]
   * @type {Object}
   */
  Conf: {     // 환경 관련
    protocol: null,       // ajax 통신은 https -> http가 안되므로 체크
    enable: {
      ajax: false,        // cors 관련 ajax 사용 가능 여부
      cookie: false,      // 1차 도메인 쿠키 사용 가능 여부,
      JQ: false,          // jQuery.noConflict 처리 사용 가능 여부
    },
    domains: {
      org: '',
      target: 'seoul.go.kr'
    },

    /**
     * [init 공통 모듈 초기화]
     * @return {[type]} [description]
     */
    init: function() {
      var conf = Yjs.Conf;
      var thisDomain = document.domain;
      var func = {
        success: function(str){
          conf.enable.ajax = true;
          conf.enable.cookie = true;
          if (typeof str !== 'undefined') Yjs.Util.console.log(str);
        },
        fail: function(str) {
          conf.enable.ajax = false;
          conf.enable.cookie = false;
          if (typeof str !== 'undefined') Yjs.Util.console.log(str);
        }
      };
      // 같은 도메인
      if (thisDomain === conf.target) {
        func.success();
      }
      // 2차 도메인,  // 서버에서 cors 처리 시 true
      else if (thisDomain.indexOf(conf.domains.target) > -1) {
        func.success();
      }
      // 다른 도메인
      else {
        func.fail();
      }
      conf.domains.org = thisDomain;
      conf.protocol = document.location.protocol;
    }
  },

  /**
   * [Util Yjs 공통 함수 Object]
   * @type {Object}
   */
  Util: {
    /**
     * [loadScript 스크립트 동적 로딩 함수]
     * @param  {[String]}   url    [url]
     * @param  {Function} callback [로딩 완료 후 callback 함수]
     * @return {[type]}            [description]
     */
    loadScript: function(url, callback){
      var script = document.createElement('script');
  	  script.src = url;
  	  var head = document.getElementsByTagName('head')[0] || document.documentElement;
  	  var done = false;
  		// 콜백함수가 있는 경우
  		if (typeof callback === 'function') {
  			script.onload = script.onreadystatechange = function() {
  				if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
  					done = true;
  					// 로딩 완료 후 콜백 실행
  					callback();
  					script.onload = script.onreadystatechange = null;
  				}
  			};
  		}
  		head.appendChild(script);
    },
    /**
     * [loadCss css 라이브러리 로딩 함수]
     * @param  {[String]} url [css url]
     * @return {[type]}     [description]
     */
    loadCss: function(url){
      if(document.createStyleSheet) {
    	  try { document.createStyleSheet(url); } catch (e) {}
      }
      else {
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.media = "all";
        css.href = url;
        document.getElementsByTagName("head")[0].appendChild(css);
      }
    },
    /**
     * [loadJQuery jQuery 버전 체크 후 스크립트 로딩, 버전 충돌 방지]
     * @param  {[type]} jQueryUrl [jquery url]
     * @return {[type]}           [description]
     */
     loadJQuery: function(jQueryUrl){
       var sameJquery = false;
       var jqVersion = '';

       if (typeof jQuery !== 'undefined' && jQuery.fn.jquery === Yjs.dependency.jQuery.version) {
           sameJquery = true;
       }
       else if (typeof $ !== 'undefined') {
         try{
           if ($.fn.jquery === Yjs.dependency.jQuery.version) {
             sameJquery = true;
           }
         } catch(e){}
       }

       if (! sameJquery) {
         // 스크립트 로드
         this.loadScript(jQueryUrl, function(){
           Yjs.JQ = jQuery.noConflict(true);   // complete후 callback => jquery version 충돌 방지, $, jQuery 사용;
           Yjs.Conf.enable.JQ= true;
         });
       }
       else {
         Yjs.JQ = jQuery;
         Yjs.Conf.enable.JQ= true;
       }
     },
    /**
     * [getRequestUrl api 서버 Full url 리턴 ,http https 구분 필요]
     * @param  {[String]} url [API 서버 상대 경로]
     * @return {[String]}     [api 서버 Full url 리턴]
     */
    getRequestUrl: function(url) {      //
      return Yjs.Conf.protocol+'//'+url;
    },
    /**
     * [console ie8 에러 방지용 메시지]
     * @type {Object}
     */
    console: {
      log: function(str){
        if (console) console.log(str);
      }
    }
  },

  /**
   * [Ajax jquery Ajax Wrapper]
   * @param {[type]} method   [method]
   * @param {[type]} url      [url]
   * @param {[type]} data     [data]
   * @param {[type]} opt      [기타 정보 Object]
   * @return {[Object]}       [jquery Ajax Wrapper]
   */
  Ajax: function(method, url, data, opt){
		var _url;
		if (url.substr(0,2) === '//') {
			_url = url;
		}
		else {
			_url = Yjs.Util.getRequestUrl(url);
		}

      var obj = {
        method: method,
        url: _url,
        data: data,
        dataType: 'json'
      };
      if (typeof data !== 'object') delete obj.data;

      if (typeof opt === 'object') {
        if (typeof opt.dataType !== 'undefined') obj.dataType = opt.dataType;
        if (typeof opt.timeout !== 'undefined') obj.timeout = opt.timeout;         // 기본 request 타임 아웃 시간
      }

      if (! this.Conf.enable.ajax ) {
          obj.mehtod = 'get';
          obj.dataType = 'jsonp';
      }
      return this.JQ.ajax(obj);
  },
  /**
   * [init Yjs 라이브러리 초기화 ]
   * @return {[type]} [description]
   */
  init: function() {
    // Conf Object 초기화
    this.Conf.init();
    // jquery 1.12.4 js 로딩
    this.Util.loadJQuery(this.dependency.jQuery.url);
  }
};

(function() {
  // Yjs 공통 모듈 초기화
  Yjs.init();
}());




/**
 * [Gnb Yjs Gnb 모듈]
 * @type {Object}
 */
Yjs.Gnb = {
  isLoadComplete: false,  // 로딩 complete

  /**
   * [jqObj jquery dom 세팅 Object]
   * @type {Object}
   */
  jqObj: {
    container: null,    // gnb 삽입될 container
    pluginRoot:null,    // gnb root
    logo: null,         // logo
    news: null,         // 뉴스 영역
    menu: null,         // sub 메뉴 영역
    subMenuBtn: null,    // sub 메뉴 버튼
  },

  /**
   * [Conf Gnb 환경 Object]
   * @type {Object}
   */
  Conf: {
    gid: '',  // 사이트 코드 (5자리)
    url: {
      data: '//www.seoul.go.kr/seoulgnb/seoulgnb2.html',          // data url
      css: '//www.seoul.go.kr/seoulgnb/seoul-common-gnb.css',  // css url
    },
    gnbType: '1',       // 기본형 1, white형 2,
    ajaxTimeout: 5000,  // ajax 응답 timeout 시간
    rollingSec: 4000,   // 상단 rolling 시간
    useCustomCss: false // custom css 적용 여부
  },

  initObj: {
    gid: '',
    container: '',
    opt: ''
  }, 

  setInitObj: function(gid, container, opt) {
    this.initObj.gid = gid;
    this.initObj.container = container;
    this.initObj.opt = opt;
  },

  getInitObj: function() {
    return this.initObj;
  },

  retry: function() {
    var obj = this.initObj,
        _gid = obj.gid,
        _container = obj.container,
        _obj = obj.opt;
    
    this.init(_gid,_container, _obj);
  },

  /**
   * [wiseLink wiselink click 적용 Object]
   * @type {Object}
   */
  wiseLink: {
    baseUrl: '//www.seoul.go.kr/seoulgnb/seoulgnblog.html?',  // ex) seoul.go.kr/seoulgnb/seoulgnb.html?gid=aaaaaa&kind=welfare&url=welfare.seoul.co.kr'                                                     // wise link용 url

    // jquery object 링크 생성
    setUrl: function(jqObj, kind, link){
      var gid = Yjs.Gnb.Conf.gid,
          _kind = (typeof kind !== 'undefined')? kind : jqObj.data('kind'),
          _link = (typeof link !== 'undefined')? link : jqObj.attr('href');

      var url = this.baseUrl+'gid='+gid+'&kind='+_kind+'&link='+_link;
      jqObj.attr('href', url);
    },

    // kind와 링크만으로 리턴
    setTempUrl : function(kind,link){
      return this.baseUrl+'gid='+Yjs.Gnb.Conf.gid+'&kind='+kind+'&link='+link;
    },

    //.wise-link 일괄 적용
    setUrljqObjs: function(objs) {
      var _$ = Yjs.JQ,                    // jquery deffered Obj
          _wiseLink = Yjs.Gnb.wiseLink;   // 링크 obj;

      objs.each(function(){
        _wiseLink.setUrl(_$(this));
      });
    }
  },

  /**
   * [customCss Gnb custom css 적용 Object]
   * @type {Object}
   */
  customCss: {
    /**
     * [data custom data 탬플릿]
     * @type {Object}
     */
    data: {
      root: {
        backgroundColor: '',
        borderColor: '',
        color:''
      },
      holder: {
        maxWidth: '',
      },
      menu: {
        backgroundColor: ''
      }
    },
    /**
     * [setData custom css 적용 데이타 세팅]
     * @param {[Object]} opt [사용자 정의 custom css 적용 데이타]
     */
    setData: function(opt) {
      Yjs.JQ.extend(this.data, opt);
      Yjs.Gnb.Conf.useCustomCss = true;
      this.validateCheck();
    },
    /**
     * [validateCheck css 적용 데이타 validation 체크]
     * @return {} []
     */
    validateCheck: function() {
      function validate(name, val) {
        if (name.indexOf('Color') > -1) {
          //if (val.substring(0,1) !== '#') val = ''; // #~~~~~ 핵사코드로만 처리함
        }
        else if (name.indexOf('Width') > -1) {      // number 입력 가능, px가 없는 경우 px 추가
          var _type = typeof val;
          if (_type === 'number' || (_type === 'string' && (val.indexOf('px') === -1))) {
            val = val+'px';
          }
        }
        return val;
      };

      var obj = this.data;
      Yjs.JQ.each(obj, function(key,val){
        var _obj = obj[key];
        Yjs.JQ.each(val, function(_key, _val){
          _obj[_key] = validate(_key,_val);
        });
      });
    }
  },

  /**
   * [html Gnb 템플릿 문자열
   * @type {String}
   * 형태를 살리기위해 문장 끝에 \ 사용. 공백이 뒤에 붙어 있는 경우 error 발생
   * html 문장에 '가 많아 "로 처리
   */
  html: "\
	<div id='seoul-gnb-plugin'>\
		<div class='seoul-gnb-holder'>\
			<p class='seoul-gnb-link'><a href='//www.seoul.go.kr' target='_blank' title='새창열림' class='seoul-gnb-icon-link wise-link' data-kind='logo'>서울특별시</a></p>\
			<dl class='seoul-gnb-news'>\
				<dt><a href='//www.seoul.go.kr/v2012/news/list.html' target='_blank' title='새창열림(서울소식)' class='seoul-gnb-icon-notice'>서울소식</a></dt>\
				<dd><a href='#' target='_blank' title='새창열림'></a></dd>\
			</dl>\
			<dl class='seoul-gnb-menu'>\
				<dt>주요메뉴</dt>\
				<dd><a href='//www.seoul.go.kr/v2012/news/list.html' target='_blank' title='새창열림' class='seoul-gnb-icon-menu1 wise-link' data-kind='seoulnews'>서울소식</a></dd>\
				<dd><a href='//eungdapso.seoul.go.kr/' target='_blank' title='새창열림' class='seoul-gnb-icon-menu2 wise-link' data-kind='eungdapso'>응답소</a></dd>\
				<dd><a href='//opengov.seoul.go.kr/' target='_blank' title='새창열림' class='seoul-gnb-icon-menu3 wise-link' data-kind='opengov'>정보공개</a></dd>\
				<dd>\
					<button type='button' class='seoul-gnb-icon-menu4'>분야별정보 열기</button>\
					<div class='seoul-gnb-menu-section'>\
						<dl>\
							<dt>분야별정보</dt>\
							<dd>\
								<ul>\
									<li><a href='//welfare.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='welfare'><span class='seoul-gnb-icon-section1'></span> 복지</a></li>\
									<li><a href='//woman.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='woman'><span class='seoul-gnb-icon-section2'></span> 여성·가족</a></li>\
									<li><a href='//economy.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='economy'><span class='seoul-gnb-icon-section11'></span> 경제·일자리</a></li>\
									<li><a href='//safe.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='safe'><span class='seoul-gnb-icon-section5'></span> 안전</a></li>\
									<li><a href='//citybuild.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='citybuild'><span class='seoul-gnb-icon-section4'></span> 주택·도시계획</a></li>\
									<li><a href='//env.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='env'><span class='seoul-gnb-icon-section3'></span> 환경</a></li>\
									<li><a href='//sculture.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='sculture'><span class='seoul-gnb-icon-section7'></span> 문화·관광</a></li>\
									<li><a href='//health.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='health'><span class='seoul-gnb-icon-section8'></span> 건강</a></li>\
									<li><a href='//traffic.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='traffic'><span class='seoul-gnb-icon-section9'></span> 교통</a></li>\
									<li><a href='//infra.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='infra'><span class='seoul-gnb-icon-section10'></span> 건설</a></li>\
									<li><a href='//finance.seoul.go.kr/' target='_blank' title='새창열림' class='wise-link' data-kind='finance'><span class='seoul-gnb-icon-section6'></span> 세금</a></li>\
									<li><a href='//gov.seoul.go.kr/' target='_blank' title='새창열림'  class='wise-link' data-kind='gov'><span class='seoul-gnb-icon-section12'></span> 행정</a></li>\
								</ul>\
							</dd>\
						</dl>\
						<p><a href='//www.seoul.go.kr/servicemap/' target='_blank' title='새창열림' class='wise-link' data-kind='allservice'><span class='seoul-gnb-icon-service'></span> 서비스 전체보기</a></p>\
						<button type='button'><span class='seoul-gnb-icon-service-close'></span><span class='hd-element'>분야별 정보 닫기</span></button>\
					</div>\
				</dd>\
			</dl>\
		</div>\
	</div>",

    /**
   * [fail 간단한 오류 메시지]
   * @param  {[type]} str [오류 메시지]
   * @return {[type]}     [description]
   */
  fail: function(str) {
    this.Conf.gid = '';
    if (typeof str !== 'undefined') Yjs.Util.console.log(str);
  },

  /**
   * [noData hotissue와 news 데이타가 다 없을때 메시지]
   * @param  {[type]} str [오류 메시지]]
   * @return {[type]}     [description]
   */
  noData: function(str) {
    this.Conf.gid = '';
    this.jqObj.news.html('');

    var str = (typeof str !== 'undefined') ? str : '해당 데이타 없음';
    Yjs.Util.console.log(str);
  },

  /**
   * [getData 뉴스 가져오기 Ajax]
   * @return {[type]} [description]
   */
  getData: function() {
	  // 20170313 GNB 타임아웃 제거
    // var opt = { dataType: 'jsonp', timeout: this.Conf.ajaxTimeout };
	  var opt = { dataType: 'jsonp' };
    var data =  { gid: this.Conf.gid };
    
    var promise = Yjs.Ajax('get', this.Conf.url.data, data, opt);
    //alert (JSON.stringify(data)); 
    //console.log(data);			
    //console.log(promise);
    
    var success = function(data) {
    	//console.log(data);
      if (data.result == 'SUCCESS') {
        // 템플릿 랜더링 - 데이타 형태에 맞춰서 render data 생성 후 로직 추가
        Yjs.Gnb.render(data);
      }
      else {
        Yjs.Gnb.fail(data.result);
      }
    };
    var fail = function(err) {
      // 2017.04.14 실패시에도 Gnb 기본 랜더링 추가
      var _gnb = Yjs.Gnb,
          _container = _gnb.container,
          _subMenuBtn = _gnb.jqObj.subMenuBtn;
      _container
        .html(Yjs.Gnb.html)
          .find('.seoul-gnb-news').html('');

      // 이벤트 바인딩
     _subMenuBtn.click(function(e){
        Yjs.JQ(this).next().toggle();
        e.preventDefault();
      }).next().find('button').on('click', function() {
        Yjs.JQ(this).parent().toggle().prev('a').focus();
      });

      //추가 이벤트 바인딩
      Yjs.JQ('body').on('click', function(event) {
        if(Yjs.JQ(event.target).parents('.seoul-gnb-menu').length === 0) {
          if(Yjs.JQ('.seoul-gnb-menu-section').is(':visible')) {
            Yjs.JQ('.seoul-gnb-menu-section').toggle();
          }
        }
      });

      Yjs.Gnb.fail('loading failed : '+err);
    };
    promise.then(success, fail);
  },

  /**
   * [setStyleByType 디자인 타입에 따른 스타일 변경]
   * 2016.11.29 현재 1 : default, 2 : white
   */
  setStyleByType: function(){
    // 흰색 테마
    if (this.Conf.gnbType === '2') {
      this.jqObj.pluginRoot.addClass('white');
    }
  },

  /**
   * [setCustomStyle 커스텀 디자인, customCss.data 이용]
   */
  setCustomStyle: function() {
    function tmpObj(obj) {
      var _obj = Yjs.JQ.extend({},obj);
      var size = 0;

      Yjs.JQ.each(_obj, function(key, val){
        size++;
        if (val === '') {
          delete _obj[key];
          size--;
        }
      });

      if(size == 0) return '';
      else return _obj;
    }

    var data = this.customCss.data,
        root = tmpObj(data.root),
        holder = tmpObj(data.holder),
        menu = tmpObj(data.menu);

    var jqRoot = this.jqObj.pluginRoot,
        jqHolder = jqRoot.children('div'),
        jqMenu = this.jqObj.menu;

    if (typeof root === 'object') {
      jqRoot.css(root);
	    if(this.Conf.gnbType === '2') {
		    jqRoot
          .find('.seoul-gnb-menu')
            .css({'border-right-color' : root.borderColor})
            .find('dd')
              .css({'border-left-color' : root.borderColor});
	    }
    }
    if (typeof holder === 'object') {
      jqHolder.css(holder);
    }
    if (typeof menu === 'object') {
      jqMenu.css(menu);
    }
  },

  /**
   * [render GNB 랜더링]
   * @param  {[type]} data [ajax 결과 데이터]
   * @return {[type]}      [description]
   */
  render: function(data) {
    var site = data.site,
        news = data.news,
        hotissue = data.hotissue,
		    newsDisplayFlag = false;
		    
		var siteGnbuse = "N";
		var siteGnbtype = "1";
		for(var i=0; i< site.length; i++) {
			if(site[i].gnbid == this.Conf.gid) {
				siteGnbuse = site[i].gnbuse;
				siteGnbtype = site[i].gnbtype;
				if(site[i].newsexpose === 'Y') newsDisplayFlag =  true; // NEWS dispaly 적용 여부
			}
		}

    if (news.length <= 0 ) {
    	news.url = '';
    	news.title = '';
    }
    //console.log(hotissue[0]);
    //alert(hotissue.length);
    //hotissue[0].title
    if (hotissue.length <= 0 ) {
    	hotissue.url = '';
    	hotissue.title = '';
    }

    // gnb 사용하지 않을때
    if(siteGnbuse === 'N') {
      this.fail('gnb 사용 안함');
      return;
    }

    // 디자인 타입 세팅
    this.Conf.gnbType = siteGnbtype;

    // Gnb 랜더링
    this.jqObj.container.html(this.html);

    var _pluginRoot = this.jqObj.container.find('#seoul-gnb-plugin'),   //
        _logo = _pluginRoot.find('.seoul-gnb-link > a'),                // this.jqObj.container.find('.seoul-gnb-icon-link')
        _news = _logo.parent().next(),                                  // this.jqObj.container.find('.seoul-gnb-news')
        _menu = _news.next(),                                           // this.jqObj.container.find('.seoul-gnb-news').next()
        _subMenuBtn = _menu.children('dd:last').children('button'),          // this.jqObj.container.find('.seoul-gnb-icon-menu4')
        jqWiseLinks = this.jqObj.container.find('.wise-link');          // 와이즈 링크용

    _subMenuBtn.next().hide();                                          // 세부 메뉴 레이어 .seoul-gnb-menu-section display:none

    // .wise-log 일괄적용
    this.wiseLink.setUrljqObjs(jqWiseLinks);


    this.jqObj.pluginRoot = _pluginRoot;
    this.jqObj.logo = _logo;
    this.jqObj.news = _news;
    this.jqObj.menu = _menu;
    this.jqObj.subMenuBtn = _subMenuBtn;

	// display type
    this.setStyleByType();			// this.Conf.gnbType 1: default, 2: white

    // 디자인 재설정
    if (this.Conf.useCustomCss) {   // 사용자 custom css 적용시
      this.setCustomStyle();
    }

	// 새소식 hotissue 노출
    if (newsDisplayFlag) {		    // 새소식 노출여부가 YES인 경우에만 노출. site.newsexpose === 'Y'
  		// 뉴스 데이타, 핫이슈 데이타 href wise로그 적용
  		var newsUrl = this.wiseLink.setTempUrl('gnbnews', news.url),
          newsTitle = news.title,
  			  hotissueUrl = this.wiseLink.setTempUrl('hotissue', hotissue.url),
  			  hotissueTitle = hotissue.title;

  		var newsFlag = false, hotissueFlag = false;
  		if (hotissue.length > 0) hotissueFlag = true;
  		if (news.length > 0) newsFlag = true;

  		if (!hotissueFlag && !newsFlag) {
  		  this.noData('새소식 데이터 없음');
  		  //return;
  		}

  	   // 뉴스와 hotissue가 같이 있으면 우선 news 부터
  		var rotaitions = [];
  		
  		for(var i=0; i < news.length; i++) {
  			newsUrl = this.wiseLink.setTempUrl('gnbnews', news[i].url);
  			newsTitle = decodeURI(news[i].title);
  			//alert(news[i].title);
  			//newsTitle = news[i].title;
  			rotaitions.push({ url: newsUrl , title: newsTitle });
  		}
  		
  		for(var i=0; i < hotissue.length; i++) {
  			hotissueUrl = this.wiseLink.setTempUrl('hotissue', hotissue[i].url),
 			  hotissueTitle = decodeURI(hotissue[i].title);
 			  //hotissueTitle = hotissue[i].title;
 			  /*
 			  if(i < 2) {
  				alert(decodeURI(hotissueTitle));
 			  }
 			  */
  			rotaitions.push({ url: hotissueUrl , title: hotissueTitle });
  		}

			var hideNum = 0;
      var rotaitionsLen = rotaitions.length;
      if (rotaitionsLen > 0) {
        var ddObj = this.jqObj.news.children('dd').children('a').eq(0);

var showNum = Math.floor((Math.random() * rotaitions.length))
        /*dtObj.attr('href', rotaitions[0].url);*/          // icon 형태 부분이라서 제목이 필요 없음
        ddObj
          .attr('href', rotaitions[showNum].url)
          .text(rotaitions[showNum].title);
/*
//21080418  롤링되지 않도록 처리 웹접근성....관련
        ddObj
          .attr('href', rotaitions[0].url)
          .text(rotaitions[0].title);
          
				if (rotaitionsLen > 1) {
					
					for(var i=1; i< rotaitions.length; i++) {
		          var ddClone = ddObj
		                          .clone()
		                            .attr('href', rotaitions[i].url)
		                            .text(rotaitions[i].title)
		                            .hide();
		
		          ddObj.parent().append(ddClone);
					}
					
          // hotissue와 뉴스가 같이 있으면 rolling
          // setInterval scope가 window라서 전역 변수 선언
          
          //window.yjsGnbToggle = this.jqObj.news.find('a');
          setInterval(function(){
          	var showNum = Math.floor((Math.random() * rotaitions.length));
          	if(showNum === hideNum && hideNum !== 0 ) { 
          		showNum = 0; 
          	}
          	//alert(showNum +","+ hideNum);
          	window.yjsGnbToggle = Yjs.Gnb.jqObj.news.children('dd').children('a').eq(showNum);	//random으로 보여주기
          	Yjs.Gnb.jqObj.news.children('dd').children('a').eq(hideNum).hide();
            yjsGnbToggle.show();
            hideNum = showNum;
          }, Yjs.Gnb.Conf.rollingSec);
        }
        */
      }
      else {
        this.jqObj.news.html('');
      }
      this.isLoadComplete = true;
    }

    // 이벤트 바인딩
    this.jqObj.subMenuBtn.click(function(e){
      Yjs.JQ(this).next().toggle();
      e.preventDefault();
    }).next().find('button').on('click', function() {
      Yjs.JQ(this).parent().toggle().prev('button').focus();
    });

    //추가 이벤트 바인딩
    Yjs.JQ('body').on('click', function(event) {
      if(Yjs.JQ(event.target).parents('.seoul-gnb-menu').length === 0) {
        if(Yjs.JQ('.seoul-gnb-menu-section').is(':visible')) {
          Yjs.JQ('.seoul-gnb-menu-section').toggle();
        }
      }
    });
  },

  /**
   * [init GNB 초기화]
   * @param  {[String]} gid   [사이트키(5자리)]
   * @param  {[String]} container [Gnb container]
   * @param  {[Object]} opt [커스텀 css Object]
   * @return {[type]} []
   */
  init: function(gid, container, opt) {
    if (gid === '' || container === '') return;
    if (typeof gid !== 'string' || typeof container !== 'string') return;

    // Jquery 1.12.4 로딩 체크
    if (! Yjs.Conf.enable.JQ) {
      var reload = setTimeout(function(){
    	  Yjs.Gnb.init(gid,container, opt);
    	  clearTimeout(reload);
      }, 500);
    }
    else {
      this.Conf.gid = gid;
      this.initObj = {
        gid: gid,
        container: container,
        opt: opt        
      }

      Yjs.Util.loadCss(this.Conf.url.css);
      this.jqObj.container = Yjs.JQ('#'+container);

      // 커스텀 css option이 있는 경우
      if (typeof opt === 'object') {
        this.customCss.setData(opt);
      }
      this.getData();
    }
  }
};