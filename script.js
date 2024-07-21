$(document).ready(function() {


    $. getJSON("web.json")
    .done(function(data) {
      console.log(data);

    $('.randompage').click(function() {
        const rndInt = Math.floor(Math.random() * data.length);
        window.open(data[rndInt].Link, '_blank');
    })


      for(let i=0; i<data.length; i++){
        let NAME = data[i].Name;
        let LINK = data[i].Link;
        let REASON = data[i].Reason;
        let TAG1 = data[i].tag1;
        let TAG2 = data[i].tag2;
        let TAG3 = data[i].tag3;


        $('#sites').append('<a target="_blank" href="' + LINK + '" class="holder"><div class="head"></div><div class="circle" style="margin-left: 8px;"></div><div class="circle"></div><div class="circle"></div><div class="frame"><img src="pics/' + NAME +'.png"></div><h3>' + NAME + '</h3><h4>' + REASON + '</h4></a>');

        $(".holder").hover(function(){
            $('.head, .circle, .frame',this).addClass('framehover');
            $('img',this).addClass('scroll');
        }, function(){
            $('.head, .circle, .frame',this).removeClass('framehover');
            $('img',this).removeClass('scroll');
        });
      };
    });





    var value = 0;
    $("#nightmode").click(function(){
        value ++;
        if (value == 0) {
            $(':root').css({'--bg':'#ffffff','--txt':'#000000','--no':'#b1b1b1'});
            $("#nightmode").text($("#nightmode").text().replace("day", "night"));
            $("#nightmode2").text($("#nightmode").text().replace("day", "night"));
        } else if (value == 1) {
            $(':root').css({'--bg':'#121212','--txt':'#f9f9f9','--no':'#656565'});
            $("#nightmode").text($("#nightmode").text().replace("night", "day"));
            $("#nightmode2").text($("#nightmode").text().replace("night", "day"));
        } else {
            value = 0;
            $(':root').css({'--bg':'#ffffff','--txt':'#000000','--no':'#b1b1b1'});
            $("#nightmode").text($("#nightmode").text().replace("day", "night"));
            $("#nightmode2").text($("#nightmode").text().replace("day", "night"));
        }
    });

    $("#nightmode2").click(function(){
        value ++;
        if (value == 0) {
            $(':root').css({'--bg':'#ffffff','--txt':'#000000','--no':'#b1b1b1'});
            $("#nightmode").text($("#nightmode").text().replace("day", "night"));
            $("#nightmode2").text($("#nightmode").text().replace("day", "night"));
        } else if (value == 1) {
            $(':root').css({'--bg':'#121212','--txt':'#f9f9f9','--no':'#656565'});
            $("#nightmode").text($("#nightmode").text().replace("night", "day"));
            $("#nightmode2").text($("#nightmode").text().replace("night", "day"));
        } else {
            value = 0;
            $(':root').css({'--bg':'#ffffff','--txt':'#000000','--no':'#b1b1b1'});
            $("#nightmode").text($("#nightmode").text().replace("day", "night"));
            $("#nightmode2").text($("#nightmode").text().replace("day", "night"));
        }
    });

    $('.code').bind("enterKey",function(e){
        if (this.value == "showrs") {
            $("h4").css("display", "block");
            $('input').css('color','blue');
            $(this).attr('size','7');
            $(this).val('success!');
            $("body").one("click", function() {
                $('.code').val(null);
                $('input').css('color','var(--txt)');
                $('.code').attr('size','6');
            });           
        }
        else {
            $('input').css('color','red');
            $(this).attr('size','12');
            $(this).val('invalid code');
            $("body").one("click", function() {
                $('.code').val(null);
                $('input').css('color','var(--txt)');
                $('.code').attr('size','6');
            });  
        }
    });



    $('.code').keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });

    $('#upp').click(function() {
        $('html, body').animate({
            scrollTop: $('html').offset().top
          }, 800)
    });


    var closemenu = function() {
        vv ++;
        $('#menu').css("background-color","var(--bg)");
        $('.menuline').css("background-color","var(--txt)");
        $('#menubar').css({"height":"0","padding":"0","border":"solid 1px transparent","background-color":"transparent"});
    };

    var vv = 0
    $('#menuu').click(function() {
        $('#menu').css("background-color","var(--txt)");
        $('.menuline').css("background-color","var(--green)");
        $('#menubar').css({"height":"150px","padding":"10px","border":"solid 1px var(--txt)","background-color":"var(--bg)"});
        vv ++;
    });

    $(document).on('click', function (event) {
        if (!$(event.target).closest('#menubar').length && vv == 1) {
            $('body').bind( "click", closemenu );
            $("#menubar").click(function(event) {
                event.stopPropagation();
            });
          // ... clicked on the 'body', but not inside of #menutop
        } else if (!$(event.target).closest('#menubar').length && vv >= 2) {
            vv = 0;
            $('body').unbind( "click", closemenu );
        }
    });


    if ($( window ).width() <= 760) {
        $('h1').html('(<span style="font-family: scilla; font-style: italic; margin-left: -16px; margin-right: 8px;">Web</span>)<div style="margin-top:-2px;margin-left:12px">Marks</div>');
        $('#header').css("height",'260px');
    } else {
        $('h1').html('(<span style="font-family: scilla; font-style: italic; margin-left: -16px; margin-right: 8px;">Web</span>)Marks');
        $('#header').css("height",'180px');
    }

    $(window).resize(function() {
        if ($( window ).width() <= 760) {
            $('h1').html('(<span style="font-family: scilla; font-style: italic; margin-left: -16px; margin-right: 8px;">Web</span>)<div style="margin-top:-2px;margin-left:12px">Marks</div>');
            $('#header').css("height",'260px');
        } else {
            $('h1').html('(<span style="font-family: scilla; font-style: italic; margin-left: -16px; margin-right: 8px;">Web</span>)Marks');
            $('#header').css("height",'180px');
        }
    });


});