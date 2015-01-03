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