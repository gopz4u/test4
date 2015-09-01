
        

jQuery(document).bind(
   "mobileinit", function(){
   jQuery.extend( jQuery.mobile, { ajaxFormsEnabled: true });
        $.support.cors = true;
        $.mobile.allowCrossDomainPages = true;
        $.mobile.pushStateEnabled      = true;
        $.mobile.page.prototype.options.addBackBtn = true;
        //$.mobile.ajaxEnabled=false;

   });
   
$(document).ready(function() {
	
	var iurl = $.url();
	var loginUser;
	var loginPass;
	var formSv;
	var formAddr;
	var formFormat;	
	var formUser;
	var formPass;
	var formAddr;
	var menuType;
	
	var SMSOutputResult = false;
	var SMSOutputText="";
	var SMSHP="";
	
	var CONTACTS = [];
	var BIDList = [];
	
	var exeServer;
	var exeScript;
	
	var SV1;
	var SV2;
	var SV3;

	var SC1;
	var SC2;
	var SC3;
	var SC4;
	
	var SMSSERVER;
	var SMSPHONE;


     // Wait for Cordova to load
        document.addEventListener("deviceready", onDeviceReady, false);
        // Cordova is ready
        function onDeviceReady(){	
        		console.log('Loading PhoneBook');
            var options = new ContactFindOptions();
            options.filter=""; 
            options.multiple = true;
            var fields = ["*"];
            navigator.contacts.find(fields, onSuccess, onError, options);
        }

        function onSuccess(contacts){
        	console.log('PhoneBook found : ' + contacts.length);
        	CONTACTS = contacts;
        }

        function onError(contactError){alert('onError!');}
        


	SV1 = "http://192.168.0.20/exe/applottery.v9.3/m/";
	SV2 = "http://192.168.0.21/exe/applottery.v9.3/m/";
	SV3 = "http://192.168.0.22/exe/applottery.v9.3/m/";
		
	SC1 = "mobile3.php";
	SC2 = "mobile3.php";
	SC3 = "mobile3.php";
	SC4 = "mobile3.php";
	
	
	if($.localStorage('login_user')!=null) $("#login_user").val($.localStorage('login_user'));
	if($.localStorage('login_pass')!=null) $("#login_pass").val($.localStorage('login_pass'));

		
		
	if($.localStorage('login_format')!=null){
		if($.localStorage('login_format')==1){$('#f1').attr("checked", "checked");$('#f1').click();}
		if($.localStorage('login_format')==2){$('#f2').attr("checked", "checked");$('#f2').click();}
		if($.localStorage('login_format')==3){$('#f3').attr("checked", "checked");$('#f3').click();}
		if($.localStorage('login_format')==4){$('#f4').attr("checked", "checked");$('#f4').click();}
	}else{
		$.localStorage('login_format', 1);
		$("#f1").prop('checked', true);
	}


	if($.localStorage('login_server')!=null){
		if($.localStorage('login_server')==1){$('#sv1').attr("checked", "checked");$('#sv1').click();}
		if($.localStorage('login_server')==2){$('#sv2').attr("checked", "checked");$('#sv2').click();}
		if($.localStorage('login_server')==3){$('#sv3').attr("checked", "checked");$('#sv3').click();}
	}else{
		$.localStorage('login_server', 1);
		$('#sv1').attr("checked", "checked");
		$('#sv1').click();
	}
	
	if($.localStorage('login_sms')!=null){
		if($.localStorage('login_sms')=="smsServer"){$('#smsServer').attr("checked", "checked");$('#smsServer').click();}
		if($.localStorage('login_sms')=="smsPhone"){$('#smsPhone').attr("checked", "checked");$('#smsPhone').click();}
	}else{
		$.localStorage('login_sms', "smsServer");
		$('#smsServer').attr("checked", "checked");
		$('#smsServer').click();
	}
	

  $(".format").click(function() {
  		$.localStorage('login_format', this.value);
	});

  $(".server").click(function() {
			$.localStorage('login_server', this.value);
	});

  $(".sms").click(function() {
			$.localStorage('login_sms', this.value);
	});

  $("#menuMenuList").click(function() {
  		console.log("Switch to Menu List");
	});
	
	
  $("#menuOption").click(function() {
  		$("#option_list_ul").empty();
  		$("#option_list_ul").html('');
  		console.log("Switch to Menu Option");
			console.log("Listing BID " + BIDList.length);
			for (var i=0; i<BIDList.length; i++) {
				$('#option_list_ul').append("<li><a href='#' class='OptionBID' rel='"+BIDList[i]+"'>"+BIDList[i]+"</a></li>");
			}
			$('#option_list_ul').listview('refresh');
  		
	});


	$('.OptionBID').live('click', function() {
			
  		console.log("BID#" + this.rel + " Clicked");
  		
			 $(this).simpledialog({
			    'mode' : 'bool',
			    'prompt' : 'BetID#'+this.rel,
			    'useModal': true,
			    'buttons' : {
			      'Rebuy': {
			        click: function () {
			          console.log("BID#" + this.rel + " Rebuy");
								var mobile;
						 		mobile =  $.localStorage('exe_server') + $.localStorage('exe_format');
								mobile+= "?user="+$.md5($.localStorage('login_user'));
								mobile+= "&pass="+$.md5($.localStorage('login_pass'));
								mobile+= "&f="+$.localStorage('login_format');
								mobile+= "&type=buy";
								mobile+= "&body=";
								mobile+= "&bid=" + this.rel;
								console.log("Para : " + mobile);
								console.log("Connecting Server...");
								$.ajax({  
								    url: mobile,  
								    dataType: "jsonp",  
								    success: function(data) { 
								    		//console.log(data.success);
								    		//console.log('Login : ' + data.message);
								    		$.mobile.loading('hide');
								    		$(".modalWindow").remove();
								    	if(data.success=="true"){
								    		//var BIDList = [];
								    		BIDList.length = 0;
												console.log("Connected, Now Process Dump Result");
							          init_DivContent('inputform_textbox_group');
												init_BetFormTextBox('inputform_textbox_group',30,0);
							          $.each(data.message, function(i,item){            
													//console.log( i +":"+item);
													//$.("#betform_txt").val('1');
													$("#betform_txt"+i).val(item);
												});
												$.mobile.changePage("#page_inputform", { transition: "slide", changeHash: false  });												
								    	}else{
								    		console.log("Connected, But Varification Fail");
												// show error message
												$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.message, true );
												setTimeout( $.mobile.hidePageLoadingMsg, 3500 );
								    	}
								    },
						        error: function(result) {
						        	console.log('Fail : Unable Connect To Server');
												$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, "Unable Connect To Server", true );
												setTimeout( $.mobile.hidePageLoadingMsg, 3500 );
						        	$.mobile.loading('hide');
						        	$(".modalWindow").remove();
						        }
								}); 
								
			        },
			        icon: "refresh",
			      },
			      'Delete BetID': {
			        click: function () {
			          console.log("BID#" + this.rel + " Delete");
								var mobile;
						 		mobile =  $.localStorage('exe_server') + $.localStorage('exe_format');
								mobile+= "?user="+$.md5($.localStorage('login_user'));
								mobile+= "&pass="+$.md5($.localStorage('login_pass'));
								mobile+= "&f="+$.localStorage('login_format');
								mobile+= "&type=cancel";
								mobile+= "&body=" + this.rel;
								mobile+= "&bid=" + this.rel;
								console.log("Para : " + mobile);
								console.log("Connecting Server...");
								$.ajax({  
								    url: mobile,  
								    dataType: "jsonp",  
								    success: function(data) { 
								    		//console.log(data.success);
								    		//console.log('Login : ' + data.message);
								    		$.mobile.loading('hide');
								    		$(".modalWindow").remove();
								    	if(data.success=="true"){
								    		//var BIDList = [];
								    		BIDList.length = 0;
												console.log("Connected, Now Process Dump Result");

												$('#output_result').html('');
							          $.each(data.message, function(i,item){            
							            $('#output_result').append(item + "<br>");							            
							          });
	          
		
												$.mobile.changePage("#page_output", { transition: "slide", changeHash: false  });												
								    	}else{
								    		console.log("Connected, But Varification Fail");
												// show error message
												$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.message, true );
												setTimeout( $.mobile.hidePageLoadingMsg, 3500 );
								    	}
								    },
						        error: function(result) {
						        	console.log('Fail : Unable Connect To Server');
												$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, "Unable Connect To Server", true );
												setTimeout( $.mobile.hidePageLoadingMsg, 3500 );
						        	$.mobile.loading('hide');
						        	$(".modalWindow").remove();
						        }
								}); 
								
			        },
			        icon: "delete",
			        theme: "b"
			      },
			      'Close': {
			        click: function () {
			          console.log("Doalog Close");
			        },
			        icon: "star",
			      }
			    }
			  });
  		
	});
	


  $("#menuOutputBack").click(function() {
  		console.log("Switch to InputForm + " + menuType);
  		if(menuType=="4d") {
				init_DivContent('inputform_textbox_group');
				init_BetFormTextBox('inputform_textbox_group',30,1);
  		}else{
				init_DivContent('inputform_textbox_group');
				init_BetFormTextBox('inputform_textbox_group',5,0);
  		}
	});
	
	
  $("#menuBet").click(function() {
		SMSHP="";
		if($.localStorage('login_sms')=="smsServer"){
			console.log("Hide SMS Bar ");
			SMSOutputResult = false;
			$('#output_sms').hide();
		}else{
			SMSOutputResult = true;
			console.log("Show SMS Bar ");
			$('#output_sms').show();
		}


  		console.log("Switch to BetForm");
			var pgHeader = $('#page_inputform #page-header');	pgHeader.text("Bet Form");
			var pgHeader = $('#page_output #page-header');	pgHeader.text("Bet Result");
		 	menuType="4d";
			init_DivContent('inputform_textbox_group');
			init_BetFormTextBox('inputform_textbox_group',30,1);
	});
	
  $("#menuResult").click(function() {
  		SMSHP="";
  		SMSOutputResult = true;
			console.log("Show SMS Bar ");
			$('#output_sms').show();
			
  		console.log("Switch to DrawResult");
			var pgHeader = $('#page_inputform #page-header');	pgHeader.text("Draw Result");
			var pgHeader = $('#page_output #page-header');	pgHeader.text("Draw Result");
		 	menuType="4dr";
			init_DivContent('inputform_textbox_group');
			init_BetFormTextBox('inputform_textbox_group',5,0);
	});
	
  $("#menuHit").click(function() {
  		SMSHP="";
  		SMSOutputResult = true;
			console.log("Show SMS Bar ");
			$('#output_sms').show();
			
  		console.log("Switch to HitRecords");
			var pgHeader = $('#page_inputform #page-header');	pgHeader.text("Hit Record(s)");
			var pgHeader = $('#page_output #page-header');	pgHeader.text("Hit Result");
		 	menuType="rp";
			init_DivContent('inputform_textbox_group');
			init_BetFormTextBox('inputform_textbox_group',5,0);
	});
	
  $("#menuBeprint").click(function() {
  		SMSHP="";
  		SMSOutputResult = true;
			console.log("Show SMS Bar ");
			$('#output_sms').show();
			
  		console.log("Switch to Reprint");
			var pgHeader = $('#page_inputform #page-header');	pgHeader.text("Reprint");
			var pgHeader = $('#page_output #page-header');	pgHeader.text("Reprint Result");
		 	menuType="rt";
			init_DivContent('inputform_textbox_group');
			init_BetFormTextBox('inputform_textbox_group',5,0);
	});
	
  $("#menuBalance").click(function() {
  		SMSHP="";
  		SMSOutputResult = true;
			console.log("Show SMS Bar ");
			$('#output_sms').show();
			
  		console.log("Switch to Balance");
			var pgHeader = $('#page_inputform #page-header');	pgHeader.text("Balance");
			var pgHeader = $('#page_output #page-header');	pgHeader.text("Balance Report");
		 	menuType="bl";
			init_DivContent('inputform_textbox_group');
			init_BetFormTextBox('inputform_textbox_group',5,0);
	});
	
  $("#menuCancelled").click(function() {
  		SMSHP="";
  		SMSOutputResult = true;
			console.log("Show SMS Bar ");
			$('#output_cancelled').show();
			
  		console.log("Switch to Cancelled");
			var pgHeader = $('#page_inputform #page-header');	pgHeader.text("Cancelled");
			var pgHeader = $('#page_output #page-header');	pgHeader.text("Cancelled Report");
		 	menuType="cancel";
			init_DivContent('inputform_textbox_group');
			init_BetFormTextBox('inputform_textbox_group',5,0);
	});
	
  $("#menuHelp").click(function() {
  		SMSHP="";
  		SMSOutputResult = true;
			console.log("Show SMS Bar ");
			$('#output_sms').show();
			
  		console.log("Switch to Help");
			var pgHeader = $('#page_inputform #page-header');	pgHeader.text("Help");
			var pgHeader = $('#page_output #page-header');	pgHeader.text("Result");
		 	menuType="h";
			init_DivContent('inputform_textbox_group');
			init_BetFormTextBox('inputform_textbox_group',5,0);
	});

  $("#output_btnSMS").click(function() {
  		console.log("Switch to PhoneBook For SMS Process");
			SMSOutputResult=true;
			
			if(SMSHP==""){
				$.mobile.changePage("#page_phonebook", { transition: "slide", changeHash: false  });
			}else{
				console.log("Sending SMS to " + SMSHP);
				var smsSendingPlugin = cordova.require('cordova/plugin/smssendingplugin');
				smsSendingPlugin.send (SMSHP, SMSOutputText, function() {
				 $(this).simpledialog({
				    'mode' : 'bool',
				    'prompt' : 'SMS Sent OK',
				    'useModal': true,
				    'buttons' : {
				      'OK': {
				        click: function () {
				        	$.mobile.changePage("#page_menulist", { transition: "slide", changeHash: false  });
				        },
				      }
				    }
				  });
				//},function () {
					 $(this).simpledialog({
					    'mode' : 'bool',
					    'prompt' : 'SMS Sent Fail',
					    'useModal': true,
					    'buttons' : {
					      'OK': {
					        click: function () {
					        	$.mobile.changePage("#page_menulist", { transition: "slide", changeHash: false  });
					        },
					      }
					    }
					  });
    		});
    		SMSHP="";
			}
			
	});

	$('.CONTACTnumber').live('click', function() {
	   console.log("Select Number" + this.rel);
	   
	   	if(SMSOutputResult==true){
	   		
	   		SMSOutputResult=false;
				var smsSendingPlugin = cordova.require('cordova/plugin/smssendingplugin');
				smsSendingPlugin.send (this.rel, SMSOutputText, function() {
				 $(this).simpledialog({
				    'mode' : 'bool',
				    'prompt' : 'SMS Sent OK',
				    'useModal': true,
				    'buttons' : {
				      'OK': {
				        click: function () {
				        	$.mobile.changePage("#page_menulist", { transition: "slide", changeHash: false  });
				        },
				      }
				    }
				  });
				//},function () {
					 $(this).simpledialog({
					    'mode' : 'bool',
					    'prompt' : 'SMS Sent Fail',
					    'useModal': true,
					    'buttons' : {
					      'OK': {
					        click: function () {
					        	$.mobile.changePage("#page_menulist", { transition: "slide", changeHash: false  });
					        },
					      }
					    }
					  });
    		});

	   		
	   	}else{
		 		var Contain = "";
		    $("#inputform_textbox_group input").each(function(){
		    		if(Contain!="")return false;
		    		var tmpVal = $(this).val();
		    		if(tmpVal=="")Contain=this.id;
		    });
				//console.log("End checkin " + Contain);
				$("#"+Contain).val("#"+this.rel.replace(/[^\d]/g, ''));
				$.mobile.changePage("#page_inputform", { transition: "slide", changeHash: false  });
			}
	});
	

  $("#btn_login").click(function() {
  	loginUser = $("#login_user").val();
  	loginPass = $("#login_pass").val();
  	$.localStorage('login_user', loginUser);
  	$.localStorage('login_pass', loginPass);
  	$.localStorage('login_format', formFormat);
  	$.localStorage('login_server', formSv);

		if($.localStorage('login_format')==1) $.localStorage('exe_format', SC1);
		if($.localStorage('login_format')==2) $.localStorage('exe_format', SC2);
		if($.localStorage('login_format')==3) $.localStorage('exe_format', SC3);
		if($.localStorage('login_format')==4) $.localStorage('exe_format', SC4);

		if($.localStorage('login_server')==1) $.localStorage('exe_server', SV1);
		if($.localStorage('login_server')==2) $.localStorage('exe_server', SV2);
		if($.localStorage('login_server')==3) $.localStorage('exe_server', SV3);

		$.mobile.loading("show",{text: "Connecting",textVisible: true});
		$("body").append('<div class="modalWindow"/>');

		var mobile;
 		mobile =  $.localStorage('exe_server') + $.localStorage('exe_format');
		mobile+= "?user="+$.md5($.localStorage('login_user'));
		mobile+= "&pass="+$.md5($.localStorage('login_pass'));
		console.log('Connecting Server-->'  + mobile);
		console.log('Connecing Server to Matching User Info');

		//$.localStorage('foo', 'bar');
		$.ajax({  
		    url: mobile,  
		    dataType: "jsonp",  
		    success: function(data) { 
		    	//console.log(data.success);
		    	console.log('Login : ' + data.message);
		    		$.mobile.loading('hide');
		    		$(".modalWindow").remove();
		    		
		    	if(data.success=="true"){

						var pgHeader = $('#page_menulist #page-header');	pgHeader.text("Welcome " + $.localStorage('login_user'));
						var pgFooter = $('#page_menulist #page-footer');	pgFooter.text("Have A Nice Day");
			
						$.mobile.changePage("#page_menulist", { transition: "slideup", changeHash: false  });
		    	}else{
						// show error message
						$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.message, true );
						setTimeout( $.mobile.hidePageLoadingMsg, 3500 );
		    	}
		    },
        error: function(result) {
        	console.log('Fail : Unable Connect To Server');
						$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, "Unable Connect To Server", true );
						setTimeout( $.mobile.hidePageLoadingMsg, 3500 );
        	$.mobile.loading('hide');
        	$(".modalWindow").remove();
        }
		});  
	});
	
	
	
	
	
	$('#page_inputform').on('pageinit', function() {
		
		console.log("MenuType : " + menuType);
		
		if(menuType=="" || menuType==undefined){
			 $.mobile.changePage("#page_menulist", { transition: "slideup", changeHash: false  });
		}
	});
	
	
	$('#page_output').on('pageinit', function() {
		

	});

	
	$('#page_phonebook').on('pageinit', function() {
		
		
	    for (var i=0; i<CONTACTS.length; i++) {

  			if(CONTACTS[i].phoneNumbers.length > 0){
  				var numlist="";;
  				numlist = "<ul>";
  				for (var j=0; j<CONTACTS[i].phoneNumbers.length; j++) {
  					numlist = numlist + "<li><a class='CONTACTnumber' rel='"+CONTACTS[i].phoneNumbers[j].value+"'><div>" + CONTACTS[i].phoneNumbers[j].value + "</div><sub>" + CONTACTS[i].phoneNumbers[j].type + "</sub></a></li>";
  				}
  				numlist = numlist + "</ul>";
  				
  				$('#phonebook_list_ul').append("<li><div>"+CONTACTS[i].displayName+"</div>"+numlist+"</li>");
  			}else{
					$('#phonebook_list_ul').append("<li><div>"+CONTACTS[i].displayName+"</div></li>");
  			}
			}
			$('#phonebook_list_ul').listview('refresh');
			
	});
	
	
	
	  $("#inputform_btnsubmit").click(function() {
	  	console.log("MenuType : " + menuType);
	  	console.log("Start Collecting Inputs");
	  	
	 		var Contain = "";
	    $("#inputform_textbox_group input").each(function(){
	    		var tmpVal = $(this).val();
	    		if(tmpVal){
	    		if(Contain)Contain+="+"

	    		if(tmpVal.substring(0,1)=="#" && tmpVal.length>9){
						SMSHP = tmpVal.substring(1,tmpVal.length);
	    			console.log("Found HP Number " + SMSHP);
	    		}
	    		
	    		tmpVal = tmpVal.replace(/#/g,",");

	        Contain += tmpVal;
	      	}
	    });
	    
		var mobile;
 		mobile =  $.localStorage('exe_server') + $.localStorage('exe_format');
		mobile+= "?user="+$.md5($.localStorage('login_user'));
		mobile+= "&pass="+$.md5($.localStorage('login_pass'));
		mobile+= "&f="+$.localStorage('login_format');
		if($.localStorage('login_sms')=="smsServer") mobile+= "&s=1";
		mobile+= "&type=" + menuType;
		mobile+= "&body="+Contain;
		
		//console.log("Para : " + mobile);
		console.log("Connecting Server...");
		$.ajax({  
		    url: mobile,  
		    dataType: "jsonp",  
		    success: function(data) { 
		    	//console.log(data.success);
		    		//console.log('Login : ' + data.message);
		    		$.mobile.loading('hide');
		    		$(".modalWindow").remove();
		    		
		    	if(data.success=="true"){
		    		//var BIDList = [];
		    		BIDList.length = 0;
						console.log("Connected, Now Process Dump Result");
						$('#output_result').html('');
	          $.each(data.message, function(i,item){       
	          	SMSOutputText = SMSOutputText+'\n'+item;
	            $('#output_result').append(item + "<br>");
							var BIDchk = item.substring(0, 3);
							if(BIDchk=="BID"){
								var BID = item.substring(4, item.length);
								console.log('bid : ' + BID);
								BIDList.push(BID);
							}
	            
	          });
	          console.log("Total BID " + BIDList.length);
						$.mobile.changePage("#page_output", { transition: "slide", changeHash: false  });
		    	}else{
		    		console.log("Connected, But Varification Fail");
						// show error message
						$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.message, true );
						setTimeout( $.mobile.hidePageLoadingMsg, 3500 );
		    	}
		    },
        error: function(result) {
        	console.log('Fail : Unable Connect To Server');
						$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, "Unable Connect To Server", true );
						setTimeout( $.mobile.hidePageLoadingMsg, 3500 );
        	$.mobile.loading('hide');
        	$(".modalWindow").remove();
        }
		}); 

			  
		});
	

});



function init_DivContent(id){
  $("#"+id).html('');
  
}

function init_BetFormTextBox(myid,txtcnt,ini){
var i;
var defaultVal;
i=0;
j=parseInt(0)+parseInt(txtcnt);
defaultVal="";
line = "";
while (i<j){
	if(i==0){ defaultVal="D";
	}else if(i==1 && ini==1){ defaultVal="#123";
	}else{  defaultVal="";}
	
	line = "<div><input type='tel' id='betform_txt"+i+"' name='betform_txt"+i+"' alt='"+i+"'  value='"+defaultVal+"' class='betform_txtlst'></div>";
	$('#'+myid).append(line).trigger('create');
  
  
	i++;
}//end of while
}




