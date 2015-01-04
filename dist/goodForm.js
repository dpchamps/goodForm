(function(root, undefined) {

  "use strict";


/* goodForm main */

var document = root.document,
    GoodForm = {
        doc : document
    };


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

/**
 * Created by Dave on 1/2/2015.
 */
var phoneAPI = function(placeholder){
        //An array for mapping selection ranges
    var rangeMap = [],
        //An array that maps the brace characters
        braceMap = [],
        //A string that contains the real value, excluding braces
        realString = "",
        //An array that contains the placeholder chars
        parseArr = placeholder.split(''),
        //for keeping track of braces
        braceCount = 0,
        //for keeping track of selection range
        rangeStart = false;
    console.log(parseArr);
    for(var i = 0; i < parseArr.length; i++){

        if( parseArr[i] === '{'){
            braceCount++;
            //if a current range is open, it becomes closed at the idx before the next open brace
            if(rangeStart){
                rangeStart = false;
                rangeMap[rangeMap.length-1].end = realString.length-1;
            }
            continue;
        }
        if( parseArr[i] === '}' ){
            braceCount--;
            continue;
        }
        if( braceCount === 1 ){
            //the real string should contain symbols included between braces
            realString += parseArr[i];
            //the braceMap contains the position of characters between braces,
            //  therefore, any braceMap position is equal to the length of the realString after the symbol has been added to the string
            braceMap.push(realString.length-1);
            continue;
        }
        if( braceCount === 0 ){
            realString += parseArr[i];
            //if a range has not started, push the begining
            if(rangeStart === false){
                rangeStart = true;
                rangeMap.push({start : realString.length-1});
            }
        }
    }
    //the last case, where a range is open, and there are no more braces
    if(rangeStart){
        rangeMap[rangeMap.length-1].end = realString.length-1;
    }
    return{
        rangeMap : rangeMap,
        braceMap : braceMap,
        value    : realString
    }
};

GoodForm.phoneAPI = phoneAPI;

/**
 * Created by Dave on 12/31/2014.
 */
/*
GoodForm.addNumberMask = function(id, maskObject){

    var mask = this.parsePlaceholder(maskObject.placeholder, maskObject.numberMask),
        //the value of the data in the input (not including symbols in the mask
        actualText = "",
        //the current position of the cursor
        textPos = 0,
        el = this.doc.getElementById(id);


    function keydownListener(e){
        if(e.which < 48){
            e.preventDefault();
            switch (e.which){
                case 8:
                    if(el.selectionStart < el.selectionEnd){
                        GoodForm.helpers.setCaretPosition(el, textPos);
                    }
                    //backspace
                    if(textPos === mask.charMap[0]+1){
                        //nothing
                    }else{
                        var newArr = mask.charMap.slice(1, mask.charMap.length).reverse();
                        newArr.forEach(function(value){
                            if(textPos-1 === value){
                                GoodForm.helpers.setCaretPosition(el, textPos);
                                textPos--;
                            }
                        });
                        el.value = GoodForm.helpers.replaceAt(el.value, textPos-1, mask.numberMask);
                        el.placeholder = el.value;
                        GoodForm.helpers.setCaretPosition(el, --textPos);
                        actualText = el.value;
                    }
                    break;
            }
        }
    }
    function keypressListener(e){
        e.preventDefault();

        if(el.selectionStart < el.selectionEnd){
            GoodForm.helpers.setCaretPosition(el, textPos);
        }
        var char = String.fromCharCode(e.which);
        if(textPos < el.maxLength && GoodForm.helpers.isNumber(char)){
            var charPos = el.selectionStart;
            el.value = GoodForm.helpers.replaceAt(el.value, el.selectionStart, char);
            el.placeholder = el.value;
            textPos++;
            GoodForm.helpers.setCaretPosition(el, charPos+1);
            mask.charMap.forEach(function(value){
                if(el.selectionStart === value){
                    GoodForm.helpers.setCaretPosition(el, value+1);
                    textPos++;
                }
            });
            actualText = el.value;
        }
    }

    function clickListener(e){
        e.preventDefault();

        if(textPos <= mask.charMap[0]+1){
            el.value = mask.value;
            GoodForm.helpers.setCaretPosition(el, mask.charMap[0]+1);
            console.log("Click: ", textPos, el.selectionStart);

            textPos = mask.charMap[0]+1;
        }else{
            el.value = actualText;
            el.selectionStart = textPos;
            el.selectionEnd = textPos;
        }
    }
    function keyuplistener(e){

    }
    function focusListener(e){
        e.preventDefault();
        if(textPos <= mask.charMap[0]+1){
            el.value = mask.value;
            GoodForm.helpers.setCaretPosition(el, mask.charMap[0]+1);
            textPos = mask.charMap[0]+1;
        }else{
            el.value = actualText;
            el.selectionStart = textPos;
            el.selectionEnd = textPos;
        }
        console.log("Focus: ",textPos, el.selectionStart);
        root.addEventListener('keydown', keydownListener, false);
        root.addEventListener('keypress', keypressListener, false);
        root.addEventListener('keyup', keyuplistener, false);
    }

    function blurListener(e){
        e.preventDefault();
        root.removeEventListener('keydown', keydownListener, false);
        root.removeEventListener('keypress', keypressListener, false);
        root.removeEventListener('keyup', keyuplistener, false);
    }

    //bind
    el.maxLength = mask.value.length;
    el.placeholder = mask.value;
    //GoodForm.helpers.addClass(el, 'noselect');
    //el.addEventListener('click', clickListener, false);
    el.addEventListener('select', function(e){
        console.log("start", el.selectionStart);
        console.log("end", el.selectionEnd);
    }, false);
    el.addEventListener('focus', focusListener, false);
    el.addEventListener('blur', blurListener, false);
};
    */

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


}(this));
