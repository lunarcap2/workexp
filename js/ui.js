;/* UI javascript */
var inputFnc, selectboxFnc, checkboxFnc, radioboxFnc, tabFnc;
(function ($) {
	$(function () {
		$(document).ready(function(){
			if($('input.txt').length > 0) inputFnc();//��ǲ�ڽ�
			if($('.selectbox select').length > 0) selectboxFnc();//����Ʈ�ڽ�
			if($('input.chk').length > 0) checkboxFnc();//üũ�ڽ�
			if($('input.rdi').length > 0) radioboxFnc();//�����ڽ�
			if($('input.value, textarea.area').length > 0) $('input.value, textarea.area').check();//��ǲ�ؽ�Ʈ üũ
			if ($('.tabArea').length > 0) tabFnc();//��
			if ($('#topgnb-id').length > 0) gnbFnc();//GNB
			if($('.popup-wrap').length > 0) layerFnc.init();//�˾��ʱ�ȭ
		});//ready

		inputFnc = function (obj) {//��ǲ�ڽ�
			var _this, _tmp, _bg = null;
			if (!obj)
				_this = $('input.txt, textarea.area');
			else
				_this = $(obj).find('input.txt, textarea.area');
			_this.unbind('focus blur').bind('focus', function () {
				_bg = ($(this).attr('class').indexOf('bg') > -1) ? true : false;
				$(this).addClass('on');//Ŭ���� ���
				if(_bg) $(this).removeClass('bg');
			}).bind('blur', function () {
				$(this).removeClass('on');//Ŭ���� ���
				if (_bg && $(this).val() == '') $(this).addClass('bg');
			});
		};//��ǲ�ڽ�

		selectboxFnc = function (obj) {//����Ʈ�ڽ�
			var _select = null
			if (!obj)
				_select = $('.selectbox select');
			else
				_select = ($(obj).find('.selectbox select').length > 0) ? $(obj).find('.selectbox select') : $(obj);
				_select.unbind().each(function (index, value) {
					$(this).prev().html($(this).children('option:selected').text());
					if ($(this).val() == 'direct') {//�����Է�
						$(this).parent().parent().find('.direct').css('display', 'inline');
				}
			}).bind('change keyup', function (evt) {
				$(this).prev().html($(this).children('option:selected').text());
				if ($(this).prev().is('.ellipsis')) $(this).prev().ellipsis();//������ ����
				if ($(this).find("option[value='direct']").length == 1) {//�����Է� ����
					if ($(this).val() == 'direct') {
						$(this).parent().parent().find('.direct').css('display', 'inline');
						if (evt.type == 'change') $(this).parent().parent().find('.direct').focus();//�����Է� ��Ŀ�� �̵�
					} else {
						$(this).parent().parent().find('.direct').css('display', 'none');
					}
				}
			}).bind('focus', function () {
				$(this).prev().addClass('on');
			}).bind('blur', function () {
				$(this).prev().removeClass('on');
			});

		};//����Ʈ�ڽ�

		checkboxFnc = function () {//üũ�ڽ�
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
		};//üũ�ڽ�

		radioboxFnc = function () {//�����ڽ�
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
		};//�����ڽ�

		$.fn.check = function(index) {//��ǲ�ؽ�Ʈ üũ
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
		};//��ǲ�ؽ�Ʈ üũ

		if(!$.fn.ellipsis) {//������ v3 2017-12-11 ����
			$.fn.ellipsis = function(index) {//v2�±����� �߰�, v3Ŭ���� �߰�
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
							if(func())el.attr('title', el.text().replace(/[\t]/g, '').replace(/[\r\n]/g, ' '));//Ÿ��Ʋ �߰�
						}
						if(_tmpObj != null) el.html(t.html() + '<span'+ ((_tmpClass) ? ' class=\"'+_tmpClass+'\"' : '') +'>' +_tmpObj.html() + '</span>');//�±����� ����
						else el.html(t.html());
						t.remove();
						el.attr('ellipsis',true);
					}
				});
			};
		};

		 function gnbFnc(){//GNB
			//��ũ�� �ִϸ��̼�
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

			//��ġ������ �޴� Ȱ��ȭ
			var $window = $(window),
				sectionBorderPadding =101,
				lastEventToken,
				$sideStep = $('#topgnb-id'),
				idArray = [];
			$window.on('scroll', function () {
				//������ �̺�Ʈ�� ó���ϵ���
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
            $(".top").click(function() {//top��ư
                $('html, body').animate({
                    scrollTop : 0
                }, 200);
                return false;
            });
		};//GNB

		tabFnc = function (obj, group, idx) {//�Ǹ޴�
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
		}//�Ǹ޴�

		layerFnc = {//�˾� ���̾� v2
			val: {
				motion : 50,
				duration : 300,
				layer : null,
				inner : null,
				tmpscroll : null,
				overlap : null
			},
			init: function () {//�ʱ�ȭ
				this.close();
				$('a, label').bind('click',function(e){//������ ���� ����
					if(layerFnc.val.overlap) layerFnc.height();
				});
				$(window).resize(function() {
					if(layerFnc.val.overlap) layerFnc.height();
				});
			},
			close: function () {//���̾� �ݱ�
				var _close = $('.popup-wrap .close > a');
				_close.click(function () {
					$(this).parent().parent().parent().animate({
						opacity: 0
					}, layerFnc.val.duration, function () {
						layerFnc.val.overlap.remove();
						$(this).removeAttr('style').find('> .popup-inner').removeAttr('style');
						$('html, body').animate({//���� ��ũ�� ��ġ�� �̵�
							scrollTop: layerFnc.val.tmpscroll
						}, 500);
					});
					return false;
				});
			},
			show: function (param, param2) {//���̾� ���̱�
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
			hide: function (param) {//���̾� ���߱�
				this.val.layer = $(param);
				this.val.layer.animate({
					opacity: 0
				}, layerFnc.val.duration, function () {
					layerFnc.val.overlap.remove();
					$(this).removeAttr('style').find('> .popup-inner').removeAttr('style');
					$('html, body').animate({//���� ��ũ�� ��ġ�� �̵�
						scrollTop: layerFnc.val.tmpscroll
					}, 500);
				});
			},
			height: function () {//���̾� ���� �ʱ�ȭ
				this.val.overlap.css('height', 0).css('height', (this.val.inner.height() > $(document).height()) ? this.val.inner.height() : $(document).height() + 'px');
				this.val.layer.css({
					'display' : 'block'
				});
				this.val.inner.css({
					'margin-left' : '-' + (this.val.inner.width(true) / 2) - parseInt(this.val.inner.css('borderLeftWidth')) + 'px'
				});
			}
		};//�˾� ���̾�

    });//$
})(jQuery);
/* //JS */
