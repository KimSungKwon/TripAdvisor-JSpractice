$(function() {
    $(window).scroll(function() {           // window: 현재 브라우저창. scroll: 브라우저창이 스크롤 될 때 마다 scroll이벤트 발생
        var top = $(window).scrollTop();    // 현재 브라우저창의 상하 스크롤값. 꼭대기=0, 거리만큼 px단위로 리턴

        if (top > 0) 
            $('#header').addClass('inverted');
        else 
            $('#header').removeClass('inverted');
    });
    $('window').trigger('scroll');

    var dpFrom = $('#from').datepicker({
        dateFormat: 'yy-mm-dd',  // 년-월-일
        minDate: 0,              // 0: 오늘 -1: 어제 1: 내일
        onSelect: function() {   // onSelect(): 이벤트 핸들러 (사용자가 특정 날짜를 선택했을때 호출)
            dpTo.datepicker('option', 'minDate', dpFrom.datepicker('getDate')); // dpTo의 minDate 옵션값을 dpFrom의 현재날짜로 설정
        }
    });
    dpFrom.datepicker('setDate', new Date());   // datepicker('setDate'): 제이쿼리UI의 API가 이렇게 호출하라고 설계. new Date(): 현재 시간을 나타내는 Date오브젝트 생성
    var dpTo = $('#to').datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: 0
    });
    dpTo.datepicker('setDate', new Date(3));

    $('#form-search').submit(function(e) {  // sumbit 이벤트 헨들러
        e.preventDefault();     // 기본동작이 실행되지 않도록.

        var from = $('#from').val();
        var to = $('#to').val();

        search(from, to);
    });
});

var search = function(from, to) {
    var url = 'http://javascript-basic.appspot.com/searchLocation';

    $.getJSON(url, {    // $.getJSON: $.get에 마지막 인자로 json을 넣어줌. 편의함수
        from: from,
        to: to
    }, function(r) {
        var $list = $('#list-panel').empty();   // 목록 엘리먼트를 셀렉트해서 변수에 저장.

        for(i = 0; i < r.length; ++i){  // 여행지 판넬을 하나씩 추가. r: 배열(데이터)
            var data = r[i];
            var $item = createListItem(data);   
            $list.append($item);
        }
        $('#list-bg').show();
    });
}

var createListItem = function(data) {  // data: API에서 리턴된 배열의 각 항목
    var $tmp1 = $('#list-item-template').clone().removeAttr ('id');     // 템플릿 복제, id 속성 제거

    $tmp1.find('.list-item-image').attr('src', data.titleImageUrl);     // 복사한 템플릿에 속성, 내용 넣기
    $tmp1.find('.list-item-name').html(data.name);
    $tmp1.find('.list-item-city-name').html(data.cityName);
    
    $tmp1.click(function(e) {   // 목록의 각 요소를 클릭했을떄 각 여행지의 [상세보기] 페이지로 이동
        var url = 'detail.html?id=' + data.id;  // 쿼리스트링형식
        window.location = url;                  // 페이지 이동
    })
    return $tmp1;
}