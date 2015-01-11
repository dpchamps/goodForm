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

var addNumberMask = function(el){
    var dset = el.dataset.addnumbermask,
        selectionRange = {},
        mask = GoodForm.phoneAPI(dset),
        actualText = "",
        //this contains a number that corresponds with the number of ranges filled
        rangeIdx = 0,
        curRangeVal = "";

    //returns true if value is between start and end
    function isBetween(start, end, value){
        if(value >= start && value <= end){
            return true;
        }else{
            return false;
        }
    }

    function resetRange(map){
        var origRange = mask.value.substring(map.start, map.end);
        el.value = GoodForm.helpers.splice(el.value, map.start, map.end, origRange);
        el.setSelectionRange(map.start, map.end);
        curRangeVal = "";
    }
    function setRangeAtIdx(){
        el.setSelectionRange(mask.rangeMap[rangeIdx].start, mask.rangeMap[rangeIdx].end );
    }
    function addChar(char){
        var range = mask.rangeMap[rangeIdx],
            val = el.value.substring(range.start, range.end);

        if(curRangeVal.length === val.length){
            if(rangeIdx < mask.rangeMap.length-1){
                rangeIdx++;
                setRangeAtIdx();
                curRangeVal = "";
            }
        }else{
            curRangeVal += char;
            val = GoodForm.helpers.splice(val, 0, curRangeVal.length, curRangeVal);
            el.value = GoodForm.helpers.splice(el.value, range.start, range.end, val);
            if(curRangeVal.length === val.length && rangeIdx < mask.rangeMap.length-1){
                rangeIdx++;
                curRangeVal = "";
            }
            setRangeAtIdx();
        }
    }
    function keydownListener(e){
        if(e.which < 48) {
            e.preventDefault();
            switch (e.which) {
                //backspace
                case(8):
                    //splice the last character with the original value


                    break;
                //del
                case(46):
                    resetRange(mask.rangeMap[rangeIdx]);
                    break;
                case(9):
                    if(rangeIdx < mask.rangeMap.length-1){
                        rangeIdx++;
                        setRangeAtIdx();
                        curRangeVal = "";

                    }
                    break;
                //left arrow
                case(37):
                    if(rangeIdx > 0){
                        rangeIdx--;
                        setRangeAtIdx();
                        curRangeVal = "";

                    }
                    break;
                //right arrow
                case(39):
                    if(rangeIdx < mask.rangeMap.length-1){
                        rangeIdx++;
                        setRangeAtIdx();
                    }
            }
        }
    }
    function keypressListener(e){
        e.preventDefault();
        //so first we make sure that the user is focused on the current range
        setRangeAtIdx();
        addChar(String.fromCharCode(e.which));
    }

    el.maxLength = mask.value.length;
    el.value = mask.value;
    el.addEventListener('click', function(e){
        e.preventDefault();
        var selectIdx = el.selectionStart,
            found = false;
        mask.rangeMap.forEach(function(range, idx){
            if(isBetween(range.start, range.end, selectIdx)){
                el.setSelectionRange(range.start, range.end);
                found = true;
                rangeIdx = idx;
            }
        });
        if(!found){
            el.setSelectionRange(mask.rangeMap[0].start, mask.rangeMap[0].end);
            rangeIdx = 0;
        }
        var rangeMap = mask.rangeMap[rangeIdx];

    });
    el.addEventListener('keydown', keydownListener, false);
    el.addEventListener('keypress', keypressListener, false);

};

GoodForm.addNumberMask = addNumberMask;