		$(function() {
				setTimeout(function(){
                           
                           $('#dg-container').gallery({ autoplay:true,interval:3000});
                
                $(".dg-wrapper > a").on('click',function(ev){

	if($(this).attr('class').indexOf('center')==-1){
ev.preventDefault();
	}else{
    this.click(); // navigate to lesson
    scrollToContent();
}
});
                
                },100);
                
                // very ugly. ask someone to help ya
			});
    
    $(document).on('touchstart',function(){
        $(".search-ac a").addClass("no-hover");
    });
   
    $(document).ready(function(){
        
        $("#search").on('blur',function(){
            this.value="";
        });
        
        
        
        (function(){
            var date = new Date().getHours();
            
            if(date >= 21 || date <= 5){
                $("body").addClass("night");
            }else{
                $("body").removeClass("night");
            }
            
            
        })();
        
        
         var $sidebar   = $("#sidebar"),
             $mainContent = $("#mainContent"),
        $window    = $(window),
        offset     = $sidebar.offset(),
        topPadding = 50;
        
        
        

        $window.scroll(function(){
            // ugh it hurts            
            if ($window.scrollTop() > $("#mainContent").offset().top-50) {
                if(!$sidebar.hasClass('fixed')){
                    $sidebar.addClass('fixed');
                    //$mainContent.addClass('fixed');
                }
            }else{             
                $sidebar.removeClass('fixed');
                //$mainContent.removeClass('fixed');
            }
        });
        
        $("a").click(scrollToNav);
        
        EnableSearchKeybordNav = function(){
        $("#search").on('keydown',function(event){
            event.stopPropagation();
            // If user pressed arrow up/down
            if(event.which == 38 || event.which == 40){
                event.preventDefault();
                // If there's no selected result yet
                if($(".search-ac > li > a.hover").length==0){
                    //  Select the first one
                    $(".search-ac >li>  a").first().toggleClass('hover');
                 }else{
            
            // If user pressed arrow down ..
            if(event.which ==38){    

                // Unselect current element and select the next
                $(".search-ac > li > a.hover").toggleClass('hover').parent().prev().find('a').toggleClass('hover');
            }else{
                
                // Unselect current element and select the prev
                $(".search-ac > li > a.hover").toggleClass('hover').parent().next().find('a').toggleClass('hover');
            }
                    
                 }
            // If user pressed arrow right or enter
            // devie it into two separate conditions to keep arrows in use when typing. just separate enter and rarrow
            }else if(event.which==13 || event.which == 39){
                
                var selected = $(".search-ac > li > a.hover");
                
                // If no element was selected
                if(selected.length == 0){
                    // perform traditional search
                // If there was a selections
                 $("#search").blur();
                window.location.href = '#/search/';

                }else{
                 // click the selected option
                 selected[0].click();
                 $("#search").blur().val("");

                }
            /// Escape    
            }else if(event.which==27){
                $("#search").blur();
            
            // Any other "standard" key
            }else{
                
                // Remove selection
                $(".search-ac > li > a.hover").removeClass('hover');
               
            }
            

            
            
        
        });
        }
        //$("#topbar").on('click',scrollToTop);
        $(document).on('keydown',function(event){
            if(typeof $(":focus")[0]=="undefined"){
                if(event.which == 39){
                    $(".dg-next")[0].click();
                    scrollToTop();
                }else if(event.which==37){
                    $(".dg-prev")[0].click();
                    scrollToTop();
                }else if(event.which==13){
                    $(".dg-center")[0].click();
                }else if(event.which!=38 && event.which!=40){

                    if(typeof $(":focus")[0]=="undefined"){
                        $("#search").focus();
                    }
                }
            }
        });
        
    });
    
    scrollToNav = function(){
        /*$('html, body').stop().animate({
                    scrollTop: $("#list").offset().top-75
                }, 600);*/
    }
    
    scrollToPos = function(a){
        $('html, body').stop().animate({
                        scrollTop: a
                    }, 600);
        }
    
    scrollToContent = function(){
        //$(".search-ac").blur();
        
        $('html, body').stop().animate({
                        scrollTop: $("#mainContent").offset().top-75
                    }, 600);
        }

        scrollToTop = function(){
        $('html, body').stop().animate({
                        scrollTop: 0
        }, 300);
    }
    
    
    historyBack  = function(){
        history.back()
        scrollPos = $(window).scrollTop();
    }
    
    scrollPos = 0;