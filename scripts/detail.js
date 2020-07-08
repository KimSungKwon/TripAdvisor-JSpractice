var map;

$(function() {
    var id = parseId(window.location.search);
    getDetail(id);
    showMap();
});

var parseId = function(str) {   // 파싱으로 Id값 찾아내기
    var s = str.substring(1);   // 문자열 맨앞에 ? 있으므로 제거후 시작
    var args = s.split('$');    // 1st 파싱. args = [키=값, 키=깂, 키=값 ... ];
    for(var i = 0; i < args.length; ++i){
        var arg = args[i];
        var token = arg.split('='); // 2nd 파싱. token = [키, 값];
        if(token[0] === 'id'){
            return token[1];
        }
    }
    return null;
}
var getDetail = function(id) {
    var url = 'https://javascript-basic.appspot.com/locationDetail';
    $.getJSON(url, {    // getJSON(url, obj, func)
        id: id
    }, function(r){     // r: 정보
        $('.detail-header-name').html(r.name);
        $('.detail-header-city-name').html(r.cityName);
        $('.detail-desc-text').html(r.desc);

        // 갤러리아를 사용하기 위해 이미지들을 <img>태그로 만들어 도큐먼트에 넣어야함
        var $gallery = $('#detail-images');
        var images = r.subImageList;    // subImageList: 배열
        for(var i = 0; i < images.length; ++i){
            var $image = $('<img src="' + images[i] + '"/>'); // <img src="images[i]"/> : src속성까지 설정된 img태그 생성, <div><img /></div> 입력하면 <img>태그를 포함하는 <div>태그 생성후 리턴
            $gallery.append($image);
        }
        Galleria.loadTheme('https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js');
        Galleria.run('#detail-images');

        showMarker(r.position.x, r.position.y); // 마커 추가
        // 쿠키 저장
        $('.btn-register').click(function() {
            var isExist = false;
            // 등록내용을 덮어씌우는게 아닌, 추가를 하는것(기존에 저장된 값을 getJSON()으로 불러옴. = JSON형식으로 알아서 바꿔줌) 
            var myTrips = Cookies.getJSON('MYTRIPS'); // 'MYTRIPS'라는 키로 저장된 쿠키를 가져와서 myTrips: 배열(객체저장) 라는 변수에 넣어줌. 
            // 존재하지 않을 경우 빈 배열로 초기화
            if (!myTrips)   // undefined == false
                myTrips = [];
            // 중복 등록 판별
            for (var i = 0; i < myTrips.length; ++i){
                if(myTrips[i].id == id)
                    isExist = true;
            }
            if (!isExist){
                myTrips.push({
                    id: id,
                    name: r.name,
                    cityName: r.cityName,
                    x: r.position.x,
                    y: r.position.y
                });
            }
            Cookies.set('MYTRIPS', myTrips);    // MYTRIPS키에 mytrips밸류 추가 (js-cookie 라이브러리 사용)
            alert('여행지 등록 완료');
        });
    });
}
var showMap = function() {  // 지도 오브젝트를 생성해서 map에 할당
    map = new google.maps.Map(document.getElementById('map'), { // google.maps.Map(지도가 표시될 엘리먼트, 옵션을 정의한 오브젝트)
        zoom: 12,   
        center: {   // lat: 위도, lng: 경도
            lat: 33.3617,  
            lng: 126.5292
        }
    });
}
var showMarker = function(lat, lng) {   // 위도와 경도를 인자로 받아 해당위치에 '마커' 생성
    var pos = {
        lat: lat,
        lng: lng
    };
    new google.maps.Marker({ // 지도에 마커 추가
        position: pos,
        map: map
    });
    map.panTo(pos); // panTo(): 지도를 주어진 위치로 이동
}