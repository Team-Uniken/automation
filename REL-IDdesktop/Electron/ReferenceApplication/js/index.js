
(function($){
	$(document).ready(function(){
      $("#dashboard_nav ul li > a").click(function() {
        var btnNav = $(this).attr("id");
        var tab = $("div." + btnNav);
        var current = $("a.current");
        $(current).removeClass("current");
        $(this).addClass("current");
        $("div.dashboard_tab_content").removeClass("tab_selected");
        $(tab).addClass("tab_selected");
        if(btnNav == "dashboard_tab_settings")
        {
          $("#dashboard_sub_nav").show();
          $("#dashboard_content").css("background-color","rgb(255,255,230)");
          $("#dashboard_content").css("margin-left","400px");
          var secondaryDiv = $("#dashboard_sub_nav > ul > li > a").first().attr("id");
          var secondTab = $("div." + secondaryDiv);
          $("div.dashboard_tab_content").removeClass("tab_selected");
          $(secondTab).addClass("tab_selected");
          $("#dashboard_sub_nav > ul > li > a").first().addClass("current");
        }
        else
        {
          $("#dashboard_sub_nav").hide();
          $("#dashboard_content").css("background-color","rgb(84,150,231)");
          $("#dashboard_content").css("margin-left","210px");
        }
      });
      
      $("#dashboard_sub_nav ul li > a").click(function() {
        var btnSubNav = $(this).attr("id");
        var tab = $("div." + btnSubNav);
        var current = $("a.current");
        $(current).removeClass("current");
        $(this).addClass("current");
        $("div.dashboard_tab_content").removeClass("tab_selected");
        $(tab).addClass("tab_selected");
      });
    });
})(jQuery)