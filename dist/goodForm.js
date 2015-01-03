(function(root, undefined) {

  "use strict";


/* goodForm main */


// An extend function, automatically makes deep copies
var extend = function(dest, sources, deepCopy){
    if(typeof deepCopy === 'undefined'){
        deepCopy = false;
    }
    var args = Array.prototype.slice.call(arguments);
    for(var i = 1; i < args.length; i++){
        for(var key in args[i]){
            if(args[i].hasOwnProperty(key)){
                if(deepCopy){
                    if(typeof args[i][key] === 'object' && (args[i][key] instanceof Array) === false){
                        dest[key] = dest[key] || {};
                        extend(dest[key], args[i][key]);
                    }else{
                        dest[key] = args[i][key];
                    }
                }else{
                    dest[key] = args[i][key];
                }

            }
        }
    }
    return dest;
};

var GoodForm = {};

GoodForm.extend = extend;
var config = {
    doc : root.document
};

extend(GoodForm, config);

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

/**
 * Created by Dave on 1/2/2015.
 */

var parsePlaceholder = function(placeholder, mask){
    if(typeof placeholder === 'undefined' ){
        throw new Error("placeholder undefined");
    }
    if( typeof mask === 'undefined'){
        mask = "5";
    }
    placeholder = placeholder.replace(/[#]/g, mask);
    var charMap = [],
        braceCount = 0,
        newString = "",
        s = placeholder,
        j = 0,
        totalBraces = 0;

    for(var i = 0; i < s.length; i++){
        if(s[i] === '{' && braceCount === 0){
            braceCount++;
            totalBraces+=1;
            continue;
        }
        if(s[i] === '}' && braceCount === 1){
            braceCount--;
            totalBraces+=1;
            continue;
        }
        if(braceCount === 1){
            newString += s[i];
            charMap[j++] = i-totalBraces;
            continue;
        }
        if(braceCount === 0){
            newString += s[i];

        }

    }

    return {
        value : newString,
        charMap : charMap,
        numberMask : mask
    }
};
/*
For now, I'll use the iteration version because this recursive method is far slower


var parsePlaceholder = function(placeholder, mask, recObj){
    if(typeof placeholder === 'undefined' ){
        throw new Error("placeholder undefined");
    }
    if( typeof mask === 'undefined'){
        mask = " ";
    }
    if(typeof recObj === 'undefined'){
        recObj = {
            charMap : [],
            braceCount : 0,
            totalBraces: 0,
            newString  : "",
            s : placeholder.replace(/[#]/g, mask).split(''),
            i : 0,
            j : 0
        }
    }else{
        recObj.i++;
    }

    switch(recObj.braceCount){
        case 0:
            if(recObj.s[0] === '{' ){
                recObj.s.shift();
                recObj.braceCount++;
                recObj.totalBraces++;
            }else{
                recObj.newString += recObj.s.shift();
            }
            break;
        case 1:
            if(recObj.s[0] === '}'){
                recObj.s.shift();
                recObj.braceCount--;
                recObj.totalBraces++;
            }else{
                recObj.newString += recObj.s.shift();
                recObj.charMap.push(recObj.i);
            }
            break;
    }

    if(recObj.s.length > 0){
        GoodForm.parsePlaceholder(placeholder, mask, recObj)
    }
    if(recObj.s.length===0){
        return {
            value : recObj.newString,
            charMap : recObj.charMap,
            numberMask : mask
        };
    }

};
*/
GoodForm.parsePlaceholder = parsePlaceholder;

/**
 * Created by Dave on 12/31/2014.
 */

GoodForm.addNumberMask = function(id, maskObject){

    var mask = this.parsePlaceholder(maskObject.placeholder, maskObject.numberMask),
        actualText = "",
        textPos = 0,
        el = this.doc.getElementById(id);


    function keydownListener(e){
        if(e.which < 48){
            var charPos = el.selectionStart;
            e.preventDefault();
            switch (e.which){
                case 8:
                    //backspace
                    if(charPos === mask.charMap[0]+1){
                        //nothing
                    }else{
                        var newArr = mask.charMap.slice(1, mask.charMap.length).reverse();
                        newArr.forEach(function(value){
                            if(charPos-1 === value){
                                el.selectionStart = charPos-1;
                                el.selectionEnd = charPos-1;
                                textPos--;
                                charPos = charPos-1;
                            }
                        });
                        el.value = GoodForm.helpers.replaceAt(el.value, charPos-1, mask.numberMask);
                        el.placeholder = el.value;
                        el.selectionStart = charPos-1;
                        el.selectionEnd = charPos-1;
                        textPos--;

                        actualText = el.value;
                    }
                    break;
            }
        }
    }
    function keypressListener(e){
        e.preventDefault();
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

            textPos = mask.charMap[0]+1;
        }else{
            el.value = actualText;
            el.selectionStart = textPos;
            el.selectionEnd = textPos;
        }
    }

    function focusListener(e){
        e.preventDefault();

        GoodForm.helpers.removeClass(el, 'valid');
        GoodForm.helpers.removeClass(el, 'invalid');
        root.addEventListener('keydown', keydownListener, false);
        root.addEventListener('keypress', keypressListener, false);
    }

    function blurListener(e){
        e.preventDefault();
        if(textPos === el.maxLength){
            GoodForm.helpers.addClass(el, 'valid');
        }else{
            GoodForm.helpers.addClass(el, 'invalid');
            el.value = "";
        }
        root.removeEventListener('keydown', keydownListener, false);
        root.removeEventListener('keypress', keypressListener, false);
    }

    //bind
    el.maxLength = mask.value.length;
    el.addEventListener('click', clickListener, false);
    el.addEventListener('focus', focusListener, false);
    el.addEventListener('blur', blurListener, false);
};

/**
 * Created by Dave on 12/31/2014.
 */

root.GoodForm = GoodForm;

}(this));
