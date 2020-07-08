var MARKER_LABLES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var map;
var markers = {};

$(function() {
    var myTrips = Cookies.getJSON('MYTRIPS');
    if(!myTrips)
        myTrips = [];
    
    showMap();
    generateMyTripList(myTrips);
});

var showMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: 33.3617,
            lng: 126.5292
        }
    });
}

var generateMyTripList = function(list) {        // list: JSON 정보
    var bounds = new google.maps.LatLngBounds(); // '새로운 영역'을 생성하는 부분. 빈 영역 인스턴스 만들기.
    var $list = $('#mytrip-list');
    
    for(var i = 0; i < list.length; ++i){
        var myTrip = list[i];

        var pos = {
            lat: myTrip.x,
            lng: myTrip.y
        };

        var markerLabel = MARKER_LABLES[i];

        var $item = $('#mytrip-item-template').clone().removeAttr('id');    // 템플릿으로 목록 생성,추가
        $item.data('id', myTrip.id);    // $(selector).data('key', value):데이터저장. key: value가 저장될 string 값.  value: 데이터 object값.
        $item.find('.item-name').html(markerLabel + '.' + myTrip.name)
        $item.find('.item-city-name').html(myTrip.cityName);
        
        $item.find('.item-remove').click(function() {       // 이벤트 핸들러. 목록 지우기
            var $elem = $(this).closest('.mytrip-item');    // $(this): 이벤트핸들러에서 이벤트가 발생한 엘리먼트. closest: '.mytrip-item' 에 맞는 가장 가까운 부모 엘리먼트 리턴
            var id = $elem.data('id');                      // $(selector).data(key):데이터읽기. 앞서 저장한 data를 읽기위한 key값. 
            $elem.remove();

            markers[id].setMap(null);   // 지도에서 해당 마커 제거(인자로 null)
            markers[id] = null;

            var newList = removeFromList(list, id);
            Cookies.set('MYTRIPS', newList);
        });
        $list.append($item);

        var marker = new google.maps.Marker({    // 마커생성
            position: pos,
            label: markerLabel,     // 마커에 레이블 표시
            map: map
        });
        markers[myTrip.id] = marker;

        bounds.extend(pos); // 빈 영역 인스턴스에 위/경도로 구성된 '좌표 오브젝트' 삽입.
    }
    map.fitBounds(bounds);  // 모든 마커를 포함할 수 있는 영역을 인자로, 그 영역을 한번에 보여줄 수 있는 '위치'와 '줌레벨' 조절해줌
}

var removeFromList = function(list, id){    // 'list' 배열로부터 특정 'id'값의 요소를 제거한 결과 리턴
    var index = -1;
    for (var i = 0; i < list.length; ++i){
        if(list[i].id === id){
            index = i;
            break;
        }
    }
    if (index !== -1){
        list.splice(index, 1);  // splice(index, 1): index번째부터 1개 추출한거 리턴
    }
    return list;
}