'use strict';

/*
    날짜 포멧 지정
*/
Date.prototype.format = function(format){
	if(!this.valueOf()) return '';
	let _this = this;
	return format.replace(/(yyyy|MM|dd|hh|mm|ss|ms)/gi,function($1){
		switch($1){
			case 'yyyy' : return _this.getFullYear();
			case 'MM' : return ('0' + (1 + _this.getMonth())).slice(-2);
			case 'dd' : return ('0' + _this.getDate()).slice(-2);
			case 'hh' : return _this.getHours();
			case 'mm' : return ('0' + _this.getMinutes()).slice(-2);
            case 'ss' : return _this.getSeconds();
            case 'ms' : return _this.getMilliseconds();
			default: return $1;
		}
	});
};

const _disclosureUrl = 'https://project-team.upbit.com/api/v1/disclosure?region=kr&per_page=20'; // 데이터 요청 URL

/*
    객체 생성
*/
const Disclosure = function(){

    /* 날짜 가져오는 메서드 range는 format */
    this.getDate = function(range){
        let currentDate = new Date();
        return currentDate.format(range)
    };

    this.today = this.getDate('yyyy-MM-dd');  // 오늘 날짜
    this.flag = 'monitor'; // 단순 리스트 / 실시간 모니터 플래그

    /* 데이터 가져오기 */
    this.getData = function(callback){
        let requestUrl = _disclosureUrl;
        const _this = this;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl);
        xhr.send();
        xhr.onload = function(){
            if(xhr.status === 200){
				let responcesData = JSON.parse(xhr.responseText).data.posts;
				callback(responcesData);
            }else{
                console.log('Error!');
            };
        }
    };

    /* 가져온 데이터 뿌려주기 */
    this.printPost = function(e){
        let _this = this;
        let _target = (e) ? e.target : 'undefined';
        let className;
        let array;
        let storageData;
        let htmlNode = '';
        let monitorStart = this.monitor;
        this.flag = (_target != 'undefined') ? _target.dataset.flag : 'monitor';

        this.getData(function(result){
            array = result;
            storageData = localStorage.getItem('data');
            let currentBoolean = (storageData) ? JSON.parse(storageData)[0].id === array[0].id : false;
            if(!currentBoolean){
                localStorage.setItem('data' , JSON.stringify(array));
                localStorage.setItem('postDate' , _this.getDate('yyyy-MM-dd hh:mm:ss'));
                console.log('xhr');
            }else{
                array = JSON.parse(storageData);
                console.log('local');
            };
            if(monitorStart && currentBoolean) return;
            array.forEach(function(value,idx){
                className = (value.start_date.split('T')[0] !== _this.today) ? '' : 'new';
                if(_this.flag === 'monitor' && value.start_date.split('T')[0] !== _this.today){
                    if(idx < 1) htmlNode = '<li class="nopost">데이터 없음</li>';
                    return false
                };
                htmlNode += `<li class=${className}><span>${value.assets}</span><a href=${value.url} target="_blank">${value.text}</a></li>`;
            });
            _this.firstID = array[0].id;
            document.querySelector(".monitoring").innerHTML = htmlNode;
        });
    };
    this.monitor;
    this.interval = function(){
        this.printPost();
        let _this = this;
        this.monitor = setInterval(function(){
            _this.printPost();
        },3000)
    }
};
const disclosure = new Disclosure();
let btn = document.querySelector('.btn-box');
let btnNew = btn.querySelectorAll('button')[0];
btn.addEventListener('click',function(e){
    clearInterval(disclosure.monitor);
    disclosure.monitor = null;
    if(e.target.dataset.flag === 'monitor'){
        disclosure.interval();
    }else{
        disclosure.printPost(e);
    }
});
disclosure.interval();