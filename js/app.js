/*Set Date Format*/
Date.prototype.format = function(format){
	if(!this.valueOf()) return '';
	let _this = this;
	return format.replace(/(yyyy|mm|dd|hh|mm)/gi,function($1){
		switch($1){
			case 'yyyy' : return _this.getFullYear();
			case 'MM' : return ('0' + (1 + _this.getMonth())).slice(-2);
			case 'dd' : return ('0' + (_this.getDate()-1)).slice(-2);
			case 'hh' : return _this.getHours();
			case 'mm' : return _this.getMinutes();
			default: return $1;
		}
	});
};


var urlAddress = 'https://project-team.upbit.com/api/v1/disclosure?region=kr&per_page=',
result,
data,
$date = new Date(),
$today = [
	$date.getFullYear(), // Year
	("0" + (1 + $date.getMonth())).slice(-2), // Month
	("0" + $date.getDate()).slice(-2) // Day
//    ("0" + ($date.getDate() - 1)).slice(-2) // 이전 날짜 테스트
].join(''),
$postCnt = 0;

function getPost(url){
	$.ajax({
		url    : url,
		method   : 'get',
		async: false,
		data     : null,
		dataType : 'json',
		chche : false,
		success : function(resp){
            data = resp.data.posts;
		},
		error : function(msg){
			data = null;
		}
	});
}

function printPost(num){
	$(".monitoring").hide();
	$(".viewAll").show();
	getPost(urlAddress+num);
	var html = '';
	$.each(data,function(idx,value){
		html += "<li><span>"+value.assets+"</span><a href='"+value.url+"' target='_blank'>"+value.text+"</a></li>";
	});
	$(".viewAll").html(html);
};

function printNewPost(){
	getPost(urlAddress+10);
	var html = '',
	$currentCnt = 0;
	$.each(data,function(idx,value){
		var $postDate = value.start_date.split('T')[0].split('-').join('');
		if($today != $postDate) return false;
		html += "<li class='new'><span>"+value.assets+"</span><a href='"+value.url+"' target='_blank'>"+value.text+"</a></li>";
		$currentCnt = idx+1;
	});
	if($currentCnt == $postCnt){
		return
	}else{
		$postCnt = $currentCnt
		$(".monitoring").html(html);
	}
};
printNewPost();
var post = setInterval(printNewPost, 10000);


const _disclosureUrl = 'https://project-team.upbit.com/api/v1/disclosure?region=kr&per_page=';
const Disclosure = function(){
    this.data = null;
    this.getDate = function(range){
        let currentDate = new Date();
        return currentDate.format(range)
    };
    this.today = this.getDate('yyyy-MM-dd');
    this.getData = function(num,callback){
        let count = (num === undefined) ? 10 : num;
        let requestUrl = _disclosureUrl + count;
        const _this = this;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl);
        xhr.send();
        xhr.onload = function(){
            if(xhr.status === 200){
                callback( JSON.parse(xhr.responseText).data.posts);
            }else{
                console.log('Error!');
            };
        }
    };
    this.printPost = function(e){
        let _this = this;
        let printDataCount = e.target.dataset.count;
        let className = e.target.dataset.classname || '';
        let array;
        let htmlNode = '';

        this.getData(printDataCount,function(result){
            array = result;
            array.forEach(function(value,idx){
                if(className === 'new' && value.start_date.split('T')[0] !== _this.today) return false
                htmlNode += `<li class=${className}><span>${value.assets}</span><a href=${value.url} target="_blank">${value.text}</a></li>`;
            });
            document.querySelector(".monitoring").innerHTML = htmlNode;
        });
    }
};

const disclosure = new Disclosure();
let btn = document.querySelector('.btn-box');
btn.addEventListener('click',function(e){
    disclosure.printPost(e)
});