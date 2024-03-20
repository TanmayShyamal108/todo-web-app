// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import $, { ajax } from "jquery";




$(()=>{
    function Loadcomponent(page){
        $.ajax({
            method:"get",
            url:page,
            success:(response)=>{
                $("main").html(response);
            }
        })
    
    }
    function Loadappointements(takeuserid){
        $("#appointements").html="";
        $.ajax({
            method:'get',
            url:`http://127.0.0.1:5500/appointments/${takeuserid}`,
            success:(appointments)=>{
                $("#lblgreet").append(`<h2>${sessionStorage.getItem("username")}</h2>`)
                // console.log(appointments)
                
                appointments.map(item=>{
                    // console.log(item)
                    $(`
                    <div class="alert alert-dismissable alert-success m-3p-2">
                    
                    <h2>${item.Title}</h2>
                    <div class="text-end">
                    <button class="btn btn-close" id="btndelete" value=${item.Id} ></button>
                    </div>
                   
                    <div>
                    <span class="bi bi-clock">${item.Date}</span>

                    </div>
                    </div>
                    
                    `).appendTo("#appointements")
                })
            }

        })
    }

    $("#btnHomeLogin").click(()=>{
       Loadcomponent("login.html ")
    })

    $("#btnHomeRegister").click(()=>{
        Loadcomponent("register.html")
    })

    
    $(document).on("click","#btnNavRegister",()=>{

        Loadcomponent("register.html");
        
    })
    $(document).on("click","#btnNavlogin",()=>{

        Loadcomponent("login.html");
        
    })

    $(document).on('click','#btnLogin',()=>{

        $.ajax({
            method:'get',
            url:"http://127.0.0.1:5500/users",
            success:(users)=>{
                var user = users.find(item=>item.UserId===$("#UserId").val());
                if(user.Password===$("#Password").val()){
                    sessionStorage.setItem("username",user.UserName);
                    sessionStorage.setItem("Uid",user.UserId);
                   
                    Loadcomponent("appointements.html")
                    Loadappointements($("#UserId").val());
                    

                }else{
                    $("#lblError").html("<h3>Invalid User Id or Password</h3>")
                }

                
            }

        })
    })
    $(document).on("click","#btnSignout",()=>{
        sessionStorage.removeItem("username");
        Loadcomponent("login.html")

    })

    $(document).on("click","#btnRegister",()=>{
        var Newuser = {
            UserId:$("#RUserId").val(),
            UserName:$("#RUserName").val(),
            Password:$("#RPassword").val(),
            Email:$("#REmail").val(),
            Mobile:$("#RMobileNumber").val()
        }
        $.ajax({
            method:"post",
            url:"http://127.0.0.1:5500/register-user",
            data:Newuser
        })
        alert("Register component....");
        Loadcomponent("login.html");
         
    })
    $(document).on("click","#btnNewappointment",()=>{
        Loadcomponent("new-appointment.html")
    })
    $(document).on("click","#btnCreate",()=>{
        var num = parseInt($("#AId").val());
        var newapoin={
            UserId:sessionStorage.getItem("Uid"),
            Title:$("#ATitle").val(),
            Date:$("#ADate").val(),
            Id:$("#AId").val()
           

        }
        $.ajax({
            method:"post",
            url:"http://127.0.0.1:5500/add-task",
            data:newapoin
        })
        console.log(newapoin);
        alert('Successfully added task....')
        Loadcomponent("appointements.html")
        Loadappointements(newapoin.UserId)

    })
    $(document).on("click","#btndelete",(e)=>{
      var flag = confirm("are you confirm ");
      if(flag==true){
        $.ajax({
            method:"delete",
            url:`http://127.0.0.1:5500//delete-task/${e.target.value}`,
            

        })
        Loadappointements(sessionStorage.getItem("uid"));
      }

    })


})