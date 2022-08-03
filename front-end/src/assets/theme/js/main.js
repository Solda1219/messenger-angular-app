// !(function($) {
//   "use strict";






// })(jQuery);

// $(function() {
//   $('.innerSidebar').mouseenter(function() {
//       $('.innerSidebar').addClass("show");
//       $('.innersidebarclose').addClass("show");
//   }).mouseleave(function () {
//       $('.innersidebarclose').removeClass("show");
//       $('.innerSidebar').addClass("show");
//   });
// });

$(document).ready(function () {
  $('.preloader').delay(4000).addClass('preloader_hide');
  $('.preloader').delay(5000).addClass('z-index-n10');
});


// let last_sidemenu = 'dashboard';

$(document).ready(function () {
  // console.clear();
  // $('.sidebar').toggleClass('active2');
  $('.sidebar ul li').on('click', function () {

    $('.sidebar ul li').removeClass('active');
    $(this).toggleClass('active');
  });
  // console.log(screen.width);
  if (screen.width <= 991) {
    // console.log('dfas');
    $('div.sidebar.active').removeClass('active');
  }

});
$('.inner_class').click(function () {
  // console.clear();
  $(".innersidebarclose").removeClass('show');
  $(".innersidebarnew").removeClass('sidebar_active2');
  $(".innersidebarnew").removeClass('active');
  $('div.sidebar ul li.active a').addClass('collapsed').attr('aria-expanded', false);

  // $('.sub_sidebar div').removeClass('active');
  // console.log(screen.width);
  // $('div.sidebar.active').addClass('active2');
  // remove inner sidebar code //




  // $('div.sidebar.active').removeClass('active');
  // if(screen.width<=991){
  //   // console.log('dfas');
  //   $('div.sidebar.active').removeClass('active');
  // }else{
  //   $('div.sidebar ul li.active a').addClass('collapsed').attr('aria-expanded',false);
  //   $('div.sidebar ul li.innerSidebar.active div.sub').removeClass('show');  
  //     setTimeout(function(){  
  //       if($('div.sidebar ul li.innerSidebar.active div.sub').hasClass('show')){

  //         $('div.sidebar').addClass('sidebar_active2');
  //       }

  //     }, 300);

  //     $('div.sidebar').removeClass('sidebar_active2');

  // }


});

// aanchal code //


$('div.sidebar ul li.innerSidebar').click(function () {
  let li_id = $(this).attr('id');
  if ($(this).children().hasClass('collapsed') && $('div.sidebar').hasClass('sidebar_active2')) {
    $('.sidebar').removeClass('sidebar_active2');
  } else {
    $('.sidebar').addClass('sidebar_active2');
  }
});

// function open_subMenu(value){
//   if(last_sidemenu!=value){
//     if($('.sub').attr('inner-sidebar')==last_sidemenu){
//       $(`[inner-sidebar=${last_sidemenu}]`).removeClass('active');
//     }
//     last_sidemenu = $('.sub').attr('inner-sidebar');
//     // if($('.sub').attr('inner-sidebar')==`${value}`){
//       $(`[inner-sidebar=${value}]`).addClass('active');
//     // }
//   }else{
//     if($('.sub').attr('inner-sidebar')==last_sidemenu){
//       $('.sub').removeClass('active');
//     }
//     $(`[inner-sidebar=${value}]`).addClass('active');
//   }
// };





var el = document.getElementById('phone');
var el1 = document.getElementById('phone2');
// alert(el);
var input = document.querySelector("#phone");
if (el != null) {
  window.intlTelInput(input, {
    initialCountry: "in",
    separateDialCode: true,
    preferredCountries: ['in', 'us'],
    utilsScript: "assets/vendor/intl-tel-input/js/utils.js",
  });
}
if (el1 != null) {
  var input = document.querySelector("#phone2");
  window.intlTelInput(input, {
    initialCountry: "in",
    separateDialCode: true,
    preferredCountries: ['in', 'us'],
    utilsScript: "assets/vendor/intl-tel-input/js/utils.js",
  });
}

// $('#inputDate3,#inputDate,#inputDate2').datepicker({

// });

// $('#inputDate4,#inputDate5').datepicker({

// });

function setclasstoHeader() {

  $('.innersidebarclose').removeClass('show');
  $('div.sidebar').removeClass('sidebar_active2');
  // console.log($('.sidebar').hasClass('active') && $('.sidebar').hasClass('active2'));
  if ($('.sidebar').hasClass('active') && $('.sidebar').hasClass('active2')) {
    $('.sidebar').toggleClass('active2');
  } else {
    $('.sidebar').addClass('active2');
  }
  $('.sidebar').toggleClass('active');

};




function adsingle1(getId) {

  // $('.commonclasstabs').removeClass('show').removeClass('active');
  // alert($(`[aria-clicked=${getId}]`).hasClass('show'));
  // if($(`[aria-clicked=${getId}]`).hasClass('show').hasClass('active')){

  // }
  $('.commonclasstabs').removeClass('show').removeClass('active');
  $('.desktop-tabs').removeClass('active');
  $('.mobile-toggle-tabs').removeClass('active');
  //$(`[aria-clicked=${getId}]`).stop().slideToggle(1000);
  $(`[aria-clicked=${getId}]`).toggleClass('show');
  $(`[aria-clicked=${getId}]`).toggleClass('active');
  $('#' + getId).addClass('active');
  $('#' + getId + '-1').addClass('active');

}

function addSingle2(getId) {
  $('.commonclasstabs').removeClass('show').removeClass('active');
  $('.desktop-tabs').removeClass('active');
  $('.mobile-toggle-tabs').removeClass('active');
  $(`[aria-clicked=${getId}]`).toggleClass('show');
  $(`[aria-clicked=${getId}]`).toggleClass('active');
  $('#' + getId).addClass('active');
  $('#' + getId + '-1').addClass('active');
};





$(document).ready(function () {
  $('#dataTable, #dataTable2').DataTable({
    "bPaginate": true,
    "bLengthChange": false,
    "bFilter": true,
    "bInfo": false,
    "bAutoWidth": true,
    "dom": 'lrtip',
    // "preDrawCallback": function( settings ) {
    //     jQuery("select").select2( { tags: true } );
    //     alert( 'DataTables has redrawn the table' );
    // },

    language: {
      paginate: {
        next: '<i class="fal fa-chevron-right">',
        previous: '<i class="fal fa-chevron-left">'
      }
    }
  });
});

$(document).ready(function () {
  $('#dataTable_mass').DataTable({
    "bPaginate": true,
    "bLengthChange": true,
    "bFilter": true,
    "bInfo": false,
    "bAutoWidth": true,
    // "dom": 'lrtip',
    // "preDrawCallback": function( settings ) {
    //     jQuery("select").select2( { tags: true } );
    //     alert( 'DataTables has redrawn the table' );
    // },

    language: {
      paginate: {
        next: '<i class="fal fa-chevron-right">',
        previous: '<i class="fal fa-chevron-left">'
      }
    }
  });
});


$(document).ready(function () {
  $('#folder_details').DataTable({
    "bPaginate": false,
    "bLengthChange": false,
    "bFilter": false,
    "bInfo": false,
    "bAutoWidth": true,
    // "dom": 'lrtip',
    // "preDrawCallback": function( settings ) {
    //     jQuery("select").select2( { tags: true } );
    //     alert( 'DataTables has redrawn the table' );
    // },

    language: {
      paginate: {
        next: '<i class="fal fa-chevron-right">',
        previous: '<i class="fal fa-chevron-left">'
      }
    }
  });
});

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})







$(".add-user23").click(function () {
  $(".add-multiple-consultants-add-user").toggleClass("d-none");
  $(".add-multiple-consultants-table").toggleClass("d-none");
  $(".add-multiple-consultants-table-edit").toggleClass("d-none");
  $(".add-multiple-consultants-table-edit-btn").toggleClass("d-none");
});




$(function () {                        //run when the DOM is ready
  $(".view-resume-popup-btn").click(function () {  //use a class, since your ID gets mangled
    $('.view-resume-popup').toggleClass("d-none");       //add the class to the clicked element
  });
});


// Portfolio details carousel
$(".result_slider5").owlCarousel({
  autoplay: false,
  autoplayTimeout: 5000,
  // infinite: true,
  dots: false,
  nav: true,
  loop: true,
  responsive: {
    0: {
      items: 5,
      dots: false,
    },
    768: {
      items: 4
    },
    1199: {
      items: 5
    }
  },
  navText: ["<i class='far fa-chevron-left'></i>", "<i class='far fa-chevron-right'></i>"]
});

// Portfolio details carousel
$(".result_slider4").owlCarousel({
  autoplay: false,
  autoplayTimeout: 5000,
  // infinite: true,
  dots: false,
  nav: true,
  loop: true,
  responsive: {
    0: {
      items: 2,
      dots: false,
    },
    768: {
      items: 3
    },
    1199: {
      items: 4
    }
  },
  navText: ["<i class='far fa-chevron-left'></i>", "<i class='far fa-chevron-right'></i>"]
});

// Portfolio details carousel
$(".result_slider2").owlCarousel({
  autoplay: false,
  autoplayTimeout: 5000,
  // infinite: true,
  dots: false,
  nav: true,
  loop: true,
  responsive: {
    0: {
      items: 4,
      dots: false,
    },
    576: {
      items: 4
    },
    768: {
      items: 3
    },
    1199: {
      items: 4
    }
  },
  navText: ["<i class='far fa-chevron-left'></i>", "<i class='far fa-chevron-right'></i>"]
});

// Portfolio details carousel
$(".result_slider3").owlCarousel({
  autoplay: false,
  autoplayTimeout: 5000,
  // infinite: true,
  dots: false,
  nav: true,
  loop: true,
  responsive: {
    0: {
      items: 4,
      dots: false,
    },
    575: {
      items: 3,
      dots: false,
    },
    768: {
      items: 3
    },
    1199: {
      items: 4
    }
  },
  navText: ["<i class='far fa-chevron-left'></i>", "<i class='far fa-chevron-right'></i>"]
});



// File Drag And Drop

var isAdvancedUpload = function () {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

var tests = {
  filereader: typeof FileReader != 'undefined',
  dnd: 'draggable' in document.createElement('span'),
  formdata: !!window.FormData,
  progress: "upload" in new XMLHttpRequest
};

var supports = {
  FileReader: 'FileReader' in window // typeof FileReader != 'undefined'
};

// var support = {
// 	filereader	: document.getElementById('filereader'),
// 	formdata	: document.getElementById('formdata'),
// 	progress	: document.getElementById('progress')
// };
var acceptedTypes = {
  'application/pdf': true,
  'image/png': true,
  'image/jpeg': true,
  'image/gif': true
};

const acceptedMimeTypes = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.rtf': 'text/rtf',
  '.xls': '',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.csv': 'text/csv',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.txt': 'text/plain'
};

var FileModel = Backbone.Model.extend({
  defaults: {
    name: null,
    type: null,
    size: null,
    data: null,
    lastModified: null,
    lastModifiedDate: null
  }
});

var FilesCollection = Backbone.Collection.extend({
  model: FileModel,
  url: null
});

var FileView = Marionette.ItemView.extend({
  // tagName: 'div',
  // template: '.row',
  model: FileModel,
  // template	: _.template('<a href="<%= data %>" download="<%= name %>" target="_blank"><%= name %></a>'),
  // template	: _.template('<a href="<%= data %>" download="<%= name %>" target="_blank"><%= name %></a> <button class="btn btn--link js--remove-file"><i class="fa fa-times-circle"></i></button>'),
  template: '#document-item-view',

  ui: {
    btnRemoveFile: '.js--remove-file'
  },

  events: {
    'click @ui.btnRemoveFile': 'btnRemoveFileClicked'
  },

  initialize: function () {
    // console.log("FileView :: initialize", this.options);
  },

  onRender: function () {
    // console.log("FileView :: onRender", this.model.toJSON());
  },

  btnRemoveFileClicked: function (e) {

    // console.log(
    //   $(e.currentTarget).parents('.js--files-list').children('div').length
    // );

    if (
      $(e.currentTarget).parents('.js--files-list').children('div').length <= 1
    ) {

      $(e.currentTarget).parents('.js--advanced-upload').removeClass('uploaded');
      $(e.currentTarget).parents('.js--advanced-upload').removeClass('multiple');
    }

    this.triggerMethod("remove:file", this.model);
  }

});

var fileuploadertemplate = document.getElementById('file-uploader-template');

if (fileuploadertemplate != null) {

  var FilesListView = Marionette.CompositeView.extend({

    // tagName				: 'ul',
    // template			: '.js--upload-form',
    childViewContainer: '.js--files-list',
    childView: FileView,
    collection: FilesCollection,

    // 	template: _.template(''),

    // });

    // var FileUploaderView = Marionette.LayoutView.extend({

    template: '#file-uploader-template',
    // regions: {
    // 	fileUploader: '.js--uploaded-files'
    // },

    onRender: function () {
      // var fileUploader = new FilesListView({collection: new FilesCollection()});
      // this.showChildView('fileUploader', fileUploader);
    },

    ui: {
      basicUpload: '.js--basic-upload',
      advancedUpload: '.js--advanced-upload',
      form: '.js--upload-form',
      fileInput: 'input[type="file"]'
    },

    events: {
      'change @ui.fileInput': 'onFilesSelected',
      // 'drop @ui.form' : 'onFilesDropped'
    },

    // modelEvents: {
    // 	'change:data': 'reRenderCollection'
    // },

    // collectionEvents: {
    // 	add: 'onRenderCollection'
    // },

    initialize: function () {
      // console.log("FilesListView :: initialize", this.options);
    },

    onChildviewRemoveFile: function (cv, model) {
      // console.log("FilesListView :: onChildviewRemoveFile", cv, model);
      this.collection.remove(model);
    },

    onRender: function () {
      // console.log("FilesListView :: onRender", this.collection.toJSON());

      if (isAdvancedUpload) {

        this.ui.advancedUpload.removeClass('d-none');
        this.ui.basicUpload.addClass('d-none');

        var $form = this.ui.form;
        $form
          .on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
          })
          .on('dragover dragenter', function () {
            $form.addClass('is-dragover');
          })
          .on('dragleave dragend drop', function () {
            $form.removeClass('is-dragover');
          });

        $form.on('drop', this.onFilesDropped.bind(this));

      } else {

        this.ui.advancedUpload.addClass('d-none');
        this.ui.basicUpload.removeClass('d-none');

      }
    },

    // 	reRenderCollection: function() {
    // 		console.log("FilesListView :: reRenderCollection", this.collection.toJSON());
    // 		this.triggerMethod("render:collection");
    // 	},

    // 	onRenderCollection: function() {
    // 		console.log("FilesListView :: onRenderCollection", this.collection.toJSON());
    // 	},

    onFilesSelected: function (e) {
      console.debug("onFilesSelected", e);
      this.triggerMethod("read:files", e.currentTarget.files);

      // console.log('helo ');
      // console.log(
      //   $(e.currentTarget).parents('.js--advanced-upload')
      // );

      // remove already added
      $(e.currentTarget).parents('.js--advanced-upload').removeClass('uploaded');
      $(e.currentTarget).parents('.js--advanced-upload').removeClass('multiple');

      $(e.currentTarget).parents('.js--advanced-upload').addClass('uploaded');

      if (e.currentTarget.files.length > 1) {
        $(e.currentTarget).parents('.js--advanced-upload').addClass('multiple');
      }

      // if(
      //   $('.js--files-list > div').length > 0
      // ) {
      //   $('.js--advanced-upload').addClass('multiple');
      // }
    },

    onFilesDropped: function (e) {

      console.debug("onFilesDropped", e);
      // if (!tests.formdata) {
      // 	console.log("FormData is not supported in this browser");
      // 	return;
      // }

      // console.log('d');

      // console.log(
      //   e.currentTarget.classList.add
      // );

      // remove already added
      e.currentTarget.classList.remove('uploaded');
      e.currentTarget.classList.remove('multiple');

      e.currentTarget.classList.add('uploaded');

      if (e.originalEvent.dataTransfer.files.length > 1) {
        e.currentTarget.classList.add('multiple');
      }

      // // remove already added
      // $('.js--advanced-upload').removeClass('uploaded');
      // $('.js--advanced-upload').removeClass('multiple');

      // $('.js--advanced-upload').addClass('uploaded');

      // if(e.originalEvent.dataTransfer.files.length > 1) {
      //   $('.js--advanced-upload').addClass('multiple');
      // }

      // if(
      //   $('.js--files-list > div').length > 0
      // ) {
      //   $('.js--advanced-upload').addClass('multiple');
      // }

      if (
        $(e.currentTarget.querySelector('.js--files-list')).children('div').length > 0
      ) {
        e.currentTarget.classList.add('multiple');
      }

      this.triggerMethod("read:files", e.originalEvent.dataTransfer.files);
    },

    onReadFiles: function (files) {
      // var formData = tests.formdata ? new FormData() : null;
      // var filesCollection = new FilesCollection();
      for (var i = 0; i < files.length; i++) {
        var fileModel = new FileModel(files[i]);
        // this.collection.add(fileModel);
        // formData.append('file', files[i]);
        this.triggerMethod("read:file", files[i], fileModel);
      }
    },

    onReadFile: function (file, fileModel) {
      var self = this;
      // if (tests.filereader === true && acceptedTypes[file.type] === true) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var fileData = event.target.result;
        fileModel.set("data", fileData);
        // console.log("fileModel:", fileModel.toJSON());
        self.collection.add(fileModel);
      };
      reader.readAsDataURL(file);
      // }  else {
      // 	// holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
      // 	console.log(file);
      // }
    }

  })

}

var fileuploader1 = document.getElementById('file-uploader1');

if (fileuploader1 != null) {
  var filesListView1 = new FilesListView({
    el: '#file-uploader1',
    collection: new FilesCollection()
  });
  var filesListView2 = new FilesListView({
    el: '#file-uploader2',
    collection: new FilesCollection()
  });
  filesListView1.render();
  filesListView2.render();
}

// var holder = holder = document.getElementById('holder');
// var $form = $('.js--upload-form');
// var $input = $form.find('input[type="file"][multiple]');
// var $btnUpload = $('.js--upload-btn');

// if (isAdvancedUpload) {
//   $form.addClass('has-advanced-upload');
// }

// if (isAdvancedUpload) {

// 	var files = false;

// 	$form
// 		.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
// 			e.preventDefault();
// 			e.stopPropagation();
// 		})
// 		.on('dragover dragenter', function() {
// 			$form.addClass('is-dragover');
// 		})
// 		.on('dragleave dragend drop', function() {
// 			$form.removeClass('is-dragover');
// 		})
// 		.on('drop', onFilesDropped);
// 		// .on('drop', function(e) {
// 		// 	files = e.originalEvent.dataTransfer.files;
// 		// });

// 	$input.on('change', onFilesSelected);

// 	$btnUpload.on('click', function() {

// 		var ajaxData = new FormData($form.get(0));

// 		if (droppedFiles) {
// 			$.each( droppedFiles, function(i, file) {
// 				// debugger;
// 				console.log("BEFORE :", i, file, ajaxData);
// 			  	ajaxData.append( $input.attr('name'), file );
// 				console.log("AFTER	:", i, file,ajaxData);
// 			});
// 			// debugger;

// 		}
// readFiles(files);
// });

// 	function onFilesSelected(e) {
// 		console.debug("onFilesSelected", e);
// 		readFiles(e.currentTarget.files);
// 	}

// 	function onFilesDropped(e) {
// 		console.debug("onFilesDropped", e);
// 		if (!tests.formdata) {
// 			console.log("FormData is not supported in this browser");
// 			return;
// 		}
// 		readFiles(e.originalEvent.dataTransfer.files);
// 	}

// 	function readFiles(files) {
// 		var formData = tests.formdata ? new FormData() : null;
// 		var filesCollection = new FilesCollection();
// 		for (var i = 0; i < files.length; i++) {
// 			var fileModel = new FileModel(files[i]);
// 			filesCollection.add(fileModel);
// 			formData.append('file', files[i]);
// 			readFile(files[i], fileModel);
// 		}
// 	}

// 	function readFile(file, fileModel) {
// 		if (tests.filereader === true && acceptedTypes[file.type] === true) {
// 			var reader = new FileReader();
// 			reader.onload = function(event) {
// 				var fileData = event.target.result;
// 				fileModel.set("data", fileData);
// 				console.log("fileModel:", fileModel.toJSON());
// 			};
// 			reader.readAsDataURL(file);
// 		}  else {
// 			holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
// 			console.log(file);
// 		}
// 	}

// }


// Import Mass Upload >>>  import data *   Start
var inputs = document.querySelectorAll('.file-input')

for (var i = 0, len = inputs.length; i < len; i++) {
  customInput(inputs[i])
}

function customInput(el) {
  const fileInput = el.querySelector('[type="file"]')
  const label = el.querySelector('[data-js-label]')

  fileInput.onchange =
    fileInput.onmouseout = function () {
      if (!fileInput.value) return

      var value = fileInput.value.replace(/^.*[\\\/]/, '')
      el.className += ' -chosen'
      label.innerText = value
    }
};

// Import Mass Upload >>>  import data *   End


function clear_all() {
  $('.js--files-list').html('');

  $('.js--advanced-upload').removeClass('uploaded');
  $('.js--advanced-upload').removeClass('multiple');

};

// $(document).on('click', '.js--remove-file', function() {

//    // if (
//    //    $(this).closest('.js--files-list > div').length <= 1
//    // ) {
//    //    $(this).closest('.js--advanced-upload').removeClass('uploaded');
//    //    $(this).closest('.js--advanced-upload').removeClass('multiple');
//    // }

//    // if (
//    //    $(this).parent().parent().children('div').len() <= 1
//    // ) {
//    //    $(this).closest('.js--advanced-upload').removeClass('uploaded');
//    //    $(this).closest('.js--advanced-upload').removeClass('multiple');
//    // } 
// });

$(document).ready(function (e) {
  $('#file-uploader1 form input').attr('id', 'file-uploader1-file');
  $('#file-uploader1 form label').attr('for', 'file-uploader1-file');
});

// File Drag And Drop


















$(function () {
  var el = document.getElementById('pagination-demo1');
  var el1 = document.getElementById('pagination-demo2');
  var el2 = document.getElementById('pagination-demo3');
  if (el != null) {
    (function (name) {
      var container = $('#pagination-' + name);
      var sources = function () {
        var result = [];

        for (var i = 1; i < 196; i++) {
          result.push(i);
        }

        return result;
      }();

      var options = {
        dataSource: sources,
        showGoInput: true,
        showGoButton: true,
        showNavigator: true,
        position: 'top',
        formatNavigator: 'Showing <span style="color: #f00;"><%= currentPage %></span> to <%= currentPage %></span> of, <%= totalPage %> pages, <%= totalNumber %> entries',

        callback: function (response, pagination) {
          // window.console && console.log(response, pagination);

          var dataHtml = '<ul>';

          $.each(response, function (index, item) {
            dataHtml += '<li>' + item + '</li>';
          });

          dataHtml += '</ul>';

          container.prev().html(dataHtml);
        }
      };

      //$.pagination(container, options);

      container.addHook('beforeInit', function () {
        // window.console && console.log('beforeInit...');
      });
      container.pagination(options);

      container.addHook('beforePageOnClick', function () {
        // window.console && console.log('beforePageOnClick...');
        //return false
      });
    })('demo1');
  }

  if (el1 != null) {
    (function (name) {
      var container = $('#pagination-' + name);
      var sources = function () {
        var result = [];

        for (var i = 1; i < 196; i++) {
          result.push(i);
        }

        return result;
      }();

      var options = {
        dataSource: sources,
        showGoInput: true,
        showGoButton: true,
        showNavigator: true,
        position: 'top',
        formatNavigator: 'Showing <span style="color: #f00;"><%= currentPage %></span> to <%= currentPage %></span> of, <%= totalPage %> pages, <%= totalNumber %> entries',

        callback: function (response, pagination) {
          // window.console && console.log(response, pagination);

          var dataHtml = '<ul>';

          $.each(response, function (index, item) {
            dataHtml += '<li>' + item + '</li>';
          });

          dataHtml += '</ul>';

          container.prev().html(dataHtml);
        }
      };

      //$.pagination(container, options);

      container.addHook('beforeInit', function () {
        // window.console && console.log('beforeInit...');
      });
      container.pagination(options);

      container.addHook('beforePageOnClick', function () {
        // window.console && console.log('beforePageOnClick...');
        //return false
      });
    })('demo2');
  }

  if (el2 != null) {
    (function (name) {
      var container = $('#pagination-' + name);
      var sources = function () {
        var result = [];

        for (var i = 1; i < 196; i++) {
          result.push(i);
        }

        return result;
      }();

      var options = {
        dataSource: sources,
        showGoInput: true,
        showGoButton: true,
        showNavigator: true,
        position: 'top',
        formatNavigator: 'Showing <span style="color: #f00;"><%= currentPage %></span> to <%= currentPage %></span> of, <%= totalPage %> pages, <%= totalNumber %> entries',

        callback: function (response, pagination) {
          // window.console && console.log(response, pagination);

          var dataHtml = '<ul>';

          $.each(response, function (index, item) {
            dataHtml += '<li>' + item + '</li>';
          });

          dataHtml += '</ul>';

          container.prev().html(dataHtml);
        }
      };

      //$.pagination(container, options);

      container.addHook('beforeInit', function () {
        // window.console && console.log('beforeInit...');
      });
      container.pagination(options);

      container.addHook('beforePageOnClick', function () {
        // window.console && console.log('beforePageOnClick...');
        //return false
      });
    })('demo3');
  }
});




// $("#folder-details-grid-folder table tbody tr td .d_463666").hover(
//   function () {
//     $(this).parent().parent().addClass("z-index-2");
//   },
//   function () {
//     $(this).parent().parent().removeClass("z-index-2");
//   }
// );
$("#folder-details-grid-folder table tbody tr td .d_463666 div button.er_6443").click(function (e) {
  // console.log($(this));
  $(this).parent().parent().parent().addClass("z-index-3");
});


$(document).on('click', '.show_now', function () {
  $('#' + $(this).attr('data-id')).modal('hide');
  $('.folder_result_table_collapse').addClass('d-none');
  $('.folder_result_table_collapse').prev().removeClass('active');
  $('[data-bs-target="#' + $(this).attr('data-id') + '"]').parents('tr').next('.folder_result_table_collapse').removeClass('d-none');
  $('[data-bs-target="#' + $(this).attr('data-id') + '"]').parents('tr').next('.folder_result_table_collapse').prev().addClass('active');
});

jQuery(document).ready(function () {
  jQuery('.folder_result_tables > table > tbody > tr:nth-child(2n+2)').addClass('d-none folder_result_table_collapse');
});






$("#minus").click(function (event) {
  zoom("out");
});

$("#plus").click(function (event) {
  zoom("in");
});

$("#range").on('input change', function (event) {
  $('#output').text($(event.currentTarget).val());
});

function zoom(direction) {
  var slider = $("#range");
  var step = parseInt(slider.attr('step'), 10);
  var currentSliderValue = parseInt(slider.val(), 10);
  var newStepValue = currentSliderValue + step;

  if (direction === "out") {
    newStepValue = currentSliderValue - step;
  } else {
    newStepValue = currentSliderValue + step;
  }

  slider.val(newStepValue).change();
};



$(document).ready(function () {
  $(".mail-sidebar-opner").click(function () {
    $(".mail-sidebar").toggleClass("active");
  });
});




