$(document).ready(function(){
 $('#show-content').hide();
 $('#login').on('click', function(){
   $('#show-content').show();
   $('#login').hide();

 });

 $('#submit_userName').on('click', function(){
   $('#show-content').hide();

 });


});



/*if find_sender
    render json: @sender
  else
    @sender = Sender.new({name: params[:name], user_name: params[:userName]})
    @sender.save
    render json: @sender
  end*/
