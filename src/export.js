/**
 * Created by Dave on 12/31/2014.
 */

//root.GoodForm = GoodForm;


var nl = document.querySelectorAll('[data-addnumbermask]'),
    selectors = Array.prototype.slice.call(nl);

selectors.forEach(function(el){
   GoodForm.addNumberMask(el);
});
