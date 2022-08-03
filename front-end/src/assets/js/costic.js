(function($) {

  /* ============================= Start Of Setting Javascript =============================== */


  $(".ms-settings-toggle").on('click', function(e){
    $('.ms-body').toggleClass('ms-settings-open');
  });

  $("#dark-mode").on('click', function(){
    $('.ms-body').toggleClass('ms-dark-theme');
  });
  $("#remove-quickbar").on('click', function(){
    $('.ms-body').toggleClass('ms-has-quickbar');
  });
  $("#hide-aside-left").on('click', function(){
    $('.ms-body').toggleClass('ms-aside-left-open');
  });

/* ============================= End Of Setting Javascript =============================== */

/* ============================= Start Of Framework Javascript =============================== */


  /*========= Costic Framework ===========*/
  var CosticFramework = (function(){

    /* Initialize all required functions */
    function init(){

      CosticShortcuts();

      setActiveMenuItem();

      customToggleActions();

      draggableElements('.ms-sortable', '.ms-draggable', 'enable', false);
      sortableLists();

      if($(".ms-quick-bar").length > 0){
        quickBarToggle();
        quickBarConfigure();
      }

      customScrollbar();

      tooltipsInit();
      resetPopperPositioning();

      initRoundedProgress();

      notesMemberAppend();
      notesMemberRemove();
      deletableItem();

      addTaskBlockQB();
      addTaskBlockApp();
      addTask();
      confirmTask();
      taskComplete();

      starRating();

      formValidation();

      emailCheckAll();
      emailFlag();

      initDatePickers();

    }

    /* Preloaders */
    $(window).on('load', function(){
      $('#preloader-wrap').addClass('loaded');
    });

    /* Custom Keyboard Shortcuts */
    function CosticShortcuts(){
      var quickBarItems = document.getElementsByClassName("ms-quick-bar-item");
      $('body').on('keyup', function(e){
        // Hide Quickbar - KEY = ESCAPE
        if(e.keyCode == 27){
          quickBarReset();
        }
        // Enable Quickbar configure mode - KEY = ALT + Q
        if(e.altKey && e.keyCode == 81){
          $('.ms-configure-qa').trigger('click');
        }
        // Launch first Quickbar item - KEY = ALT + 1
        if(e.altKey && e.keyCode == 49){
          $(quickBarItems[0]).find("a:first-child").trigger('click');
        }
        // Launch second Quickbar item - KEY = ALT + 2
        if(e.altKey && e.keyCode == 50){
          $(quickBarItems[1]).find("a:first-child").trigger('click');
        }
        // Launch third Quickbar item - KEY = ALT + 3
        if(e.altKey && e.keyCode == 51){
          $(quickBarItems[2]).find("a:first-child").trigger('click');
        }
        // Launch fourth Quickbar item - KEY = ALT + 4
        if(e.altKey && e.keyCode == 52){
          $(quickBarItems[3]).find("a:first-child").trigger('click');
        }
        // Launch fifth Quickbar item - KEY = ALT + 5
        if(e.altKey && e.keyCode == 53){
          $(quickBarItems[4]).find("a:first-child").trigger('click');
        }
        // Launch sixth Quickbar item - KEY = ALT + 6
        if(e.altKey && e.keyCode == 54){
          $(quickBarItems[5]).find("a:first-child").trigger('click');
        }

      });
    }

    /* Checks the protocol being used  (storeToLocal needs a running webserver on IE) */
    // function checkReffererProtocol(){
    //   return (location.protocol == 'http:' || location.protocol == 'https:');
    // }

    /* Store to local storage */
    function storeToLocal(key, items){
      localStorage[key] = JSON.stringify(items);
    }

    /* Get from local storage */
    function getFromLocal(key){
      if(localStorage[key])
        return JSON.parse(localStorage[key]);
      else
        return [];
    }

    /* Sets the active class to the currently viewed page */
    function setActiveMenuItem(){
      var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
      $('.ms-main-aside .menu-item a', $('#ms-side-nav')).each(function() {
        var $this = $(this);
        if (current === "" || current === "index.html") {
          //for root url
          if ($this.attr('href').indexOf("index.html") !== -1) {
            $(this).addClass('active');
            $(this).parents('.collapse').prev().addClass('active');
            if ($(this).parents('.collapse').length) {
              $(this).closest('.collapse').addClass('show');
            }
          }
        } else {
          //for other url
          if ($this.attr('href').indexOf(current) !== -1) {
            $(this).addClass('active');
            $(this).parents('.collapse').prev().addClass('active');
            if ($(this).parents('.collapse').length) {
              $(this).closest('.collapse').addClass('show');
            }
          }
        }
      });
    }

    /*  Custom Toggle Actions */
    function customToggleActions(){
      $(".ms-toggler").bind('click', function(){
        var target = $(this).data('target');
        var toggleType = $(this).data('toggle');
        switch(toggleType) {

        //Aside Left
        case 'slideLeft':
            $(target).toggleClass('ms-aside-open');
            $(".ms-aside-overlay.ms-overlay-left").toggleClass('d-block');
            $(".ms-body").toggleClass('ms-aside-left-open');
            break;
        // Aside Right
        case 'slideRight':
          $(target).toggleClass('ms-aside-open');
          $(".ms-aside-overlay.ms-overlay-right").toggleClass('d-block');
          break;
        // Navbar Slide down
        case 'slideDown':
          $(target).toggleClass('ms-slide-down');
          break;
        // Quick bar
        case 'hideQuickBar':
          quickBarReset();
          break;
        default:
          return;

        }

      });
    }

    /* Drag with Sorting */
    function draggableElements(elemToSort, elemToDrag, stateSort, stateDrag){
      $( elemToSort ).sortable({
        scroll: false,
        placeholder: "ui-state-highlight",
        start: function(e, ui){
          ui.placeholder.height(ui.item.height());
          ui.placeholder.width(ui.item.width());
        }
      });
      $( elemToSort ).sortable(stateSort);
      $( elemToDrag ).draggable({
        opacity: 0.75,
        connectToSortable: elemToSort,
        containment: 'parent',
        revert: "invalid",
        disabled: stateDrag,
      });
      $( elemToSort ).disableSelection();
    }

    /* Allows an element to be droppable */
    function sortableLists(){
      $('.ms-sortable-list').sortable({
        opacity: 0.75,
        connectWith: '.ms-sortable-list',
        placeholder: "ui-state-highlight",
        start: function(e, ui){
          ui.placeholder.height(ui.item.height());
        }
      }).disableSelection();

    }

    /* Quickbar */
    function quickBarToggle(){

      $(".ms-quick-bar-list").on('click', '.ms-has-qa', function(){
        if( isConfigureMode() == false ){
          $(".ms-quick-bar").addClass("ms-quick-bar-open");
          $('.ms-quick-bar-title').text($(this).data('title'));
        }
      });

    }

    /* Checks if configure mode is enabled */
    function isConfigureMode(){
      return $('.ms-quick-bar-list').hasClass('ms-qa-configure-mode');
    }

    /* Reset quick bar */
    function quickBarReset(){
      $(".ms-quick-bar").removeClass("ms-quick-bar-open");
      $('.ms-quick-bar-item > a').removeClass('active show');
      $('.ms-quick-bar-item > a').attr('aria-selected', 'false');
      $('.ms-quick-bar > .tab-content .tab-pane').removeClass('active show');
    }

    /* Animate Round progress bars */
    function animateRoundedProgress(rpb){
      if (!$(rpb).hasClass('animated')){
        $(rpb).css('stroke-dashoffset', 358.141563 - (358.141563 / 100) * $(rpb).attr('aria-valuenow'));
        $(rpb).addClass('animated');
      }
    }
    function initRoundedProgress() {
      var roundedProgress = $('.progress-cicle');
      roundedProgress.each(function () {
        animateRoundedProgress(this);
      });
    }

    /* Configure Quick Bar */
    function quickBarConfigure(){

      var stateSort, stateDrag;
      draggableElements('.ms-quick-bar-list', '.ms-has-qa', 'disable', true);
      $('.ms-configure-qa').on('click', function(e){
        e.preventDefault();
        $('.ms-quick-bar-item a').removeAttr('data-toggle');
        quickBarReset();

        $('.ms-quick-bar-list').toggleClass('ms-qa-configure-mode');
        stateSort = ($('.ms-quick-bar-list').hasClass('ms-qa-configure-mode')) ? "enable" : "disable";
        stateDrag = (stateSort == 'disable') ? true : false;

        if( stateSort == 'disable' ){
          $('.ms-quick-bar-item a').attr('data-toggle', 'tab');
          quickBarSaveLocal();
        }

        draggableElements('.ms-quick-bar-list', '.ms-has-qa', stateSort, stateDrag);
      });

    }

    // // /* Save Quickbar Markup in local application storage */
    // function quickBarSaveLocal(){

    //   if(checkReffererProtocol()){
    //     var quickBarLayout = $('.ms-quick-bar-list')[0].innerHTML;
    //     storeToLocal('quickbar_layout', quickBarLayout);
    //   }

    // }

    /* Populate Quickbar with saved values */
    // function quickBarPopulate(){
    //   if(checkReffererProtocol()){
    //     var localQuickBar = getFromLocal("quickbar_layout");
    //     if(localQuickBar.length > 0){
    //       $('.ms-quick-bar-list')[0].innerHTML = localQuickBar;
    //     }
    //   }
    // }

    /* Custom Scrollbar */
    function customScrollbar(){
      // Scroll bar in content
      if( $('.ms-scrollable').length > 0 ){
        $('.ms-scrollable').each(function(){
          var ps = new PerfectScrollbar($(this)[0], {
            maxScrollbarLength : 700,
            wheelPropagation : true
          });
        });
      }
      //Special Case for Side nav
      if( $('.ms-aside-scrollable').length > 0 ){
        var psAside = new PerfectScrollbar($('.ms-aside-scrollable')[0], {
          maxScrollbarLength : 700,
          wheelPropagation : true,
          wheelSpeed : 0.5
        });

        $(".ms-main-aside").on('click', '.has-chevron', function(){
          psAside.update();
        });
      }

    }

    /* Bootstrap Tooltips */
    function tooltipsInit(){
      $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        trigger: 'hover',
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
      });
    }

    /* Prevent Popper from using its own X-placement for placing Dropdowns */
    function resetPopperPositioning(){
      Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;
    }

    /* @TODO: MOVE WHATS AFTER THIS COMMENT TO THEIR OWN DESIGNATED SCRIPT FILES */

    /* Notes Members Add */
    function notesMemberAppend(){
      $('.ms-members-list').on('click', 'a', function(){
        var memberSrc = $(this).find('img').attr('src');
        $(this).closest('.ms-card-footer').prev().find('.ms-note-members').append('<li class="ms-deletable"> <img src="' + memberSrc + '" alt="member"> </li>');
      });
    }

    /* Notes Members Remove */
    function notesMemberRemove(){
      $('.ms-note-members').on('click', '.ms-deletable', function(){
        $(this).remove();
      });
    }

    /* Notes Remove */
    function deletableItem(){
      $('body').on('click', '.ms-delete-trigger', function(){
        $(this).closest('.ms-deletable').slideUp('slow', function(){ $(this).closest('.ms-deletable').remove(); });
      });
    }

    /* Add Task Block (QuickBar) */
    function addTaskBlockQB(){
      $(".ms-add-task-block").on('submit', function(e){
        e.preventDefault();
        $(".ms-quickbar-container .ms-todo-list").prepend(
          '<div class="ms-card ms-qa-card ms-deletable"> <div class="ms-card-header clearfix">' +
          '<h6 class="ms-card-title">'+ $("#task-block").val() +'</h6> <button data-toggle="tooltip" data-placement="left" title="Add a Task to this block" class="ms-add-task-to-block ms-btn-icon float-right">' +
          '<i class="material-icons">add</i> </button> </div> <div class="ms-card-body"> <ul class="ms-list ms-task-block"> </ul></div>' +
          '<div class="ms-card-footer clearfix"><a href="#" class="text-disabled mr-2"> <i class="flaticon-archive"> </i> Archive </a><a href="#" class="text-disabled ms-delete-trigger float-right">' +
          '<i class="flaticon-trash"> </i> Delete </a> </div> </div>'
        );
      });
    }

    /* Add Task Block (App) */
    function addTaskBlockApp(){
      $(".ms-add-task-block-2").on('submit', function(e){
        e.preventDefault();
        $(".ms-todo-list").prepend(
          '<div class="col-xl-4 col-md-6 col-sm-12 ms-deletable"> <div class="ms-card"> <div class="ms-card-header clearfix">' +
          '<h6 class="ms-card-title">'+ $("#task-block-2").val() +'</h6> <button data-toggle="tooltip" data-placement="left" title="Add a Task to this block" class="ms-add-task-to-block ms-btn-icon float-right">' +
          '<i class="material-icons">add</i> </button> </div> <div class="ms-card-body"> <ul class="ms-list ms-task-block"> </ul></div>' +
          '<div class="ms-card-footer clearfix"><a href="#" class="text-disabled mr-2"> <i class="flaticon-archive"> </i> Archive </a><a href="#" class="text-disabled ms-delete-trigger float-right">' +
          '<i class="flaticon-trash"> </i> Delete </a> </div> </div> </div>'
        );
      });
    }

    /* Add a Task to Block */
    function addTask(){
      $('.ms-todo-list').on('click', '.ms-add-task-to-block' , function(){
        var taskBlock = $(this).parent().next().find('.ms-task-block');
        taskBlock.append(
          '<li class="ms-list-item ms-to-do-task ms-deletable">' +
          '<label class="ms-checkbox-wrap ms-todo-complete" for="">' +
          '<input type="checkbox" name="" value="">' +
          '<i class="ms-checkbox-check"></i>' +
          '</label>' +
          '<form class="ms-confirm-task-form"> <input type="text" class="ms-task-input ms-task-edit"/>' +
          '<button type="submit" class="close"><i class="material-icons fs-16 ms-confirm-trigger">check</i></button></form>' +
          '</li>'
        );
        taskBlock.find('.ms-task-edit').focus();
      });
    }

    /* Confirm task after adding */
    function confirmTask(){
      $(".ms-todo-list").on('submit', '.ms-confirm-task-form', function(e){
        e.preventDefault();
        var confirmBtn = $(this).find('i');
        var taskInput = $(this).find('.ms-task-input');
        confirmBtn.removeClass('material-icons fs-14 ms-confirm-trigger');
        confirmBtn.addClass('');
        confirmBtn.text('');
        $(this).replaceWith('<span>'+ taskInput.val() +'</span><button class="close"><i class="flaticon-trash ms-delete-trigger"> </i></button>');

      });
    }

    /* Complete To-Do Task */
    function taskComplete(){
      $(".ms-todo-list").on('click', '.ms-todo-complete' , function(){
        $(this).parent().toggleClass('task-complete');
      });
    }

    /* Star Rating */
    function starRating(){
      $('.ms-star-rating').on('click', '.ms-rating-item', function(){
        $(this).prevAll().removeClass('rated');
        $(this).addClass('rated');
        $(this).nextAll().addClass('rated');
      });
    }

    /* Form Validation */
    function formValidation(){
      window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    }

    /* Email Check All Checkbox */
    function emailCheckAll(){
      $(".ms-email-check-all").on('click', function(){
        $(".ms-email input").not(this).prop('checked', this.checked);
      });
    }

    /* Sets an email as flagged */
    function emailFlag(){
      $(".ms-email-content").on('click', '.ms-pin-email', function(){
        $(this).closest('.ms-email').toggleClass('pinned');
      });
    }

    /* Initialize Datepickers */
    function initDatePickers(){
      $(".datepicker").each(function(){
        $(this).datepicker();
      });
    }

    return {
      init: init
    }

  })();

  CosticFramework.init();

/* ============================= End Of Framework Javascript =============================== */



/* ============================= Start Of Charts Javascript =============================== */
$(function(){
  if($('canvas').is('#pie-chart')){
          //Pie Chart
        new Chart(document.getElementById("pie-chart"), {
          type: 'pie',
          data: {
            labels: ["Hunger House", "Food Lounge", "Delizious", "Red Resturant", "Hunger Lounge"],
            datasets: [{
              label: "Population (millions)",
              backgroundColor: ["#ff6877", "#f7b11b","#ff6c60","#8663e1","#08bf6f"],
              data: [2478,5267,734,784,433]
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Predicted Resturant Ratings (millions) in 2050'
            }
          }
        });
    }
});
  


$(function(){
  if($('canvas').is('#bar-chart')){
  // Bar chart
  var barChart = new Chart(document.getElementById("bar-chart"), {
      type: 'bar',
      data: {
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#ff6877", "#f7b11b","#ff6c60","#8663e1","#08bf6f"],
            data: [2478,5267,1734,3384,1433]
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Predicted world population (millions) in 2050'
        }
      }
  });
  }
});


$(function(){
  if($('canvas').is('#line-chart')){
  //Line Chart
  var ctx = document.getElementById('line-chart').getContext("2d");
  var gradientStroke = ctx.createLinearGradient(0, 0, 0, 450);
  gradientStroke.addColorStop(0, '#ff6877');

  var gradientFill = ctx.createLinearGradient(0, 0, 0, 450);
  gradientFill.addColorStop(0, "rgba(53,127,250,0.4)");
  gradientFill.addColorStop(1, "rgba(255,255,255,0)");

  // all data
  var data_1 = [1800, 1600, 2300, 2800, 3600, 2900, 3000, 3800, 3600];
  var data_2 = [4100, 3800, 3200, 3400, 2700, 2600, 3300, 3000, 2900];
  var labels = ["Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17","Jan-18", "Jan-19"];

  var lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: gradientStroke,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
            pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            pointBorderWidth: 1,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 2,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 1,
            data: data_1
        }]
    },
    options: {
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: "rgba(0,0,0,0.5)",
              fontStyle: "bold",
              beginAtZero: true,
              maxTicksLimit: 200,
              padding: 20
            },
            gridLines: {
              drawTicks: false,
              display: false
            }

        }],
        xAxes: [{
            gridLines: {
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "rgba(0,0,0,0.5)",
              fontStyle: "bold"
            }
        }]
      }
    }
  });
}
});


$(function(){
  if($('canvas').is('#polar-chart')){
  //Polar Chart
  new Chart(document.getElementById("polar-chart"), {
    type: 'polarArea',
    data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [
        {
          label: "Population (millions)",
          backgroundColor: ["#ff6877", "#f7b11b","#ff6c60","#8663e1","#08bf6f"],
          data: [2478,5267,734,784,433]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }
    }
  });

}
});

  //Doughnut Chart
  $(function(){
  if($('canvas').is('#doughnut-chart')){
  new Chart(document.getElementById("doughnut-chart"), {
    type: 'doughnut',
    data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [
        {
          label: "Population (millions)",
          backgroundColor: ["#ff6877", "#f7b11b","#ff6c60","#8663e1","#08bf6f"],
          data: [2478,5267,734,784,433]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }
    }
  });
  }
});

  //Group Bar Chart
  $(function(){
  if($('canvas').is('#bar-chart-grouped')){
  new Chart(document.getElementById("bar-chart-grouped"), {
    type: 'bar',
    data: {
      labels: ["1900", "1950", "1999", "2050"],
      datasets: [
        {
          label: "Africa",
          backgroundColor: "#3e95cd",
          data: [133,221,783,2478]
        }, {
          label: "Europe",
          backgroundColor: "#8e5ea2",
          data: [408,547,675,734]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Population growth (millions)'
      }
    }
  });
   }
});

  //Mixed Chart
  $(function(){
  if($('canvas').is('#mixed-chart')){
  new Chart(document.getElementById("mixed-chart"), {
    type: 'bar',
    data: {
      labels: ["1900", "1950", "1999", "2050"],
      datasets: [{
          label: "Europe",
          type: "line",
          borderColor: "#8e5ea2",
          data: [408,547,675,734],
          fill: false
        }, {
          label: "Africa",
          type: "line",
          borderColor: "#3e95cd",
          data: [133,221,783,2478],
          fill: false
        }, {
          label: "Europe",
          type: "bar",
          backgroundColor: "#ff6c60",
          data: [408,547,675,734],
        }, {
          label: "Africa",
          type: "bar",
          backgroundColor: "#f7b11b",
          backgroundColorHover: "#3e95cd",
          data: [133,221,783,2478]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Population growth (millions): Europe & Africa'
      },
      legend: { display: false }
    }
  });
  }
});

/* ============================= End Of Charts Javascript =============================== */


/* ============================= Start Of Client-Management Javascript =============================== */


  //Pie Chart
  $(function(){
  if($('canvas').is('#pie-chart')){
  new Chart(document.getElementById("pie-chart"), {
    type: 'pie',
    data: {
      labels: ["Hunger House", "Food Lounge", "Delizious", "Red Resturant", "Hunger Lounge"],
      datasets: [{
        label: "Users (thousands)",
        backgroundColor: ["#ff6877", "#f7b11b","#ff6c60","#8663e1","#08bf6f"],
        data: [725,890,729,316,275]
      }]
    },
    options: {
      title: {
        display: false,
        text: 'Users By Country'
      },
      legend: {
        display: false
      },
    }
  });
  }
});

  //Line Chart
  $(function(){
  if($('canvas').is('#line-chart')){
  var ctx = document.getElementById('line-chart').getContext("2d");
  var gradientStroke = ctx.createLinearGradient(0, 0, 0, 450);
  gradientStroke.addColorStop(0, '#ff6877');

  var gradientFill = ctx.createLinearGradient(0, 0, 0, 450);
  gradientFill.addColorStop(0, "rgba(53,127,250,0.4)");
  gradientFill.addColorStop(1, "rgba(255,255,255,0)");

  // all data
  var data_1 = [1800, 1600, 2300, 2800, 3600, 2900, 3000, 3800, 3600];
  var data_2 = [4100, 3800, 3200, 3400, 2700, 2600, 3300, 3000, 2900];
  var labels = ["Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17","Jan-18", "Jan-19"];

  var lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Users",
            borderColor: gradientStroke,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
            pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            pointBorderWidth: 1,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 2,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 1,
            data: data_1
        }]
    },
    options: {
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: "rgba(0,0,0,0.5)",
              fontStyle: "bold",
              beginAtZero: true,
              maxTicksLimit: 200,
              padding: 20
            },
            gridLines: {
              drawTicks: false,
              display: false
            }

        }],
        xAxes: [{
            gridLines: {
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "rgba(0,0,0,0.5)",
              fontStyle: "bold"
            }
        }]
      }
    }
  })
  }
});

  /* Engaged Users */
  $(function(){
  if($('canvas').is('#engaged-users')){
  var engagedUsersCtx = document.getElementById('engaged-users').getContext("2d");
  var gradientStrokeengagedUsers = engagedUsersCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokeengagedUsers.addColorStop(0, '#07be6e');

  var gradientFillengagedUsers = engagedUsersCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillengagedUsers.addColorStop(0, "rgba(7, 190, 110,0.3)");
  gradientFillengagedUsers.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(engagedUsersCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokeengagedUsers,
            pointBorderColor: gradientStrokeengagedUsers,
            pointBackgroundColor: gradientStrokeengagedUsers,
            pointHoverBackgroundColor: gradientStrokeengagedUsers,
            pointHoverBorderColor: gradientStrokeengagedUsers,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillengagedUsers,
            borderWidth: 2,
            data: [5,1,8,1,3,7,8,4,3,6,8,9,4,5,8,2,6,4,8,3]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

  /* Page Impressions */
  $(function(){
  if($('div').is('#page-impressions')){
  var pageImpressionsCtx = document.getElementById('page-impressions').getContext("2d");
  var gradientStrokepageImpressions = pageImpressionsCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokepageImpressions.addColorStop(0, '#07be6e');

  var gradientFillpageImpressions = pageImpressionsCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillpageImpressions.addColorStop(0, "rgba(7, 190, 110,0.3)");
  gradientFillpageImpressions.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(pageImpressionsCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokepageImpressions,
            pointBorderColor: gradientStrokepageImpressions,
            pointBackgroundColor: gradientStrokepageImpressions,
            pointHoverBackgroundColor: gradientStrokepageImpressions,
            pointHoverBorderColor: gradientStrokepageImpressions,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillpageImpressions,
            borderWidth: 2,
            data: [8,5,1,8,5,9,4,3,4,5,8,4,4,8,9,5,5,1,3,6]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  })
   }
});

/* ============================= End Of Client-Management Javascript =============================== */


/* ============================= Start Of Clients Javascript =============================== */

/* Youtube Subs */
$(function(){
  if($('canvas').is('#home-youtube-subscribers')){
var data_1 = [7, 6, 3, 5, 4, 2, 3, 6, 8, 5, 7];
var data_2 = [0, -4, -2, 0, -5, -3, 0, 0, -2, -5, -3];
var labels = ["12 AM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 PM", "2 PM", "6 PM", "8 AM", "10 PM"];
var youtubeSubs = new Chart(document.getElementById("home-youtube-subscribers"), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
          label: "Repeat order",
          backgroundColor: '#ff6877',
          data: data_1
       }, {
          label: "New order",
          backgroundColor: '#000000',
          data: data_2
       }],
    },
    options: {
      legend: { display: false },
      title: {
        display: false,
      },
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      },
    }
});
}
});

/* ============================= End Of Clients Javascript =============================== */


/* ============================= Start Of Coming Soon Javascript =============================== */


  $("#countdown-duration")
  .countdown("2021/01/01", function(event) {
    $("#days").text( event.strftime('%D') );
    $("#hours").text( event.strftime('%H') );
    $("#minutes").text( event.strftime('%M') );
    $("#seconds").text( event.strftime('%S') );
  });

/* ============================= End Of Coming Soon Javascript =============================== */


/* ============================= Start Of Crop Javascript =============================== */

  
  /* Default */
  $(function(){
  if($('img').is('#default')){
  var defaultCrop = document.getElementById('default');
  var cropper = new Cropper(defaultCrop, {
    aspectRatio: 16 / 9,
    responsive: true,
  })
  }
});

  /* Zoom Disabled */
  $(function(){
  if($('img').is('#zoom-disabled')){
  var zoomDisabled = document.getElementById('zoom-disabled');
  var cropper1 = new Cropper(zoomDisabled, {
    aspectRatio: 16 / 9,
    responsive: true,
    zoomable: false
  });
  }
});

  /* Has Preview */
  $(function(){
  if($('img').is('#cropper-expanded')){
  var cropperExpanded = document.getElementById('cropper-expanded');
  var cropperExp = new Cropper(cropperExpanded, {
    aspectRatio: 16 / 9,
    guides: false,
    responsive: true,
    preview: '.ms-crop-preview',
  });
   

  $("#zoom-in").on('click', function(){
    cropperExp.zoom(0.1);
  });
  $("#zoom-out").on('click', function(){
    cropperExp.zoom(-0.1);
  });
  $("#rotate-right").on('click', function(){
    cropperExp.rotate(45);
  });
  $("#rotate-left").on('click', function(){
    cropperExp.rotate(-45);
  });
  $("#move-left").on('click', function(){
    cropperExp.move(-10, 0);
  });
  $("#move-down").on('click', function(){
    cropperExp.move(0, 10);
  });
  $("#move-right").on('click', function(){
    cropperExp.move(10, 0);
  });
  $("#move-up").on('click', function(){
    cropperExp.move(0, -10);
  });
  $("#lock").on('click', function(){
    cropperExp.disable();
  });
  $("#unlock").on('click', function(){
    cropperExp.enable();
  });
  $("#reset").on('click', function(){
    cropperExp.reset();
  });
}
});
/* ============================= End Of Crop Javascript =============================== */


/* ============================= Start Of CryptoCurrency Javascript =============================== */


  $("#news-flash").webTicker();

  //Crypto Overview slider
  $('.ms-crypto-overview-slider').slick({
  dots: false,
  arrows: false,
  infinite: false,
  slidesToShow: 9,
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 7,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    }
    ]
  });

  //Bitcoin chart
  $(function(){
  if($('canvas').is('#bitcoin-chart')){
  var ctx = document.getElementById('bitcoin-chart').getContext("2d");
  var gradientStroke = ctx.createLinearGradient(0, 0, 0, 450);
  gradientStroke.addColorStop(0, '#F7931A');

  var gradientFill = ctx.createLinearGradient(0, 0, 0, 450);
  gradientFill.addColorStop(0, "rgba(247, 147, 26,0.2)");
  gradientFill.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(ctx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        datasets: [{
            label: "Data",
            borderColor: gradientStroke,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
            pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 2,
            data: [4,3,2,3,1,4,3,5,4,5,4,6,7,5,4]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

  //Ethereum chart
  $(function(){
  if($('canvas').is('#ethereum-chart')){
  var ethereumCtx = document.getElementById('ethereum-chart').getContext("2d");
  var gradientStrokeEthereum = ethereumCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokeEthereum.addColorStop(0, '#4e8ee8');

  var gradientFillEthereum = ethereumCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillEthereum.addColorStop(0, "rgba(78, 142, 232,0.2)");
  gradientFillEthereum.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(ethereumCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokeEthereum,
            pointBorderColor: gradientStrokeEthereum,
            pointBackgroundColor: gradientStrokeEthereum,
            pointHoverBackgroundColor: gradientStrokeEthereum,
            pointHoverBorderColor: gradientStrokeEthereum,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillEthereum,
            borderWidth: 2,
            data: [4,5,3,7,5,7,8,9,7,6,7,7,6,5,3]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

  //zcash chart
  $(function(){
  if($('canvas').is('#zcash-chart')){
  var zCashCtx = document.getElementById('zcash-chart').getContext("2d");
  var gradientStrokeZCash = zCashCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokeZCash.addColorStop(0, '#e5a93d');

  var gradientFillZCash = zCashCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillZCash.addColorStop(0, "rgba(229, 169, 61,0.2)");
  gradientFillZCash.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(zCashCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokeZCash,
            pointBorderColor: gradientStrokeZCash,
            pointBackgroundColor: gradientStrokeZCash,
            pointHoverBackgroundColor: gradientStrokeZCash,
            pointHoverBorderColor: gradientStrokeZCash,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillZCash,
            borderWidth: 2,
            data: [5,6,8,1,5,3,9,7,5,8,7,3,6,9,1]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

  //Peercoin chart
  $(function(){
  if($('canvas').is('#peercoin-chart')){
  var peerCoinCtx = document.getElementById('peercoin-chart').getContext("2d");
  var gradientStrokePeercoin = peerCoinCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokePeercoin.addColorStop(0, '#3FA30C');

  var gradientFillPeercoin = peerCoinCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillPeercoin.addColorStop(0, "rgba(63, 163, 12,0.2)");
  gradientFillPeercoin.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(peerCoinCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokePeercoin,
            pointBorderColor: gradientStrokePeercoin,
            pointBackgroundColor: gradientStrokePeercoin,
            pointHoverBackgroundColor: gradientStrokePeercoin,
            pointHoverBorderColor: gradientStrokePeercoin,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillPeercoin,
            borderWidth: 2,
            data: [1,4,7,3,5,7,6,5,8,3,5,5,4,3,7]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

  //Real time rating chart
  $(function(){
  if($('canvas').is('#crypto-rating-graph')){
  var ratingCtx = document.getElementById("crypto-rating-graph").getContext("2d");
  var gradientStrokePrimary = ratingCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokePrimary.addColorStop(0, '#ff6877');

  var gradientFillPrimary = ratingCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillPrimary.addColorStop(0, "rgba(53,127,250,0.4)");
  gradientFillPrimary.addColorStop(1, "rgba(255,255,255,0)");

  var time = ["12 AM", "2 AM", "4 AM", "6 AM", "8 AM", "10 AM",
    "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"
  ];

  var data = {

    labels: ["12 AM", "2 AM", "4 AM", "6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"],
    datasets: [{
      label: "Price",
      borderColor: gradientStrokePrimary,
      pointBorderWidth: 9,
      pointRadius: 9,
      pointBorderColor: 'transparent',
      pointHoverRadius: 8,
      pointHoverBorderWidth: 3,
      pointHoverBackgroundColor: 'white',
      pointHoverBorderColor: '#ff6877',
      pointBackgroundColor: 'transparent',
      fill: true,
      backgroundColor: gradientFillPrimary,
      borderWidth: 2,
      data: [65, 59, 80, 81, 56, 55, 40, 70, 56, 76, 51, 59]
    }]
  };
  var options = {
    animation: false,
    scaleOverride: true,
    scaleSteps: 10,
    scaleStepWidth: 10,
    scaleStartValue: 0,
    elements: {
      line: {
          tension: 0
      }
    },
    legend: {
      display: false,
      position: "top"
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                padding: 20
            },
        }],
        xAxes: [{

            ticks: {
                padding: 20,
                beginAtZero: true,
            }
        }]
    }
  };


  var realTimeChart = new Chart(ratingCtx, {
    type: 'line',
    data: data,
    options: options,
  });
  

  //Update chart every 1 second
  setInterval(function() {
    setData(data.datasets[0].data);
    setLabels(data.labels);

    realTimeChart.data.datasets[0].data = data.datasets[0].data;
    realTimeChart.update();

  }, 1000);

  //Change labels
  function setLabels(labels) {
    var nextTimeIndex = time.indexOf(labels[labels.length - 1]) + 1;
    var nextTimeName = time[nextTimeIndex] != undefined ? time[nextTimeIndex] : "12 PM";
    labels.push(nextTimeName);
    labels.shift();
  }

  //Generate random data
  function setData(data) {
    data.push(Math.floor(Math.random() * 100) + 1);
    data.shift();
  }
  }
});

  //Active orders chart
  $(function(){
  if($('canvas').is('#active-orders')){
  var activeOrdersChart = new Chart(document.getElementById("active-orders"), {
    type: 'doughnut',
    data: {
      labels: ["Ehereum", "Bitcoin", "Dash", "Litecoin", "Peercoin"],
      datasets: [
        {
          label: "Population (millions)",
          borderColor: 'transparent',
          backgroundColor: ["#ff6877", "#f0ad4e","#d9534f","#445cc8","#5cb85c"],
          data: [478,267,734,784,433]
        }
      ]
    },
    options: {
      cutoutPercentage: 70,
      animation: {
        animateScale: true
      },
      title: {
        display: false,
        text: 'Predicted world population (millions) in 2050'
      },
      legend: {
        position: 'left',
        display: false,
      },
    }
  })
  }
});

  //Trends
  /* Sessions by Channel Trends Charts */
  var trend_1 = [1, 3, 5, 4, 3, 3, 4, 8, 5];
  var trend_2 = [3, 2, 5, 4, 8, 4, 5, 2, 3];
  var trend_3 = [7, 5, 4, 5, 4, 7, 5, 5, 4];
  var trend_4 = [3, 3, 4, 6, 7, 6, 6, 4, 3];
  var trend_5 = [5, 4, 6, 7, 6, 5, 5, 7, 4];
  var labels = ["Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17","Jan-18", "Jan-19"];
  var options = {
    legend: {
    display: false,
    position: "bottom"
    },
    scales: {
      yAxes: [{
        display: false,
      }],
      xAxes: [{
          display: false,
      }]
    },
    elements: {
       point:{
         radius: 0
       }
     }
  };
$(function(){
  if($('canvas').is('#trend-01')){
  new Chart(document.getElementById('trend-01').getContext("2d"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: '#F7931A',
            backgroundColor: 'transparent',
            borderWidth: 2,
            data: trend_1
        }]
    },
    options: options
  });
  }
});
$(function(){
  if($('canvas').is('#trend-02')){
  new Chart(document.getElementById('trend-02').getContext("2d"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: '#4e8ee8',
            backgroundColor: 'transparent',
            borderWidth: 2,
            data: trend_2
        }]
    },
    options: options
  });
  }
});
$(function(){
  if($('canvas').is('#trend-03')){
  new Chart(document.getElementById('trend-03').getContext("2d"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: '#3FA30C',
            backgroundColor: 'transparent',
            borderWidth: 2,
            data: trend_3
        }]
    },
    options: options
  });
  }
});
$(function(){
  if($('canvas').is('#trend-04')){
  new Chart(document.getElementById('trend-04').getContext("2d"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: '#3FA30C',
            backgroundColor: 'transparent',
            borderWidth: 2,
            data: trend_4
        }]
    },
    options: options
  });
  }
});
$(function(){
  if($('canvas').is('#trend-05')){
  new Chart(document.getElementById('trend-05').getContext("2d"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: '#F7931A',
            backgroundColor: 'transparent',
            borderWidth: 2,
            data: trend_5
        }]
    },
    options: options
  });
  }
});

  //Candle Chart
  function randomNumber(min, max) {
  	return Math.random() * (max - min) + min;
  }

  function getRandomBarNoTime(lastClose) {
  	var open = randomNumber(lastClose * .95, lastClose * 1.05);
  	var close = randomNumber(open * .95, open * 1.05);
  	var high = randomNumber(Math.max(open, close), Math.max(open, close) * 1.1);
  	var low = randomNumber(Math.min(open, close) * .9, Math.min(open, close));
  	return {
  		o: open,
  		h: high,
  		l: low,
  		c: close,
  	};
  }

  function randomBar(date, lastClose) {
  	var bar = getRandomBarNoTime(lastClose);
  	bar.t = date.valueOf();
  	return bar;
  }

  function getRandomData(date, count) {
  	var dateFormat = 'MMMM DD YYYY';
  	var date = moment(date, dateFormat);
  	var data = [randomBar(date, 30)];
  	while (data.length < count) {
  		date = date.clone().add(1, 'd');
  		if (date.isoWeekday() <= 5) {
  			data.push(randomBar(date, data[data.length - 1].c));
  		}
  	}
  	return data;
  }

  // Candlestick
  $(function(){
  if($('canvas').is('#candle-chart')){
  var candleStickCtx = document.getElementById("candle-chart").getContext("2d");
  var candleCount = 40;
  var candleData = getRandomData('April 01 2017', candleCount);

  var candlestickChart = new Chart(candleStickCtx, {
  	type: 'candlestick',
  	data: {
  		datasets: [{
        color: {
          up: "rgb(157,126,253)",
          down: "rgb(57,211,236)",
          unchanged: "grey",
        },
        borderColor: "rgb(157,126,253)",
        borderWidth: 2,
        backgroundColor: "red",
  			data: candleData
  		}]
  	},
    options: {
      scales: {
        xAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
              color: "rgba(0, 0, 0, 0)",
          }
        }]
      },
      legend: {
        display: false,
        position: 'left',
      },
    }
  });
  }
});

/* ============================= End Of CryptoCurrency Javascript =============================== */


/* ============================= Start Of Customer-Review Javascript =============================== */

//Line Chart
$(function(){
  if($('canvas').is('#line-chart')){
var ctx = document.getElementById('line-chart').getContext("2d");
var gradientStroke = ctx.createLinearGradient(0, 0, 0, 450);
gradientStroke.addColorStop(0, '#ff6877');

var gradientFill = ctx.createLinearGradient(0, 0, 0, 450);
gradientFill.addColorStop(0, "rgba(53,127,250,0.4)");
gradientFill.addColorStop(1, "rgba(255,255,255,0)");

// all data
var data_1 = [1800, 1600, 2300, 2800, 3600, 2900, 3000, 3800, 3600];
var data_2 = [4100, 3800, 3200, 3400, 2700, 2600, 3300, 3000, 2900];
var labels = ["Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17","Jan-18", "Jan-19"];

var lineChart = new Chart(ctx, {
  type: 'line',
  data: {
      labels: labels,
      datasets: [{
          label: "Data",
          borderColor: gradientStroke,
          pointBorderColor: gradientStroke,
          pointBackgroundColor: gradientStroke,
          pointHoverBackgroundColor: gradientStroke,
          pointHoverBorderColor: gradientStroke,
          pointBorderWidth: 1,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 2,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 1,
          data: data_1
      }]
  },
  options: {
      legend: {
      display: false,
      position: "bottom"
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: "rgba(0,0,0,0.5)",
            fontStyle: "bold",
            beginAtZero: true,
            maxTicksLimit: 200,
            padding: 20
          },
          gridLines: {
            drawTicks: false,
            display: false
          }

      }],
      xAxes: [{
          gridLines: {
            zeroLineColor: "transparent"
          },
          ticks: {
            padding: 20,
            fontColor: "rgba(0,0,0,0.5)",
            fontStyle: "bold"
          }
      }]
    }
  }
});
}
});



/* ============================= End Of Customer-Review Javascript =============================== */


/* ============================= Start Of Data-Tables Javascript =============================== */
 /* Audience Metrics Graph */
 $(function(){
  if($('canvas').is('#audience-metrics-chart')){
  var audienceMetricsCtx = document.getElementById('audience-metrics-chart').getContext("2d");
  var gradientStrokePrimary = audienceMetricsCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokePrimary.addColorStop(0, '#ff6877');

  var gradientFillPrimary = audienceMetricsCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillPrimary.addColorStop(0, "rgba(53,127,250,0.4)");
  gradientFillPrimary.addColorStop(1, "rgba(255,255,255,0)");

  // datasets 2
  var gradientStrokePrimaryDanger = audienceMetricsCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokePrimaryDanger.addColorStop(0, '#ec4e3f');

  var gradientFillPrimaryDanger = audienceMetricsCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillPrimaryDanger.addColorStop(0, "rgba(236, 78, 63,0.4)");
  gradientFillPrimaryDanger.addColorStop(1, "rgba(255, 255, 255,0)");

  // all data
  var data_1 = [3800, 3900, 3300, 3800, 4000, 4200, 4400, 3800, 4600, 3900, 3800];
  var data_2 = [2100, 3000, 2200, 2400, 2800, 2600, 2800, 2600, 2300, 2900, 2800];
  var labels = ["12 AM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 PM", "2 PM", "6 PM", "8 AM", "10 PM"];

  var audienceMetrics = new Chart(audienceMetricsCtx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: "Traffic",
              borderColor: gradientStrokePrimary,
              pointBorderWidth: 9,
              pointRadius: 9,
              pointBorderColor: 'transparent',
              pointHoverRadius: 8,
              pointHoverBorderWidth: 3,
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: '#ff6877',
              pointBackgroundColor: 'transparent',
              fill: true,
              backgroundColor: gradientFillPrimary,
              borderWidth: 2,
              data: data_1
          },
          {
              label: "Sales",
              borderColor: gradientStrokePrimaryDanger,
              pointBorderWidth: 9,
              pointRadius: 9,
              pointBorderColor: 'transparent',
              pointHoverRadius: 8,
              pointHoverBorderWidth: 3,
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: '#ec4e3f',
              pointBackgroundColor: 'transparent',
              fill: true,
              backgroundColor: gradientFillPrimaryDanger,
              borderWidth: 2,
              data: data_2
          }
          ]
      },
      options: {
          elements: {
            line: {
                tension: 0
            }
          },
          tooltips: {
            titleFontColor: '#3a3952',
            bodyFontFamily:  'Roboto',
            backgroundColor: '#FFF',
            bodyFontColor: '#878793',
            bodyFontSize: 14,
            displayColors: false,
            bodySpacing: 10,
            intersect: false,
            bodyFontStyle: 'bold',
            xPadding: 15,
            yPadding: 15,
            mode: 'index'
          },
          legend: {
            display: false,
            position: "top"
          },
          scales: {
              yAxes: [{
                  ticks: {
                      fontColor: "rgba(0,0,0,0.5)",
                      fontStyle: "bold",
                      beginAtZero: true,
                      maxTicksLimit: 200,
                      padding: 20
                  },
                  gridLines: {
                      drawTicks: false,
                      display: false
                  }

              }],
              xAxes: [{
                  gridLines: {
                      zeroLineColor: "transparent"
                  },
                  ticks: {
                      padding: 20,
                      beginAtZero: true,
                      fontColor: "rgba(0,0,0,0.5)",
                      fontStyle: "bold"
                  }
              }]
          }
      }
  })
  }
});

/* ============================= End Of Earning-Graph Javascript =============================== */


/* ============================= Start Of Form-Wizard Javascript =============================== */


  $("#default-wizard").steps({
    headerTag: "h3",
    bodyTag: "div",
    autoFocus: true,
    titleTemplate: '#title#',
    labels: {
      current: "",
      finish: 'Submit',
      previous: 'Back'
    },
    onFinished: function(event, currentIndex) {
      alert("Form Submitted Successfully!");
    }
  });

  $(".style2-wizard, .style3-wizard, .style4-wizard").steps({
    headerTag: "h3",
    bodyTag: "div",
    autoFocus: true,
    titleTemplate: '<span class="number">#index#</span> #title#',
    labels: {
      current: "",
      finish: 'Submit',
      previous: 'Back'
    },
    onFinished: function(event, currentIndex) {
      alert("Form Submitted Successfully!");
    }
  });

/* ============================= End Of Form-Wizard Javascript =============================== */




/* ============================= Start Of Google-Map Javascript =============================== */


function initMap() {
  //Map location
  var MapLocation = {
    lat: 31.53912,
    lng: -89.29163
  };

  // Map Zooming
  var MapZoom = 12;

  // Basic Map
  var MapWithMarker = new google.maps.Map(document.getElementById('map-with-marker'), {
    zoom: MapZoom,
    center: MapLocation
  });
  var marker_1 = new google.maps.Marker({
    position: MapLocation,
    map: MapWithMarker
  });

  // Map without controls
  var MinimalMap = new google.maps.Map(document.getElementById('map-minimal'), {
    zoom: MapZoom,
    center: MapLocation,
    disableDefaultUI: true
  });
  var marker_2 = new google.maps.Marker({
    position: MapLocation,
    map: MinimalMap
  });

  // Night Mode
  var NightModeMap = new google.maps.Map(document.getElementById('night-mode-map'), {
    zoom: MapZoom,
    center: MapLocation,
    styles: [{
      "featureType": "all",
      "elementType": "all",
      "stylers": [{
          "saturation": -100
        },
        {
          "gamma": 0.5
        }
      ]
    }]
  });

  // Apple Theme
  var AppletThemeMap = new google.maps.Map(document.getElementById('apple-map-theme'), {
    zoom: MapZoom,
    center: MapLocation,
    styles: [{
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [{
          "color": "#f7f1df"
        }]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [{
          "color": "#d0e3b4"
        }]
      },
      {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [{
          "color": "#fbd3da"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
          "color": "#bde6ab"
        }]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#ffe15f"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#efd151"
        }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "black"
        }]
      },
      {
        "featureType": "transit.station.airport",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#cfb2db"
        }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#a2daf2"
        }]
      }
    ]
  });

  // Nature Theme
  var NatureThemeMap = new google.maps.Map(document.getElementById('nature-map-theme'), {
    zoom: MapZoom,
    center: MapLocation,
    styles: [{
        "featureType": "landscape",
        "stylers": [{
            "hue": "#FFA800"
          },
          {
            "saturation": 0
          },
          {
            "lightness": 0
          },
          {
            "gamma": 1
          }
        ]
      },
      {
        "featureType": "road.highway",
        "stylers": [{
            "hue": "#53FF00"
          },
          {
            "saturation": -73
          },
          {
            "lightness": 40
          },
          {
            "gamma": 1
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "stylers": [{
            "hue": "#FBFF00"
          },
          {
            "saturation": 0
          },
          {
            "lightness": 0
          },
          {
            "gamma": 1
          }
        ]
      },
      {
        "featureType": "road.local",
        "stylers": [{
            "hue": "#00FFFD"
          },
          {
            "saturation": 0
          },
          {
            "lightness": 30
          },
          {
            "gamma": 1
          }
        ]
      },
      {
        "featureType": "water",
        "stylers": [{
            "hue": "#00BFFF"
          },
          {
            "saturation": 6
          },
          {
            "lightness": 8
          },
          {
            "gamma": 1
          }
        ]
      },
      {
        "featureType": "poi",
        "stylers": [{
            "hue": "#679714"
          },
          {
            "saturation": 33.4
          },
          {
            "lightness": -25.4
          },
          {
            "gamma": 1
          }
        ]
      }
    ]
  });

  // Captor Theme
  var CaptorThemeMap = new google.maps.Map(document.getElementById('captor-map-theme'), {
    zoom: MapZoom,
    center: MapLocation,
    styles: [{
        "featureType": "water",
        "stylers": [{
          "color": "#0e171d"
        }]
      },
      {
        "featureType": "landscape",
        "stylers": [{
          "color": "#1e303d"
        }]
      },
      {
        "featureType": "road",
        "stylers": [{
          "color": "#1e303d"
        }]
      },
      {
        "featureType": "poi.park",
        "stylers": [{
          "color": "#1e303d"
        }]
      },
      {
        "featureType": "transit",
        "stylers": [{
            "color": "#182731"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [{
            "color": "#f0c514"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#1e303d"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#e77e24"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#94a5a6"
        }]
      },
      {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [{
            "visibility": "simplified"
          },
          {
            "color": "#e84c3c"
          }
        ]
      },
      {
        "featureType": "poi",
        "stylers": [{
            "color": "#e84c3c"
          },
          {
            "visibility": "off"
          }
        ]
      }
    ]
  });

  // Avagardo Theme
  var AvagardoThemeMap = new google.maps.Map(document.getElementById('avocado-map-theme'), {
    zoom: MapZoom,
    center: MapLocation,
    styles: [{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "on"
          },
          {
            "color": "#aee2e0"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#abce83"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#769E72"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#7B8758"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#EBF4A4"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "simplified"
          },
          {
            "color": "#8dab68"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
          "visibility": "simplified"
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#5B5B3F"
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#ABCE83"
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
          "color": "#A4C67D"
        }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
          "color": "#9BBF72"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
          "color": "#EBF4A4"
        }]
      },
      {
        "featureType": "transit",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
            "visibility": "on"
          },
          {
            "color": "#87ae79"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#7f2200"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#ffffff"
          },
          {
            "visibility": "on"
          },
          {
            "weight": 4.1
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#495421"
        }]
      },
      {
        "featureType": "administrative.neighborhood",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      }
    ]
  });

  // Propia Theme
  var PropiaThemeMap = new google.maps.Map(document.getElementById('propia-map-theme'), {
    zoom: MapZoom,
    center: MapLocation,
    styles: [{
        "featureType": "landscape",
        "stylers": [{
            "visibility": "simplified"
          },
          {
            "color": "#2b3f57"
          },
          {
            "weight": 0.1
          }
        ]
      },
      {
        "featureType": "administrative",
        "stylers": [{
            "visibility": "on"
          },
          {
            "hue": "#ff0000"
          },
          {
            "weight": 0.4
          },
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [{
            "weight": 1.3
          },
          {
            "color": "#FFFFFF"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f55f77"
          },
          {
            "weight": 3
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f55f77"
          },
          {
            "weight": 1.1
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f55f77"
          },
          {
            "weight": 0.4
          }
        ]
      },
      {},
      {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [{
            "weight": 0.8
          },
          {
            "color": "#ffffff"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [{
            "color": "#ffffff"
          },
          {
            "weight": 0.7
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi",
        "stylers": [{
          "color": "#6c5b7b"
        }]
      },
      {
        "featureType": "water",
        "stylers": [{
          "color": "#f3b191"
        }]
      },
      {
        "featureType": "transit.line",
        "stylers": [{
          "visibility": "on"
        }]
      }
    ]
  });
}

/* ============================= End Of Google-Maps Javascript =============================== */


/* ============================= Start Of Morris-Charts Javascript =============================== */


  // Line chart
  $(function(){
  if($('div').is('#line-chart')){
  new Morris.Line({
    element: 'line-chart',
    data: [
      { year: '2008', value: 20 },
      { year: '2009', value: 10 },
      { year: '2010', value: 5 },
      { year: '2011', value: 5 },
      { year: '2012', value: 20 }
    ],
    xkey: 'year',
    ykeys: ['value'],
    labels: ['Value']
  });
 }
});
  


  // Bar Chart
   $(function(){
  if($('div').is('#bar-chart')){
  new Morris.Bar({
    element: 'bar-chart',
    data: [
      { y: '2006', a: 100, b: 90 },
      { y: '2007', a: 75,  b: 65 },
      { y: '2008', a: 50,  b: 40 },
      { y: '2009', a: 75,  b: 65 },
      { y: '2010', a: 50,  b: 40 },
      { y: '2011', a: 75,  b: 65 },
      { y: '2012', a: 100, b: 90 }
    ],
    xkey: 'y',
    ykeys: ['a', 'b'],
    labels: ['Series A', 'Series B']
  });
  }
});

  //Doughnut Chart
  $(function(){
  if($('div').is('#doughnut-chart')){
  new Morris.Donut({
    element: 'doughnut-chart',
    data: [
      {label: "Download Sales", value: 12},
      {label: "In-Store Sales", value: 30},
      {label: "Mail-Order Sales", value: 20}
    ]
  });
  }
});

  //Stacked Bar
   $(function(){
  if($('div').is('#stacked-bar-chart')){
  new Morris.Bar({
    element: 'stacked-bar-chart',
    data: [
      {x: '2011 Q1', y: 3, z: 2, a: 3},
      {x: '2011 Q2', y: 2, z: null, a: 1},
      {x: '2011 Q3', y: 0, z: 2, a: 4},
      {x: '2011 Q4', y: 2, z: 4, a: 3}
    ],
    xkey: 'x',
    ykeys: ['y', 'z', 'a'],
    labels: ['Y', 'Z', 'A'],
    stacked: true
  });
   }
});

  //Updating Chart
  $(function(){
  if($('div').is('#real-time-chart')){
  var nReloads = 0;
  function data(offset) {
    var ret = [];
    for (var x = 0; x <= 360; x += 10) {
      var v = (offset + x) % 360;
      ret.push({
        x: x,
        y: Math.sin(Math.PI * v / 180).toFixed(4),
        z: Math.cos(Math.PI * v / 180).toFixed(4)
      });
    }
    return ret;
  }
  
  var graph = new Morris.Line({
      element: 'real-time-chart',
      data: data(0),
      xkey: 'x',
      ykeys: ['y', 'z'],
      labels: ['sin()', 'cos()'],
      parseTime: false,
      ymin: -1.0,
      ymax: 1.0,
      hideHover: true
  });
  function update() {
    nReloads++;
    graph.setData(data(5 * nReloads));
    $('#reloadStatus').text(nReloads + ' reloads');
  }
  setInterval(update, 1000);
   }
}); 

  //Area Chart
   $(function(){
  if($('div').is('#area-chart')){
  new Morris.Area({
    element: 'area-chart',
    data: [
      { y: '2006', a: 100, b: 90 },
      { y: '2007', a: 75,  b: 65 },
      { y: '2008', a: 50,  b: 40 },
      { y: '2009', a: 75,  b: 65 },
      { y: '2010', a: 50,  b: 40 },
      { y: '2011', a: 75,  b: 65 },
      { y: '2012', a: 100, b: 90 }
    ],
    xkey: 'y',
    ykeys: ['a', 'b'],
    labels: ['Series A', 'Series B']
  });
  }
});


/* ============================= End Of Morris-Charts Javascript =============================== */


/* ============================= Start Of Project-Management Javascript =============================== */


  /* Audience Metrics Graph */
  $(function(){
  if($('canvas').is('#pm-chart')){
  var projectManagementCtx = document.getElementById('pm-chart').getContext("2d");
  var gradientStrokePrimary = projectManagementCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokePrimary.addColorStop(0, '#ff6877');

  var gradientFillPrimary = projectManagementCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillPrimary.addColorStop(0, "rgba(53,127,250,0.4)");
  gradientFillPrimary.addColorStop(1, "rgba(255,255,255,0)");

  // datasets 2
  var gradientStrokePrimaryDanger = projectManagementCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokePrimaryDanger.addColorStop(0, '#ec4e3f');

  var gradientFillPrimaryDanger = projectManagementCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillPrimaryDanger.addColorStop(0, "rgba(236, 78, 63,0.4)");
  gradientFillPrimaryDanger.addColorStop(1, "rgba(255, 255, 255,0)");

  // all data
  var data_1 = [3800, 3900, 3300, 3800, 4000, 4200, 4400, 3800, 4600, 3900, 3800];
  var data_2 = [2100, 3000, 2200, 2400, 2800, 2600, 2800, 2600, 2300, 2900, 2800];
  var labels = ["12 AM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 PM", "2 PM", "6 PM", "8 AM", "10 PM"];

  var projectManagement = new Chart(projectManagementCtx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: "Traffic",
              borderColor: gradientStrokePrimary,
              pointBorderWidth: 9,
              pointRadius: 9,
              pointBorderColor: 'transparent',
              pointHoverRadius: 8,
              pointHoverBorderWidth: 3,
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: '#ff6877',
              pointBackgroundColor: 'transparent',
              fill: true,
              backgroundColor: gradientFillPrimary,
              borderWidth: 2,
              data: data_1
          },
          {
              label: "Sales",
              borderColor: gradientStrokePrimaryDanger,
              pointBorderWidth: 9,
              pointRadius: 9,
              pointBorderColor: 'transparent',
              pointHoverRadius: 8,
              pointHoverBorderWidth: 3,
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: '#ec4e3f',
              pointBackgroundColor: 'transparent',
              fill: true,
              backgroundColor: gradientFillPrimaryDanger,
              borderWidth: 2,
              data: data_2
          }
          ]
      },
      options: {
          elements: {
            line: {
                tension: 0
            }
          },
          tooltips: {
            titleFontColor: '#3a3952',
            bodyFontFamily:  'Roboto',
            backgroundColor: '#FFF',
            bodyFontColor: '#878793',
            bodyFontSize: 14,
            displayColors: false,
            bodySpacing: 10,
            intersect: false,
            bodyFontStyle: 'bold',
            xPadding: 15,
            yPadding: 15,
            mode: 'index'
          },
          legend: {
            display: false,
            position: "top"
          },
          scales: {
              yAxes: [{
                  ticks: {
                      fontColor: "rgba(0,0,0,0.5)",
                      fontStyle: "bold",
                      beginAtZero: true,
                      maxTicksLimit: 200,
                      padding: 20
                  },
                  gridLines: {
                      drawTicks: false,
                      display: false
                  }

              }],
              xAxes: [{
                  gridLines: {
                      zeroLineColor: "transparent"
                  },
                  ticks: {
                      padding: 20,
                      beginAtZero: true,
                      fontColor: "rgba(0,0,0,0.5)",
                      fontStyle: "bold"
                  }
              }]
          }
      }
  });
  }
});

  $(".ms-graph-metrics .day").on('click', function(){
      var data = projectManagement.config.data;
      data.datasets[0].data = data_1;
      data.datasets[1].data = data_2;
      data.labels = labels;
      projectManagement.update();
  });

  $(".ms-graph-metrics .month").on('click', function(){
    var chart_labels = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var data_1 = [4800, 4900, 4300, 4800, 5000, 5200, 5400, 4800, 5600, 4900, 4800, 5500];
    var data_2 = [3100, 4000, 3200, 3400, 3800, 3600, 3800, 3600, 3300, 3900, 3800, 2500];
    var data = projectManagement.config.data;
    data.datasets[0].data = data_1;
    data.datasets[1].data = data_2;
    data.labels = chart_labels;
    projectManagement.update();
  });

  $(".ms-graph-metrics .year").on('click', function(){
    var chart_labels = ["2007", "2008", "2010", "2011", "2012", "2013", "2014","2015", "2016", "2017", "2018", "2019"];
    var data_1 = [6800, 6900, 6300, 6800, 7000, 7200, 7400, 6800, 7600, 6900, 6800, 7500];
    var data_2 = [5100, 6000, 5200, 5400, 5800, 5600, 5800, 5600, 5300, 5900, 5800, 4500];
    var data = projectManagement.config.data;
    data.datasets[0].data = data_1;
    data.datasets[1].data = data_2;
    data.labels = chart_labels;
    projectManagement.update();
  });

/* ============================= End Of Project-Management Javascript =============================== */


/* ============================= Start Of Range-Slider Javascript =============================== */


  /* Default Range Slider */
  $("#demo_0").ionRangeSlider();

  /* Double Slider */
  $("#demo_1").ionRangeSlider({
    type: "double",
    grid: true,
    min: 0,
    max: 1000,
    from: 200,
    to: 800,
    prefix: "$"
  });

  /* Month Slider */
  $("#demo_2").ionRangeSlider({
    grid: true,
    from: new Date().getMonth(),
    values: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
  });

  /* Prevent Collision */
  $("#demo_3").ionRangeSlider({
    type: "double",
    grid: true,
    min: 0,
    max: 100,
    from: 47,
    to: 53,
    prefix: "Weight: ",
    postfix: " million pounds",
    decorate_both: true // false,
    // values_separator: " to "
  });

  /* Snap */
  $("#demo_4").ionRangeSlider({
    type: "double",
    grid: true,
    min: -1000,
    max: 1000,
    from: -500,
    to: 500,
    step: 250
  });

  /* Floating Points */
  $("#demo_5").ionRangeSlider({
    type: "double",
    grid: true,
    min: -12.8,
    max: 12.8,
    from: -3.2,
    to: 3.2,
    step: 0.1
  });

  /* Skins */
  $("#demo_6").ionRangeSlider();

  $("#demo_7").ionRangeSlider({
    skin: 'big'
  });

  $("#demo_8").ionRangeSlider({
    skin: 'modern'
  });

  $("#demo_9").ionRangeSlider({
    skin: 'sharp'
  });

  $("#demo_10").ionRangeSlider({
    skin: 'round'
  });

  $("#demo_11").ionRangeSlider({
    skin: 'square'
  });

/* ============================= End Of Range-Slider Javascript =============================== */


/* ============================= Start Of Restaurant Javascript =============================== */


  //Pie Chart
  $(function(){
  if($('canvas').is('#rest-pie-chart')){
  new Chart(document.getElementById("rest-pie-chart"), {
    type: 'pie',
    data: {
      labels: ["Hunger House", "Food Lounge", "Delizious", "Red Resturant", "Hunger Lounge"],
      datasets: [{
        label: "Users (thousands)",
        backgroundColor: ["#ff6877", "#f7b11b","#ff6c60","#8663e1","#08bf6f"],
        data: [725,890,729,316,275]
      }]
    },
    options: {
      title: {
        display: false,
        text: 'Users By Country'
      },
      legend: {
        display: false
      },
    }
  });
  }
});

/* ============================= End Of Restaurant Javascript =============================== */


/* ============================= Start Of Sales-Bar Javascript =============================== */

// Bar chart
$(function(){
  if($('canvas').is('#bar-chart')){
  var barChart = new Chart(document.getElementById("bar-chart"), {
      type: 'bar',
      data: {
        labels: ["Hunger House", "Food Lounge", "Delizious", "Red Resturant", "Hunger Lounge"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#ff6877", "#f7b11b","#ff6c60","#8663e1","#08bf6f"],
            data: [2478,5267,1734,3384,1433]
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Predicted Resturant Ratings (millions) in 2050'
        }
      }
  });
  }
});

/* ============================= End Of Sales-Bar Javascript =============================== */





/* ============================= Start Of Social Javascript =============================== */


  /* Youtube Subs */
  $(function(){
  if($('canvas').is('#youtube-subscribers')){
  var data_1 = [7, 6, 3, 5, 4, 2, 3, 6, 8, 5, 7];
  var data_2 = [0, -4, -2, 0, -5, -3, 0, 0, -2, -5, -3];
  var labels = ["12 AM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 PM", "2 PM", "6 PM", "8 AM", "10 PM"];
  var youtubeSubs = new Chart(document.getElementById("youtube-subscribers"), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
            label: "Subscribers Gained",
            backgroundColor: '#ff6877',
            data: data_1
         }, {
            label: "Subscribers List",
            backgroundColor: '#ec4e3f',
            data: data_2
         }],
      },
      options: {
        legend: { display: false },
        title: {
          display: false,
        },
        scales: {
					xAxes: [{
						stacked: true,
					}],
					yAxes: [{
						stacked: true
					}]
				},
      }
  });
  }
});
  

/* ============================= End Of Social Javascript =============================== */


/* ============================= Start Of Social-media Javascript =============================== */


  /* Youtube Subs */
  $(function(){
  if($('canvas').is('#youtube-subscribers')){
  var data_1 = [7, 6, 3, 5, 4, 2, 3, 6, 8, 5, 7];
  var data_2 = [0, -4, -2, 0, -5, -3, 0, 0, -2, -5, -3];
  var labels = ["12 AM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 PM", "2 PM", "6 PM", "8 AM", "10 PM"];
  var youtubeSubs = new Chart(document.getElementById("youtube-subscribers"), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
            label: "Subscribers Gained",
            backgroundColor: '#ff6877',
            data: data_1
         }, {
            label: "Subscribers List",
            backgroundColor: '#ec4e3f',
            data: data_2
         }],
      },
      options: {
        legend: { display: false },
        title: {
          display: false,
        },
        scales: {
					xAxes: [{
						stacked: true,
					}],
					yAxes: [{
						stacked: true
					}]
				},
      }
  });
  }
});

  $(".ms-graph-metrics .day").on('click', function(){
      var data = youtubeSubs.config.data;
      data.datasets[0].data = data_1;
      data.datasets[1].data = data_2;
      data.labels = labels;
      youtubeSubs.update();
  });

  $(".ms-graph-metrics .month").on('click', function(){
    var chart_labels = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var data_1 = [24,27,21,27,24,23,25,28,21,23,24,27];
    var data_2 = [-25,-24,-23,-27,-21,-23,0,0,-23,0,-26,-23];
    var data = youtubeSubs.config.data;
    data.datasets[0].data = data_1;
    data.datasets[1].data = data_2;
    data.labels = chart_labels;
    youtubeSubs.update();
  });

  $(".ms-graph-metrics .year").on('click', function(){
    var chart_labels = ["2007", "2008", "2010", "2011", "2012", "2013", "2014","2015", "2016", "2017", "2018", "2019"];
    var data_1 = [300, 321, 259, 391, 429, 249, 300, 183, 341, 412, 422, 214]
    var data_2 = [-120, -85, -31, -180, -51, -44, -101, -125, -44, -31, -34, -29];
    var data = youtubeSubs.config.data;
    data.datasets[0].data = data_1;
    data.datasets[1].data = data_2;
    data.labels = chart_labels;
    youtubeSubs.update();
  });

  /* Engaged Users */
  $(function(){
  if($('canvas').is('#engaged-users')){
  var engagedUsersCtx = document.getElementById('engaged-users').getContext("2d");
  var gradientStrokeengagedUsers = engagedUsersCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokeengagedUsers.addColorStop(0, '#07be6e');

  var gradientFillengagedUsers = engagedUsersCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillengagedUsers.addColorStop(0, "rgba(7, 190, 110,0.3)");
  gradientFillengagedUsers.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(engagedUsersCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokeengagedUsers,
            pointBorderColor: gradientStrokeengagedUsers,
            pointBackgroundColor: gradientStrokeengagedUsers,
            pointHoverBackgroundColor: gradientStrokeengagedUsers,
            pointHoverBorderColor: gradientStrokeengagedUsers,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillengagedUsers,
            borderWidth: 2,
            data: [5,1,8,1,3,7,8,4,3,6,8,9,4,5,8,2,6,4,8,3]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

  /* Page Impressions */
  $(function(){
  if($('canvas').is('#page-impressions')){
  var pageImpressionsCtx = document.getElementById('page-impressions').getContext("2d");
  var gradientStrokepageImpressions = pageImpressionsCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokepageImpressions.addColorStop(0, '#07be6e');

  var gradientFillpageImpressions = pageImpressionsCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillpageImpressions.addColorStop(0, "rgba(7, 190, 110,0.3)");
  gradientFillpageImpressions.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(pageImpressionsCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokepageImpressions,
            pointBorderColor: gradientStrokepageImpressions,
            pointBackgroundColor: gradientStrokepageImpressions,
            pointHoverBackgroundColor: gradientStrokepageImpressions,
            pointHoverBorderColor: gradientStrokepageImpressions,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillpageImpressions,
            borderWidth: 2,
            data: [8,5,1,8,5,9,4,3,4,5,8,4,4,8,9,5,5,1,3,6]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

/* ============================= End Of Social-media Javascript =============================== */


/* ============================= Start Of Sweet-alerts Javascript =============================== */


  $(".ms-panel-body").on('click', '.trigger-swal', function () {

    var swalType = $(this).data('swal');

    switch (swalType) {

      case 'basic':
        Swal.fire('The Internet?', 'That thing is still around?', 'question');
        break;
      case 'with-footer':
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="#">Why do I have this issue?</a>'
        });
        break;
      case 'positioned':
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        });
        break;
      case 'with-html':
        Swal.fire({
          title: '<strong>HTML <u>example</u></strong>',
          type: 'info',
          html: 'You can use <b>bold text</b>, ' + '<a href="#">links</a> ' + 'and other HTML tags',
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: 'Great!',
          confirmButtonAriaLabel: 'Thumbs up, great!',
          cancelButtonText: 'Close',
          cancelButtonAriaLabel: 'Thumbs down'
        });
        break;
      case 'multi-step':
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then(function (result) {
          if (result.value) {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          }
        });
        break;
      case 'auto-close':
        var timerInterval = void 0;
        Swal.fire({
          title: 'Auto close alert!',
          html: 'I will close in <strong></strong> seconds.',
          timer: 2000,
          onBeforeOpen: function onBeforeOpen() {
            Swal.showLoading();
            timerInterval = setInterval(function () {
              Swal.getContent().querySelector('strong').textContent = Swal.getTimerLeft();
            }, 100);
          },
          onClose: function onClose() {
            clearInterval(timerInterval);
          }
        }).then(function (result) {
          if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.timer) ;
        });
        break;
      case 'ajax':
        var ipAPI = 'https://api.ipify.org?format=json';
        Swal.queue([{
          title: 'Your public IP',
          confirmButtonText: 'Show my public IP',
          text: 'Your public IP will be received ' + 'via AJAX request',
          showLoaderOnConfirm: true,
          preConfirm: function preConfirm() {
            return fetch(ipAPI).then(function (response) {
              return response.json();
            }).then(function (data) {
              return Swal.insertQueueStep(data.ip);
            }).catch(function () {
              Swal.insertQueueStep({
                type: 'error',
                title: 'Unable to get your public IP'
              });
            });
          }
        }]);
        break;
      case 'custom':
        Swal.fire({
          title: 'Sweet!',
          text: 'Modal with a custom image.',
          imageUrl: 'https://via.placeholder.com/400',
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Custom image',
          animation: false
        });
        break;
      default:
        Swal.fire('The Internet?', 'That thing is still around?', 'question');
        break;

    }
  });

/* ============================= End Of Sweet-alerts Javascript =============================== */
/* ============================= Start Of Tour Javascript =============================== */
  // Start the introduction
  $(function(){
  if($('div').is('#replay-tour')){
  driver.start();
  $("#replay-tour").on('click', function(e){
    e.stopPropagation();
    driver.start();
  })
  }
});

/* ============================= End Of Tour Javascript =============================== */


/* ============================= Start Of Vector-maps Javascript =============================== */


  //World Map
  $(function(){
  if($('div.vector-map').is('#vector-world-map')){
  var worldVector = new Datamap({
    element: document.getElementById("vector-world-map"),
    highlightOnHover: false,
    responsive: true,
    fills: {
      defaultFill: '#384ea1',
      authorHasTraveledTo: "#6678ba"
    },
    geographyConfig: {
      highlightFillColor: 'rgb(50,92,204)',
      borderColor: '#eee',
      highlightBorderColor: '#eee',
    },
    data: {
      USA: { fillKey: "authorHasTraveledTo" },
      JPN: { fillKey: "authorHasTraveledTo" },
      ITA: { fillKey: "authorHasTraveledTo" },
      CRI: { fillKey: "authorHasTraveledTo" },
      KOR: { fillKey: "authorHasTraveledTo" },
      DEU: { fillKey: "authorHasTraveledTo" },
      RUS: { fillKey: "authorHasTraveledTo" },
      AUS: { fillKey: "authorHasTraveledTo" },
      BRA: { fillKey: "authorHasTraveledTo" },
      IND: { fillKey: "authorHasTraveledTo" },
    }

  });
  }
});

  //USA Map
  $(function(){
  if($('div').is('#vector-usa-map')){
  var usaVector = new Datamap({
    element: document.getElementById('vector-usa-map'),
    scope: 'usa',
    responsive: true,
    fills: {
      defaultFill: '#384ea1',
    },
    geographyConfig: {
      highlightFillColor: 'rgb(50,92,204)',
      borderColor: '#eee',
      highlightBorderColor: '#eee',
    },
  });
  }
});

  //Map with Arc
  $(function(){
  if($('div').is('#vector-arc-map')){
  var map = new Datamap({
    scope: 'world',
    element: document.getElementById('vector-arc-map'),
    projection: 'orthographic',
    responsive: true,
    fills: {
      defaultFill: "#384ea1",
    },
    geographyConfig: {
      highlightFillColor: 'rgb(50,92,204)',
      borderColor: '#eee',
      highlightBorderColor: '#eee',
    },
    projectionConfig: {
      rotation: [97,-30]
    },
    data: {
      'USA': {fillKey: 'lt50' },
      'MEX': {fillKey: 'lt25' },
      'CAN': {fillKey: 'gt50' },
      'GTM': {fillKey: 'gt500'},
      'HND': {fillKey: 'eq50' },
      'BLZ': {fillKey: 'pink' },
      'GRL': {fillKey: 'eq0' },
      'CAN': {fillKey: 'gt50' }
    }
  });

  map.graticule();

  map.arc(
    [{
    origin: {
      latitude: 61,
      longitude: -149
    },
    destination: {
      latitude: -22,
      longitude: -43
    }
    },
    {
    origin: {
      latitude: 64,
      longitude: -144
    },
    destination: {
      latitude: -24,
      longitude: -31
    }
    }], {
    greatArc: true,
    animationSpeed: 2000
  });
  }
});

$(function(){
  if($('div').is('#vector-map-bubbles')){
  var bombMap = new Datamap({
    element: document.getElementById('vector-map-bubbles'),
    scope: 'world',
    responsive: true,
    geographyConfig: {
        highlightFillColor: 'rgb(50,92,204)',
        borderColor: '#eee',
        highlightBorderColor: '#eee',
    },
    fills: {
        'USA': '#1f77b4',
        'RUS': '#9467bd',
        'PRK': '#ff7f0e',
        'PRC': '#2ca02c',
        'IND': '#e377c2',
        'GBR': '#8c564b',
        'FRA': '#d62728',
        'PAK': '#7f7f7f',
        defaultFill: '#384ea1'
    },
    data: {
        'RUS': {fillKey: 'RUS'},
        'PRK': {fillKey: 'PRK'},
        'PRC': {fillKey: 'PRC'},
        'IND': {fillKey: 'IND'},
        'GBR': {fillKey: 'GBR'},
        'FRA': {fillKey: 'FRA'},
        'PAK': {fillKey: 'PAK'},
        'USA': {fillKey: 'USA'}
    }
}); 

 var bombs = [{
    name: 'Joe 4',
    radius: 25,
    yield: 400,
    country: 'USSR',
    fillKey: 'RUS',
    significance: 'First fusion weapon test by the USSR (not "staged")',
    date: '1953-08-12',
    latitude: 50.07,
    longitude: 78.43
  },{
    name: 'RDS-37',
    radius: 40,
    yield: 1600,
    country: 'USSR',
    fillKey: 'RUS',
    significance: 'First "staged" thermonuclear weapon test by the USSR (deployable)',
    date: '1955-11-22',
    latitude: 50.07,
    longitude: 78.43

  },{
    name: 'Tsar Bomba',
    radius: 75,
    yield: 50000,
    country: 'USSR',
    fillKey: 'RUS',
    significance: 'Largest thermonuclear weapon ever tested—scaled down from its initial 100 Mt design by 50%',
    date: '1961-10-31',
    latitude: 73.482,
    longitude: 54.5854
  }
];

//draw bubbles for bombs
bombMap.bubbles(bombs, {
  popupTemplate: function (geo, data) {
    return ['<div class="hoverinfo">' +  data.name,
    '<br/>Payload: ' +  data.yield + ' kilotons',
    '<br/>Country: ' +  data.country + '',
    '<br/>Date: ' +  data.date + '',
    '</div>'].join('');
    }
});

$(window).on('resize', function() {
  bombMap.resize();
  worldVector.resize();
  usaVector.resize();
});
}
});

/* ============================= End Of Vector-maps Javascript =============================== */


/* ============================= Start Of Web-Analytics Javascript =============================== */




  /* Audience Metrics Graph */
  $(function(){
  if($('canvas').is('#audience-metrics-chart')){
  var audienceMetricsCtx = document.getElementById('audience-metrics-chart').getContext("2d");
  var gradientStrokePrimary = audienceMetricsCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokePrimary.addColorStop(0, '#ff6877');

  var gradientFillPrimary = audienceMetricsCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillPrimary.addColorStop(0, "rgba(53,127,250,0.4)");
  gradientFillPrimary.addColorStop(1, "rgba(255,255,255,0)");

  // datasets 2
  var gradientStrokePrimaryDanger = audienceMetricsCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokePrimaryDanger.addColorStop(0, '#ec4e3f');

  var gradientFillPrimaryDanger = audienceMetricsCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillPrimaryDanger.addColorStop(0, "rgba(236, 78, 63,0.4)");
  gradientFillPrimaryDanger.addColorStop(1, "rgba(255, 255, 255,0)");

  // all data
  var data_1 = [3800, 3900, 3300, 3800, 4000, 4200, 4400, 3800, 4600, 3900, 3800];
  var data_2 = [2100, 3000, 2200, 2400, 2800, 2600, 2800, 2600, 2300, 2900, 2800];
  var labels = ["12 AM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 PM", "2 PM", "6 PM", "8 AM", "10 PM"];

  var audienceMetrics = new Chart(audienceMetricsCtx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: "Traffic",
              borderColor: gradientStrokePrimary,
              pointBorderWidth: 9,
              pointRadius: 9,
              pointBorderColor: 'transparent',
              pointHoverRadius: 8,
              pointHoverBorderWidth: 3,
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: '#ff6877',
              pointBackgroundColor: 'transparent',
              fill: true,
              backgroundColor: gradientFillPrimary,
              borderWidth: 2,
              data: data_1
          },
          {
              label: "Sales",
              borderColor: gradientStrokePrimaryDanger,
              pointBorderWidth: 9,
              pointRadius: 9,
              pointBorderColor: 'transparent',
              pointHoverRadius: 8,
              pointHoverBorderWidth: 3,
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: '#ec4e3f',
              pointBackgroundColor: 'transparent',
              fill: true,
              backgroundColor: gradientFillPrimaryDanger,
              borderWidth: 2,
              data: data_2
          }
          ]
      },
      options: {
          elements: {
            line: {
                tension: 0
            }
          },
          tooltips: {
            titleFontColor: '#3a3952',
            bodyFontFamily:  'Roboto',
            backgroundColor: '#FFF',
            bodyFontColor: '#878793',
            bodyFontSize: 14,
            displayColors: false,
            bodySpacing: 10,
            intersect: false,
            bodyFontStyle: 'bold',
            xPadding: 15,
            yPadding: 15,
            mode: 'index'
          },
          legend: {
            display: false,
            position: "top"
          },
          scales: {
              yAxes: [{
                  ticks: {
                      fontColor: "rgba(0,0,0,0.5)",
                      fontStyle: "bold",
                      beginAtZero: true,
                      maxTicksLimit: 200,
                      padding: 20
                  },
                  gridLines: {
                      drawTicks: false,
                      display: false
                  }

              }],
              xAxes: [{
                  gridLines: {
                      zeroLineColor: "transparent"
                  },
                  ticks: {
                      padding: 20,
                      beginAtZero: true,
                      fontColor: "rgba(0,0,0,0.5)",
                      fontStyle: "bold"
                  }
              }]
          }
      }
  });
  }
});

  $(".ms-graph-metrics .day").on('click', function(){
      var data = audienceMetrics.config.data;
      data.datasets[0].data = data_1;
      data.datasets[1].data = data_2;
      data.labels = labels;
      audienceMetrics.update();
  });

  $(".ms-graph-metrics .month").on('click', function(){
    var chart_labels = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var data_1 = [4800, 4900, 4300, 4800, 5000, 5200, 5400, 4800, 5600, 4900, 4800, 5500];
    var data_2 = [3100, 4000, 3200, 3400, 3800, 3600, 3800, 3600, 3300, 3900, 3800, 2500];
    var data = audienceMetrics.config.data;
    data.datasets[0].data = data_1;
    data.datasets[1].data = data_2;
    data.labels = chart_labels;
    audienceMetrics.update();
  });

  $(".ms-graph-metrics .year").on('click', function(){
    var chart_labels = ["2007", "2008", "2010", "2011", "2012", "2013", "2014","2015", "2016", "2017", "2018", "2019"];
    var data_1 = [6800, 6900, 6300, 6800, 7000, 7200, 7400, 6800, 7600, 6900, 6800, 7500];
    var data_2 = [5100, 6000, 5200, 5400, 5800, 5600, 5800, 5600, 5300, 5900, 5800, 4500];
    var data = audienceMetrics.config.data;
    data.datasets[0].data = data_1;
    data.datasets[1].data = data_2;
    data.labels = chart_labels;
    audienceMetrics.update();
  });

  //World Map
  $(function(){
  if($('div').is('#world-map')){
  var worldVector = new Datamap({
    element: document.getElementById("world-map"),
    highlightOnHover: false,
    responsive: true,
    fills: {
      defaultFill: 'rgb(199,206,234)',
      USA: "#445cc8",
      RUS: "#f0ad4e",
      AUS: "#5cb85c",
      IND: "#d9534f",
      BRA: "#ff6877",
    },
    geographyConfig: {
      highlightFillColor: 'rgb(50,92,204)',
      borderColor: 'transparent',
      highlightBorderColor: 'transparent',
      popupOnHover: false
    },
    data: {
      USA: { fillKey: "USA" },
      RUS: { fillKey: "RUS" },
      AUS: { fillKey: "AUS" },
      IND: { fillKey: "IND" },
      BRA: { fillKey: "BRA" },
    }

  });

  $(window).on('resize', function() {
    worldVector.resize();
  });
  }
});

  /* Website Performance Charts */
  $(function(){
  if($('canvas').is('#bounce-rate')){
  var bounceRateCtx = document.getElementById('bounce-rate').getContext("2d");
  var gradientStrokebounceRate = bounceRateCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokebounceRate.addColorStop(0, '#07be6e');

  var gradientFillbounceRate = bounceRateCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillbounceRate.addColorStop(0, "rgba(7, 190, 110,0.3)");
  gradientFillbounceRate.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(bounceRateCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokebounceRate,
            pointBorderColor: gradientStrokebounceRate,
            pointBackgroundColor: gradientStrokebounceRate,
            pointHoverBackgroundColor: gradientStrokebounceRate,
            pointHoverBorderColor: gradientStrokebounceRate,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillbounceRate,
            borderWidth: 2,
            data: [5,1,8,1,3,7,8,4,3,6,8,9,4,5,8,2,6,4,8,3]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});
  $(function(){
  if($('canvas').is('#page-views')){
  var pageViewsCtx = document.getElementById('page-views').getContext("2d");
  var gradientStrokepageViews = pageViewsCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokepageViews.addColorStop(0, '#ec4e3f');

  var gradientFillpageViews = pageViewsCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillpageViews.addColorStop(0, "rgba(236, 78, 63,0.4)");
  gradientFillpageViews.addColorStop(1, "rgba(255, 255, 255,0)");

  new Chart(pageViewsCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokepageViews,
            pointBorderColor: gradientStrokepageViews,
            pointBackgroundColor: gradientStrokepageViews,
            pointHoverBackgroundColor: gradientStrokepageViews,
            pointHoverBorderColor: gradientStrokepageViews,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillpageViews,
            borderWidth: 2,
            data: [8,5,1,8,5,9,4,3,4,5,8,4,4,8,9,5,5,1,3,6]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});
  $(function(){
  if($('canvas').is('#new-sessions')){
  var newSessionsCtx = document.getElementById('new-sessions').getContext("2d");
  var gradientStrokenewSessions = newSessionsCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokenewSessions.addColorStop(0, '#ec4e3f');

  var gradientFillnewSessions = newSessionsCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillnewSessions.addColorStop(0, "rgba(236, 78, 63,0.4)");
  gradientFillnewSessions.addColorStop(1, "rgba(255, 255, 255,0)");

  new Chart(newSessionsCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokenewSessions,
            pointBorderColor: gradientStrokenewSessions,
            pointBackgroundColor: gradientStrokenewSessions,
            pointHoverBackgroundColor: gradientStrokenewSessions,
            pointHoverBorderColor: gradientStrokenewSessions,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillnewSessions,
            borderWidth: 2,
            data: [1,6,3,8,3,4,5,1,8,5,8,4,2,4,6,8,5,3,7,5,8]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});
  $(function(){
  if($('canvas').is('#time-site')){
  var timeSiteCtx = document.getElementById('time-site').getContext("2d");
  var gradientStroketimeSite = timeSiteCtx.createLinearGradient(0, 0, 0, 450);
  gradientStroketimeSite.addColorStop(0, '#07be6e');

  var gradientFilltimeSite = timeSiteCtx.createLinearGradient(0, 0, 0, 450);
  gradientFilltimeSite.addColorStop(0, "rgba(7, 190, 110,0.3)");
  gradientFilltimeSite.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(timeSiteCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        datasets: [{
            label: "Data",
            borderColor: gradientStroketimeSite,
            pointBorderColor: gradientStroketimeSite,
            pointBackgroundColor: gradientStroketimeSite,
            pointHoverBackgroundColor: gradientStroketimeSite,
            pointHoverBorderColor: gradientStroketimeSite,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFilltimeSite,
            borderWidth: 2,
            data: [5,1,8,1,3,7,8,4,3,6,8,9,4,5,8,2,6,4,8,3]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});
  $(function(){
  if($('canvas').is('#site-impressions')){
  var siteImpressionsCtx = document.getElementById('site-impressions').getContext("2d");
  var gradientStrokesiteImpressions = siteImpressionsCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokesiteImpressions.addColorStop(0, '#07be6e');

  var gradientFillsiteImpressions = siteImpressionsCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillsiteImpressions.addColorStop(0, "rgba(7, 190, 110,0.3)");
  gradientFillsiteImpressions.addColorStop(1, "rgba(255,255,255,0)");

  new Chart(siteImpressionsCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokesiteImpressions,
            pointBorderColor: gradientStrokesiteImpressions,
            pointBackgroundColor: gradientStrokesiteImpressions,
            pointHoverBackgroundColor: gradientStrokesiteImpressions,
            pointHoverBorderColor: gradientStrokesiteImpressions,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillsiteImpressions,
            borderWidth: 2,
            data: [8,5,1,8,5,9,4,3,4,5,8,4,4,8,9,5,5,1,3,6]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

  /* Sessions by Channel Trends Charts */
  var trend_1 = [1, 3, 5, 4, 3, 3, 4, 8, 5];
  var trend_2 = [3, 2, 5, 4, 8, 4, 5, 2, 3];
  var trend_3 = [7, 5, 4, 5, 4, 7, 5, 5, 4];
  var trend_4 = [3, 3, 4, 6, 7, 6, 6, 4, 3];
  var trend_5 = [5, 4, 6, 7, 6, 5, 5, 7, 4];
  var labels = ["Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17","Jan-18", "Jan-19"];
  var options = {
    legend: {
    display: false,
    position: "bottom"
    },
    scales: {
      yAxes: [{
        display: false,
      }],
      xAxes: [{
          display: false,
      }]
    },
    elements: {
       point:{
         radius: 0
       }
     }
  };
  $(function(){
  if($('canvas').is('#trend-01')){
  new Chart(document.getElementById('trend-01').getContext("2d"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: '#07be6e',
            backgroundColor: 'transparent',
            borderWidth: 2,
            data: trend_1
        }]
    },
    options: options
  });
  }
});
  $(function(){
  if($('canvas').is('#trend-02')){
  new Chart(document.getElementById('trend-02').getContext("2d"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: '#ec4e3f',
            backgroundColor: 'transparent',
            borderWidth: 2,
            data: trend_2
        }]
    },
    options: options
  });
  }
});
  $(function(){
  if($('canvas').is('#trend-03')){
  new Chart(document.getElementById('trend-03').getContext("2d"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: '#07be6e',
            backgroundColor: 'transparent',
            borderWidth: 2,
            data: trend_3
        }]
    },
    options: options
  });
  }
});
  $(function(){
  if($('canvas').is('#trend-04')){
  new Chart(document.getElementById('trend-04').getContext("2d"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: '#07be6e',
            backgroundColor: 'transparent',
            borderWidth: 2,
            data: trend_4
        }]
    },
    options: options
  });
  }
});
  $(function(){
  if($('canvas').is('#trend-05')){
  new Chart(document.getElementById('trend-05').getContext("2d"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: '#ec4e3f',
            backgroundColor: 'transparent',
            borderWidth: 2,
            data: trend_5
        }]
    },
    options: options
  });
  }
});

/* ============================= End Of Web-Analytics Javascript =============================== */


/* ============================= Start Of Widgets Javascript =============================== */


  //Line Chart
  $(function(){
  if($('canvas').is('#home-line-chart')){
  var ctx = document.getElementById('home-line-chart').getContext("2d");
  var gradientStroke = ctx.createLinearGradient(0, 0, 0, 450);
  gradientStroke.addColorStop(0, '#000000');

  var gradientFill = ctx.createLinearGradient(0, 0, 0, 450);
  gradientFill.addColorStop(0, "rgba(25, 25, 25, 0.12)");
  gradientFill.addColorStop(1, "rgba(25, 25, 25, 0.12)");

  // all data
  var data_1 = [4100, 3800, 3200, 3400, 2700, 3600, 3300, 3700, 4900];
  var data_2 = [2800, 2600, 2300, 2800, 3600, 2900, 3000, 3100, 3600, 3000, 3100, 3200];
  var labels = ["Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17","Jan-18", "Jan-19"];
  var labels2 = ["Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17","Jan-18", "Jan-19", "Jan-20", "Jan-21", "Jan-22"];

  var lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Data",
            borderColor: gradientStroke,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
            pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 2,
            data: data_1
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

  //Line Chart 2
  $(function(){
  if($('canvas').is('#line-chart-2')){
  var ctx2 = document.getElementById('line-chart-2').getContext("2d");
  var gradientStroke2 = ctx2.createLinearGradient(0, 0, 0, 450);
  gradientStroke2.addColorStop(0, '#ff6877');
  var data_2 = [2800, 2600, 2300, 2800, 3600, 2900, 3000, 3100, 3600, 3000, 3100, 3200];
  var labels2 = ["Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17","Jan-18", "Jan-19", "Jan-20", "Jan-21", "Jan-22"];

  var gradientFill2 = ctx2.createLinearGradient(0, 0, 0, 450);
  gradientFill2.addColorStop(0, "rgba(255, 0, 24, 0.11)");
  gradientFill2.addColorStop(1, "rgba(255, 0, 24, 0.11)");

  var lineChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: labels2,
        datasets: [{
            label: "Data",
            borderColor: gradientStroke2,
            pointBorderColor: gradientStroke2,
            pointBackgroundColor: gradientStroke2,
            pointHoverBackgroundColor: gradientStroke2,
            pointHoverBorderColor: gradientStroke2,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFill2,
            borderWidth: 2,
            data: data_2
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

  //Line chart 3
  $(function(){
  if($('canvas').is('#line-chart-3')){
  var zCashCtx = document.getElementById('line-chart-3').getContext("2d");
  var gradientStrokeZCash = zCashCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokeZCash.addColorStop(0, '#000000');

  var gradientFillZCash = zCashCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillZCash.addColorStop(0, "rgba(25, 25, 25, 0.12)");
  gradientFillZCash.addColorStop(1, "rgba(25, 25, 25, 0.12)");

  new Chart(zCashCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokeZCash,
            pointBorderColor: gradientStrokeZCash,
            pointBackgroundColor: gradientStrokeZCash,
            pointHoverBackgroundColor: gradientStrokeZCash,
            pointHoverBorderColor: gradientStrokeZCash,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillZCash,
            borderWidth: 2,
            data: [5,6,8,1,5,3,9,7,5,8,7,3,6,9,1]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

  //Line chart 4
  $(function(){
  if($('canvas').is('#line-chart-4')){
  var peerCoinCtx = document.getElementById('line-chart-4').getContext("2d");
  var gradientStrokePeercoin = peerCoinCtx.createLinearGradient(0, 0, 0, 450);
  gradientStrokePeercoin.addColorStop(0, '#ff6877');

  var gradientFillPeercoin = peerCoinCtx.createLinearGradient(0, 0, 0, 450);
  gradientFillPeercoin.addColorStop(0, "rgba(255, 0, 24, 0.11)");
  gradientFillPeercoin.addColorStop(1, "rgba(255, 0, 24, 0.11)");

  new Chart(peerCoinCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        datasets: [{
            label: "Data",
            borderColor: gradientStrokePeercoin,
            pointBorderColor: gradientStrokePeercoin,
            pointBackgroundColor: gradientStrokePeercoin,
            pointHoverBackgroundColor: gradientStrokePeercoin,
            pointHoverBorderColor: gradientStrokePeercoin,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradientFillPeercoin,
            borderWidth: 2,
            data: [1,4,7,3,5,7,6,5,8,3,5,5,4,3,7]
        }]
    },
    options: {
        elements: {
          line: {
              tension: 0
          }
        },
        legend: {
        display: false,
        position: "bottom"
        },
        scales: {
          yAxes: [{
            display: false,
          }],
          xAxes: [{
              display: false,
          }]
        }
      }
  });
  }
});

/* ============================= End Of Widgets Javascript =============================== */

})
(jQuery);