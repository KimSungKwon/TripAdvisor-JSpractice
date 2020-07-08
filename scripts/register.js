$(function() {
    generateYears($('#sel-birth'));

    var birthSelect = $('#sel-birth').selectmenu();             // 제이쿼리UI의 컴포넌트. <select>태그 대체
    birthSelect.selectmenu("menuWidget").addClass('overflow');  // selectmenu("menuWidget"): 목록엘리먼트 리턴, overflow 속성 추가  
    
    $('#form-register').submit(function(e) {       // [회원가입]페이지의 모든 입력창은 form-register에 들어있고, [가입하기]버튼의 타입이 submit이므로 버튼클릭하면 submit 이벤트 발생. e: 이벤트 객체
        e.preventDefault();                        // 해당 이벤트의 기본동작을 실행하지 못하게 막음

        $(this).find('.txt-warning').empty().hide();    // 일단 경고문 감추기
        // 맞게 입력했는지 검증    .next() & .siblings(): 경고문 엘리먼트 찾기
        var email = $('#inp-email').val();
        if(!validateEmail(email)) {
            $('#inp-email').next().html('잘못된 형식입니다.').show();
            return;
        }

        var password = $('#inp-password').val();
        if(!validatePassword(password)) {
            $('#inp-password').next().html('대문자와 숫자가 포함된 최소 8자의 문자열이여야 함').show();
            return;
        }

        var confirm = $('#inp-confirm').val();
        if(password !== confirm) {
            $('#inp-confirm').next().html('비밀번호 일치하지 않음').show();
            return;
        }

        var gender = $('input[name="gender"]:checked').val();   // :checked 선택된 항목
        if(!gender) {
            $('#inp-female').siblings('.txt-warning').html('필수항목입니다.').show();
            return;
        }

        var birth = $('#sel-birth').val();
        if(!birth) {
            $('#sel-birth').siblings('.txt-warning').html('필수항목입니다.').show();
            return;
        }

        var accept = $('#inp-accept:checked').val();
        if(!accept) {
            $('#inp-accept').next().next().html('필수항목입니다.').show();
            return;
        }

        submit(email, password, gender, birth);
    });
    $('#btn-back').click(function() {   // 돌아가기버튼 이벤트 핸들러
        document.location.href = 'index.html';
    });
});

var generateYears = function($select) {     // 년도선택버튼 리스트 생성
    for (var i = 1970; i <= 2010; i++) {
      $select.append('<option value="' + i + '">' + i + '</option>');
    }
}

var validateEmail = function(email) {
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);     // 'email'이 정규식에 부합하는지 검사
}

var validatePassword = function(password) {
    var reg = /^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
    return reg.test(password);
}

var submit = function(email, password, gender, birth) {     // 서버로 폼을 전송
    var params = {
        email: email,
        password: password,
        gender: gender,
        birth: birth
    };
    $.post('some-api-url', params, function(r) {
        console.log(r); // 서버로 전달
    });
}
