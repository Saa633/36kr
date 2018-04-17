//模版函数-计算新闻时间
function getTime() {
	var times = getDateTimeStamp(this.data.published_at)
	return getDateDiff(times);
}

function getTimes() {
	var timer = this.data.published_at.substring(0, 16).split('T').join(' ')
	var times = getDateTimeStamp(timer)
	return getDateDiff(times);
}
//通过时间字符串获取时间戳   '2018-04-09 07:03:06'
function getDateTimeStamp(dateStr) {
	return Date.parse(dateStr.replace(/-/gi, "/"));
}

function getOkTime() {
	return this.data.published_at.substring(0, 16).split('T').join(' ');
}

//根据时间戳获取距离现在时间
function getDateDiff(dateTimeStamp) {
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0) {
		return;
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if(monthC >= 1) {
		result = "" + parseInt(monthC) + "月前";
	} else if(weekC >= 1) {
		result = "" + parseInt(weekC) + "周前";
	} else if(dayC >= 1) {
		result = "" + parseInt(dayC) + "天前";
	} else if(hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前";
	} else if(minC >= 1) {
		result = "" + parseInt(minC) + "分钟前";
	} else
		result = "刚刚";
	return result;
}

function getUserName() {
	var username = JSON.parse(this.data.user_info);
	//evel)
	return username.name;
}

$(document).ready(function() {

	FontSize();

	$('#fastnew').on('click', 'li h4 .title', function() {
		var idx = $(event.target).parent().parent().index();
		$('#fastnew li').eq(idx).toggleClass('active');
	})

	//加载7*24h快讯
	$.getJSON('./json/fastnew.json', function(data) {
		$('#tmplFastNew').tmpl(data.items).appendTo('#fastnew ul');
	})

	//加载 今日言论
	$.getJSON('./json/people.json', function(data) {
		$('#tmplBiggie').tmpl(data.items).appendTo('#biggie_word ul');
	})

	//加载 新闻列表  默认加载
	$.ajax({
		type: "GET",
		url: "http://localhost/36kr/php/news.php",
		data: {
			nums: '20',
			types: 'mainsite',
			page: '1',
		},
		success: function(data) {

			var datas = JSON.parse(data);
			$('#tmplNews').tmpl(datas.data.items).appendTo('#news_list ul');

		}
	});

	var swiperBan = new Swiper('#swiperBan', {
		//		autoplay: true,//可选选项，自动滑动
		autoHeight: true, //高度随内容变化
		effect: 'fade',
		scrollbar: {
			el: '.swiper-scrollbar',
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		loop: true,
	})

	var swiperAdd = new Swiper('#swiperAdd', {
		autoHeight: true, //高度随内容变化
		effect: 'fade',
		loop: true,
	})

	//选项卡事件
	$('.scroll-bar li').click(function() {
		console.log($('.list_con').offset().top + 'px')
		$('html , body').animate({
			scrollTop: $('.list_con').offset().top + 'px'
		}, 'slow');

		$('.scroll-bar li').removeClass('kr_active');
		$(this).addClass('kr_active');
		var types = $('.kr_active').data('column');

		$.ajax({
			type: "GET",
			url: "http://localhost/36kr/php/news.php",
			data: {
				nums: '20',
				types: types,
				page: '1',
			},
			success: function(data) {

				var datas = JSON.parse(data)
				$('#news_list').html('');
				var oul = $('<ul class="page"></ul>');
				oul.appendTo($('#news_list'));

				$('#tmplNews').tmpl(datas.data.items).appendTo('#news_list ul');

				Lazyloading();

			}
		});
	})

	var tabtop = $('.kr_tab').offset().top

	$(window).scroll(function() {
		if($(window).scrollTop() > tabtop) {
			$('.kr_tab').addClass('fixed');
		} else {
			$('.kr_tab').removeClass('fixed');
		}

	})

	//移动端侧导航栏
	$('.headericon-menu-header').click(function() {
		$('body').addClass("menushow");
		$('<div class="mask"></div>').appendTo('body');
	});

	$('body').on('click', '.mask', function() {
		$('body').removeClass("menushow");
		$('.mask').remove();
	});

	//移动端搜索栏
	$('.header-search-icon').click(function() {
		var hei = $(window).height();

		$('.search_box').css({
			'height': hei + 'px',
			'display': 'block'
		});
		$('#app').hide()
	})
	$('.fa-times').click(function() {
		$('.search_box').css('display', 'none');
		$('#app').show();
		$('.searchlist').html('');
		$('.search').val('');
	})

	$('.sub_key').click(function() {
		var keys = encodeURI($('.search').val());
		$.ajax({
			type: "GET",
			url: "http://localhost/36kr/php/data.php",
			data: {
				keyword: keys,
			},
			success: function(data) {

				var datas = JSON.parse(data);
				$('.searchlist').html('');
				for(var i = 0; i < datas.data.items.length; i++) {
					$('<li>' + datas.data.items[i].title + '</li>').appendTo($('.searchlist'));
				}

			}
		});

	})

	Lazyloading();

})

$(window).resize(function() {
	FontSize();
	Lazyloading();
});

function FontSize() {
	if($(window).width() < 805) {
		var fonts = 40 * $(window).width() / 805;
		$('html').css('font-size', fonts + 'px')
	}

}

window.onscroll = Lazyloading;

//懒加载方法
function Lazyloading() {
	var aImg = $('#news_list img');
	var scrTop = document.documentElement.scrollTop || document.body.scrollTop;
	var cH = document.documentElement.clientHeight;

	for(var i in aImg) {
		if(aImg[i].offsetTop < scrTop + cH) {
			aImg[i].setAttribute('src', aImg[i].getAttribute('_src'));
		}
	}
};

var canRun = true;
var numb = 1;
//两次自动加载
$(window).on('scroll', function(e) {

	e = e || window.event;
	//函数节流 ，使滚轮滚动只跳转一页	
	if(!canRun) {
		return
	}
	canRun = false;
	setTimeout(function() {
		canRun = true;
	}, 500); //利用定时器，让函数执行延迟一段时间
	//函数节流 结束
	if($(window).scrollTop() > $('.loading_more').offset().top - $(window).height() && $('#news_list ul').length < 3) {

		var types = $('.kr_active').data('column');

		numb++;

		$.ajax({
			type: "GET",
			url: "http://localhost/36kr/php/news.php",
			data: {
				nums: '20',
				types: types,
				page: numb,
			},
			success: function(data) {

				var datas = JSON.parse(data);

				var oul = $('<ul class="page"></ul>');
				oul.appendTo($('#news_list'));

				$('#tmplNews').tmpl(datas.data.items).appendTo('#news_list .page:last-child');

			}
		});

	}

	if($('#news_list ul').length >= 3) {
		$('.loading_more').text('浏览更多');
	}

})

$('.loading_more').on('click', function() {
	var types = $('.kr_active').data('column');
	numb++;
	$.ajax({
		type: "GET",
		url: "http://localhost/36kr/php/news.php",
		data: {
			nums: '20',
			types: types,
			page: numb,
		},
		success: function(data) {

			var datas = JSON.parse(data);

			var oul = $('<ul class="page"></ul>');
			oul.appendTo($('#news_list'));

			$('#tmplNews').tmpl(datas.data.items).appendTo('#news_list .page:last-child');

		}
	});
})

$('.fixed-tools').on('click', function() {
	$('html , body').animate({
		scrollTop: 0
	}, 'slow');
})