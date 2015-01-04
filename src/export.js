/**
 * Created by Dave on 12/31/2014.
 */

//root.GoodForm = GoodForm;


var nl = document.querySelectorAll('[data-addnumbermask]');
var selectors = Array.prototype.slice.call(nl);

selectors.forEach(function(el){
    //GoodForm.addNumberMask
   GoodForm.addNumberMask(el.id, {
       placeholder: el.placeholder,
       numberMask: el.dataset.addnumbermask
   });
});
