/**
 * Created by Dave on 1/2/2015.
 */

GoodForm.helpers = {
    //functions for preforming interactions with elements
    addClass : function(elm, str){
        var found = false;
        for(var i = 0; i < elm.classList.length; i++){
            if(elm.classList[i].match(str) !== null){
                found = true;
            }
        }

        if(found){
            //
        }else{
            elm.className += " "+str;
        }
    },
    removeClass : function(elm, str){
        var exp = new RegExp("(?:^|\\s)"+str+"(?!\\S)", "g");
        elm.className = elm.className.replace(exp, '');
    },
    setCaretPosition : function(el, caretPos) {
        el.setSelectionRange(caretPos, caretPos);
    },

    //string manipulation helpers
    replaceAt : function(string, idx, char){
        return string.substr(0,idx) + char + string.substr(idx+1, string.length);
    },
    isNumber : function(str){
        return str.match(/[0-9]/) ? true : false;
    }

};