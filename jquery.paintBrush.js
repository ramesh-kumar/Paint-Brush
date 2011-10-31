  (function($) {
      $.fn.paintBrush = function(options) {
          var undoHistory = [];
              var settings = {
               'targetID' : 'canvas-display'
          },
  
              $this = $(this),
              o = {},
              ui = {},
          
          core = {
              init : function(options) {
                  ui.$loadParentDiv = o.targetID;
                  core.draw();
                  core.controls();
                  //core.toggleScripts();
              },
  
              canvasInit : function() {
                      context = document.getElementById("canvas-display").getContext("2d");
                      context.lineCap = "round";
                      //Fill it with white background
                      context.save();
                      context.fillStyle = '#fff';
                      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                      context.restore();
              },
              
              saveActions : function() {
                      var imgData = document.getElementById("canvas-display").toDataURL("image/png");
                      undoHistory.push(imgData);
                      $('#undo').removeAttr('disabled');
              
              },
              
              undoDraw : function() {
                  if(undoHistory.length > 0){
                      var undoImg = new Image();
                      $(undoImg).load(function(){
                          var context = document.getElementById("canvas-display").getContext("2d");
                          context.drawImage(undoImg, 0,0);
                      });
                      undoImg.src = undoHistory.pop();
                      if(undoHistory.length == 0)
                          $('#undo').attr('disabled','disabled');
                  }                            
              },
  
              draw : function() {
                      var canvas, cntxt, top, left, draw, draw = 0;                
                      canvas = document.getElementById("canvas-display");
                      cntxt = canvas.getContext("2d");
                      top = $('#canvas-display').offset().top;
                      left = $('#canvas-display').offset().left;
                      core.canvasInit();
                          
                      //Drawing Code
                      $('#canvas-display').mousedown(function(e){
                          if(e.button == 0){
                              draw = 1;
                              core.saveActions(); //Start The drawing flow. Save the state
                              cntxt.beginPath();
                              cntxt.moveTo(e.pageX-left, e.pageY-top);
                          } else {
                              draw = 0;
                          }
                      })
                       .mouseup(function(e){
                              if(e.button != 0){
                                  draw = 1;
                              } else {
                                  draw = 0;
                                  cntxt.lineTo(e.pageX-left+1, e.pageY-top+1);
                                  cntxt.stroke();
                                  cntxt.closePath();
                              }
                      })
                       .mousemove(function(e){
                              if(draw == 1){
                                  cntxt.lineTo(e.pageX-left+1, e.pageY-top+1);
                                  cntxt.stroke();
                              }
                      });
                                                                                          
              },
              
              controls : function() {
                      canvas = document.getElementById("canvas-display");
                      cntxt = canvas.getContext("2d");
                      $('#export').click(function(e){
                               e.preventDefault();
                              window.open(canvas.toDataURL(), 'Canvas Export','height=400,width=400');
                       });
                                  
                       $('#clear').live("click", function(e){
                               e.preventDefault();
                              canvas.width = canvas.width;
                              canvas.height = canvas.height;
                              core.canvasInit();
                              $('#colors li:first').click();
                              $('#brush_size').change();
                              //core.toggleScripts();
                              undoHistory = [];
                        });
                                  
                        $('#brush_size').change(function(e){
                                cntxt.lineWidth = $(this).val();
                                //core.toggleScripts();
                        });            
                        
                        $('#colors li').live("click", function(e){
                                e.preventDefault();
                              $('#colors li').removeClass('selected');
                              $(this).addClass('selected');
                              cntxt.strokeStyle = $(this).css('background-color');
                              core.toggleScripts();
                        });
                  
                                  //Undo Binding
                        $('#undo').live("click", function(e){
                                e.preventDefault();
                              core.undoDraw()
                              core.toggleScripts();
                        });
                  
                        //Init the brush and color
                        $('#colors li:first').click();
                        $('#brush_size').change();
                                  
                        $('#controls').live("click", function(){
                                core.toggleScripts();
                        });
              },
              
              toggleScripts : function() {
                       $('#colors').slideToggle(400);
                       $('#control-buttons').toggle(400);
              }
          };
  
          $.extend(true, o, settings, options);
  
          core.init();
  
      };
  })(jQuery);