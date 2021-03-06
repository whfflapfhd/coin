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
	console.log($today)
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