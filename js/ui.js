;/* UI javascript */
var inputFnc, selectboxFnc, checkboxFnc, radioboxFnc, tabFnc;
(function ($) {
	$(function () {
		$(document).ready(function(){
			if($('input.txt').length > 0) inputFnc();//인풋박스
			if($('.selectbox select').length > 0) selectboxFnc();//셀렉트박스
			if($('input.chk').length > 0) checkboxFnc();//체크박스
			if($('input.rdi').length > 0) radioboxFnc();//라디오박스
			if($('input.value, textarea.area').length > 0) $('input.value, textarea.area').check();//인풋텍스트 체크
			if ($('.tabArea').length > 0) tabFnc();//탭
			if ($('#topgnb-id').length > 0) gnbFnc();//GNB
			if($('.popup-wrap').length > 0) layerFnc.init();//팝업초기화
		});//ready

		inputFnc = function (obj) {//인풋박스
			var _this, _tmp, _bg = null;
			if (!obj)
				_this = $('input.txt, textarea.area');
			else
				_this = $(obj).find('input.txt, textarea.area');
			_this.unbind('focus blur').bind('focus', function () {
				_bg = ($(this).attr('class').indexOf('bg') > -1) ? true : false;
				$(this).addClass('on');//클래스 방식
				if(_bg) $(this).removeClass('bg');
			}).bind('blur', function () {
				$(this).removeClass('on');//클래스 방식
				if (_bg && $(this).val() == '') $(this).addClass('bg');
			});
		};//인풋박스

		selectboxFnc = function (obj) {//셀렉트박스
			var _select = null
			if (!obj)
				_select = $('.selectbox select');
			else
				_select = ($(obj).find('.selectbox select').length > 0) ? $(obj).find('.selectbox select') : $(obj);
				_select.unbind().each(function (index, value) {
					$(this).prev().html($(this).children('option:selected').text());
					if ($(this).val() == 'direct') {//직접입력
						$(this).parent().parent().find('.direct').css('display', 'inline');
				}
			}).bind('change keyup', function (evt) {
				$(this).prev().html($(this).children('option:selected').text());
				if ($(this).prev().is('.ellipsis')) $(this).prev().ellipsis();//글줄임 설정
				if ($(this).find("option[value='direct']").length == 1) {//직접입력 설정
					if ($(this).val() == 'direct') {
						$(this).parent().parent().find('.direct').css('display', 'inline');
						if (evt.type == 'change') $(this).parent().parent().find('.direct').focus();//직접입력 포커스 이동
					} else {
						$(this).parent().parent().find('.direct').css('display', 'none');
					}
				}
			}).bind('focus', function () {
				$(this).prev().addClass('on');
			}).bind('blur', function () {
				$(this).prev().removeClass('on');
			});

		};//셀렉트박스

		checkboxFnc = function () {//체크박스
			var _chk = $('.chk').parent();
			_chk.each(function() {
				if ($(this).find('input').is(':checked')) {
					$(this).removeClass('off').addClass('on');
				} else {
					$(this).removeClass('on').addClass('off');
				}
			}).click(function() {
				if ($(this).find('input').is(':checked')) {
					$(this).removeClass('off').addClass('on');
				} else {
					$(this).removeClass('on').addClass('off');
				}
			});
		};//체크박스

		radioboxFnc = function () {//라디오박스
			var _rdi = $('.rdi').parent();
			_rdi.each(function() {
				if ($(this).find('input').is(':checked')) {
					$(this).removeClass('off').addClass('on');
				} else {
					$(this).removeClass('on').addClass('off');
				}
			}).click(function() {
				var _name = $(this).find('input').attr('name');
				var _radio = $('label input[name$='+_name+']');
				var _index = _radio.parent().index(this);
				_radio.each(function(index, value) {
					if (_index == index) {
						$(this).checked = true;
						$(this).parent().removeClass('off').addClass('on');
					} else {
						$(this).checked = false;
						$(this).parent().removeClass('on').addClass('off');
					}
				});
			});
		};//라디오박스

		$.fn.check = function(index) {//인풋텍스트 체크
			return this.each(function(index, value) {
				var _default = $(this).attr('default');
				if(this.value == '' || this.value == _default) {
					$(this).attr('value', _default);
				} else {
					$(this).removeClass('value');
				}
				$(this).bind('focus', function() {
					if(this.value == _default) {
						this.value = '';
					}
					$(this).removeClass('value');
				}).bind('blur', function() {
					if(this.value == '' || this.value == _default) {
						this.value = _default;
						$(this).addClass('value');
					}
				});
			});
		};//인풋텍스트 체크

		if(!$.fn.ellipsis) {//글줄임 v3 2017-12-11 수정
			$.fn.ellipsis = function(index) {//v2태그필터 추가, v3클래스 추가
				return this.each(function(index, value) {
					var el = $(this);
					if(el.attr('ellipsis') != null) return false;
					if(el.css("overflow") == "hidden") {
						var _tmpObj = (el.find('span').length > 0) ? el.find('span') : null;
						var _tmpWidth = el.find('span').outerWidth() || 0;
						var _tmpClass = el.find('span').attr('class') || 0;
						var text = el.find('span').remove();
							text = el.html();
						var multiline = el.hasClass('multiline');
						var t = $(this.cloneNode(true))
						.hide()
						.css({
							'max-height':'none',
							'position':'absolute',
							'overflow':'visible'
						})
						.width(multiline ? el.width() - _tmpWidth : 'auto')
						.height(multiline ? 'auto' : el.height());
						el.after(t);
						function height() { return t.height() > el.height(); };
						function width() { return t.width() > el.width() - _tmpWidth; };
						var func = multiline ? height : width;
						while (text.length > 0 && func()) {
							text = text.substr(0, text.length - 1);
							t.html(text + "<em>...</em>");
							if(func())el.attr('title', el.text().replace(/[\t]/g, '').replace(/[\r\n]/g, ' '));//타이틀 추가
						}
						if(_tmpObj != null) el.html(t.html() + '<span'+ ((_tmpClass) ? ' class=\"'+_tmpClass+'\"' : '') +'>' +_tmpObj.html() + '</span>');//태그필터 붙임
						else el.html(t.html());
						t.remove();
						el.attr('ellipsis',true);
					}
				});
			};
		};

		 function gnbFnc(){//GNB
			//스크롤 애니메이션
			var $body = $('body');
			var htmlWrap = $('html, body');
			$body.on('click', '.menu-area ul a, .btnView', function (e) {
				var offset = $($(this).attr('href')).offset(),
					paddingTop = $(this).data('padding-top') || 60
				if (!!offset) {
					htmlWrap.stop().animate({scrollTop: offset.top - paddingTop});
					e.preventDefault();
				}
			});

			//위치에따라 메뉴 활성화
			var $window = $(window),
				sectionBorderPadding =101,
				lastEventToken,
				$sideStep = $('#topgnb-id'),
				idArray = [];
			$window.on('scroll', function () {
				//마지막 이벤트만 처리하도록
				var closureToken = Math.floor((Math.random() * 1000000) + 1),
					windowScrollTop = $window.scrollTop(),
					tabOn, tmpOffset;
				var _start = ($("#sec1").offset().top)-101;
				lastEventToken = closureToken;

				if (windowScrollTop > _start) {
					$('.btnTop').fadeIn();
				} else {
					$('.btnTop').fadeOut();
					$('.menu-area ul li').removeClass('on');
				}

				$('.scSet').each(function(n){
					var id = $(this);
					idArray[n] = id;
				});

				setTimeout(function () {
					if (closureToken === lastEventToken) {
						tabOn = 0;
						for(i=0; i<idArray.length; i++){
							if (idArray[i].size() > 0) {
								tmpOffset =idArray[i].offset();
								if ((windowScrollTop + sectionBorderPadding) > tmpOffset.top ) {
									tabOn = i;
								} else {
									break;

								}
							}
						};
						if ($(window).scrollTop()>_start) {
							$sideStep.find('li').eq(tabOn).addClass('on').siblings().removeClass('on');
						}else{
							$sideStep.find('li').removeClass('on');
						};
					};
				}, 200);

				if ($(window).scrollTop()==0) {
					$('.menu-area ul li').removeClass('on');
					console.log('aaaa')
				}

			});
            $(".top").click(function() {//top버튼
                $('html, body').animate({
                    scrollTop : 0
                }, 200);
                return false;
            });
		};//GNB

		tabFnc = function (obj, group, idx) {//탭메뉴
			$(group).each(function (index, value) {
				if(idx == index) {
					$(group).eq(index).show();
					$(obj).parents('ul').find('li').eq(index).addClass('on');
				} else {
					$(group).eq(index).hide();
					$(obj).parents('ul').find('li').eq(index).removeClass('on');
				}
			});
			return false;
		}//탭메뉴

		layerFnc = {//팝업 레이어 v2
			val: {
				motion : 50,
				duration : 300,
				layer : null,
				inner : null,
				tmpscroll : null,
				overlap : null
			},
			init: function () {//초기화
				this.close();
				$('a, label').bind('click',function(e){//오버랩 높이 보정
					if(layerFnc.val.overlap) layerFnc.height();
				});
				$(window).resize(function() {
					if(layerFnc.val.overlap) layerFnc.height();
				});
			},
			close: function () {//레이어 닫기
				var _close = $('.popup-wrap .close > a');
				_close.click(function () {
					$(this).parent().parent().parent().animate({
						opacity: 0
					}, layerFnc.val.duration, function () {
						layerFnc.val.overlap.remove();
						$(this).removeAttr('style').find('> .popup-inner').removeAttr('style');
						$('html, body').animate({//이전 스크롤 위치로 이동
							scrollTop: layerFnc.val.tmpscroll
						}, 500);
					});
					return false;
				});
			},
			show: function (param, param2) {//레이어 보이기
				if ($(param).length == 0) return false;
				this.val.layer = $(param);
				this.val.inner = $(param + '> .popup-inner');
				var _height = (this.val.inner.height() > $(document).height()) ? this.val.inner.height() : $(document).height();
				if($('#popup-overlap').length == 0)
					$('body').append('<div id="popup-overlap" style="height:'+ _height +'px;"></div>');
				else
					$('#popup-overlap').css('height', _height + 'px');
				this.val.overlap = $('#popup-overlap');
				this.val.overlap.bind('click', function() {
					layerFnc.hide(param);
				});
				this.height();
				if (!param2) this.val.tmpscroll = $(document).scrollTop();
				$('html, body').animate({
					scrollTop: this.val.inner.offset().top - layerFnc.val.motion
				}, 500).promise().done(function() {
					layerFnc.val.inner.css({
					'margin-left' : '-' + (layerFnc.val.inner.width(true) / 2) - parseInt(layerFnc.val.inner.css('borderLeftWidth')) + 'px',
					'margin-top' : layerFnc.val.motion
				}).delay(150).animate({
						'opacity' : 1,
						'margin-top' : 0
					}, layerFnc.val.duration, function () {
						layerFnc.val.inner.find('a, input, button').get(0).focus();
					});
				});
			},
			hide: function (param) {//레이어 감추기
				this.val.layer = $(param);
				this.val.layer.animate({
					opacity: 0
				}, layerFnc.val.duration, function () {
					layerFnc.val.overlap.remove();
					$(this).removeAttr('style').find('> .popup-inner').removeAttr('style');
					$('html, body').animate({//이전 스크롤 위치로 이동
						scrollTop: layerFnc.val.tmpscroll
					}, 500);
				});
			},
			height: function () {//레이어 높이 초기화
				this.val.overlap.css('height', 0).css('height', (this.val.inner.height() > $(document).height()) ? this.val.inner.height() : $(document).height() + 'px');
				this.val.layer.css({
					'display' : 'block'
				});
				this.val.inner.css({
					'margin-left' : '-' + (this.val.inner.width(true) / 2) - parseInt(this.val.inner.css('borderLeftWidth')) + 'px'
				});
			}
		};//팝업 레이어

    });//$
})(jQuery);
/* //JS */
