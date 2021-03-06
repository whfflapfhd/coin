/*Set Date Format*/
Date.prototype.format = function(format){
	if(!this.valueOf()) return '';
	let _this = this;
	return format.replace(/(yyyy|mm|dd|hh|mm)/gi,function($1){
		switch($1){
			case 'yyyy' : return _this.getFullYear();
			case 'MM' : return ('0' + (1 + _this.getMonth())).slice(-2);
			case 'dd' : return ('0' + _this.getDate()).slice(-2);
			case 'hh' : return _this.getHours();
			case 'mm' : return _this.getMinutes();
			default: return $1;
		}
	});
};

const _disclosureUrl = 'https://project-team.upbit.com/api/v1/disclosure?region=kr&per_page=';
const Disclosure = function(){
    this.data = null;
    this.getDate = function(range){
        let currentDate = new Date();
        return currentDate.format(range)
    };
    this.today = this.getDate('yyyy-MM-dd');
	this.postId = [];
    this.getData = function(num,callback){
        let count = (num === undefined) ? 10 : num;
        let requestUrl = _disclosureUrl + count;
        const _this = this;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl);
        xhr.send();
        xhr.onload = function(){
            if(xhr.status === 200){
				let responcesData = JSON.parse(xhr.responseText).data.posts;
				callback(responcesData);
				/*if(_this.postId.length > 0 && _this.postId[0] === responcesData[0].id){
					return false
				}else{
					callback(responcesData);
				};*/
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
				_this.postId.push(value.id);
                htmlNode += `<li class=${className}><span>${value.assets}</span><a href=${value.url} target="_blank">${value.text}</a></li>`;
            });						
			if(_this.postId.length > 0){
				document.querySelector(".monitoring").innerHTML = htmlNode;
				console.log('DONE');
			}			
        });
    }
};

const disclosure = new Disclosure();
let btn = document.querySelector('.btn-box');
btn.addEventListener('click',function(e){	
    disclosure.printPost(e)
});