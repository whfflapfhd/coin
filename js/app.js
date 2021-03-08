'use strict';

/*Set Date Format*/
Date.prototype.format = function(format){
	if(!this.valueOf()) return '';
	let _this = this;
	return format.replace(/(yyyy|mm|dd|hh|mm|ss|ms)/gi,function($1){
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

const _disclosureUrl = 'https://project-team.upbit.com/api/v1/disclosure?region=kr&per_page=20';
const Disclosure = function(){
    this.getDate = function(range){
        let currentDate = new Date();
        return currentDate.format(range)
    };
    this.today = this.getDate('yyyy-MM-dd');

    /*Get Data*/
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
    this.printPost = function(e){
        let _this = this;
        let _target = (e) ? e.target : 'undefined';
        let className;
        let array;
        let storageData;
        let htmlNode = '';

        this.getData(function(result){
            array = result;
            storageData = localStorage.getItem('data');
            let currentBoolean = (storageData) ? JSON.parse(storageData)[0].id === array[0].id : false;
            if(!currentBoolean){
                localStorage.setItem('data' , JSON.stringify(array));
                console.log('use xhr');
            }else{
                array = JSON.parse(storageData);
                console.log('use local');
            };
            array.forEach(function(value,idx){
                /*
                if(className === 'new' && value.start_date.split('T')[0] !== _this.today){
                    htmlNode = '<li class="nopost">데이터 없음</li>';
                    return false
                };
                */
                className = (value.start_date.split('T')[0] !== _this.today) ? '' : 'new';
                htmlNode += `<li class=${className}><span>${value.assets}</span><a href=${value.url} target="_blank">${value.text}</a></li>`;
            });
            _this.firstID = array[0].id;
            document.querySelector(".monitoring").innerHTML = htmlNode;
        });

    }
};

const disclosure = new Disclosure();
let btn = document.querySelector('.btn-box');
let btnNew = btn.querySelectorAll('button')[0];
btn.addEventListener('click',function(e){
    disclosure.printPost(e)
});
disclosure.printPost();