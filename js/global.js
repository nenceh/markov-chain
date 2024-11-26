// same as main global.js file

$(document).ready(function(){
    $(window).on("load resize scroll", function (){
        if ($(window).width() < 1103 && scrollY > 600){
            $('aside.back-to-top').css({'visibility':'visible', 'opacity':1})
        }else{
            $('aside.back-to-top').css({'visibility':'hidden', 'opacity':0})
        }
    })

    $("aside.back-to-top button#to-top").click(function(){
        $("html, body").animate({scrollTop: 0}, 100)
    })

    $(".panel-control").click(function(){
        $(".panel"+$(this).attr("value")).slideToggle(1000, function() {
        if ($(this).is(':visible'))
            $(this).css({'display':'inline-block'})
        })
        
        $(this).find('svg').toggleClass('rotate')
    })

    $("button#early-regex").click(function(){
        if($("input#sample").val()){
            $("p.early-regex-result").text($("input#sample").val().toLowerCase().split(/(?<=["(),.!])[\s]*|[\s]*(?=[ .,:;!?"()])+[\s]*/))
        } else $("p.early-regex-result").text("[Invalid input!]")
    })

    $(window).on("scroll", function (){
        // in-page navigation
        var inPageNav = document.querySelector("nav.toc")
        var inPageLinks = document.querySelectorAll(".in-page-link")
        var sections = document.querySelectorAll("main > section")
        var currentSection = inPageLinks[0].getAttribute("href").substring(1)

        var offset = 160
        sections.forEach((section)=>{
            const sectionTop = section.offsetTop
            if(scrollY >= (parseInt($(".page-banner-container").height()) + parseInt($(".info-container").height())) - offset){
                if(scrollY >= (sectionTop - $(".topnav-container").height() - parseInt($("main").css("gap"))) - offset){
                    currentSection = section.getAttribute("id")
                }
            }
        })

        inPageLinks.forEach((item)=>{
            item.classList.remove("in-page-current")
            if(item.href.includes(currentSection))
                item.classList.add("in-page-current")
            else item.classList.remove("in-page-current")
        })
    })
})