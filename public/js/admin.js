/**
 * Created by Administrator on 2016/11/30.
 */
$(function(){
   $('.del').click(function(){
       var id = $(this).data('id');
       var tr = $('.item-id-'+ id);

       $.ajax({
           type: 'DELETE',
           url: '/admin/list',
           data:{id:id}
       })
       .done(function(results){
           if(results.success === 1){
               if(tr.length > 0 ){
                   tr.remove()
               }
           }
       })
   })
});