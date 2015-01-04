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