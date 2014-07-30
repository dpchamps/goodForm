/* goodForm main */

var doc = root.document;

// Base function.
var goodForm = function(formId, options) {
    options = options || {};
    //The form to edit
    var form = doc.getElementById(formId);

    function extend( a, b ) {
        for( var key in b ) {
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    }
    var defaultOptions = {
        honeypot : true
    };


    var _init = function(){
        //overwrite default options with user provided options
        extend(defaultOptions, options);
        if(defaultOptions.honeypot){
            _honeyPot();
        }
    };

    _init();

    function _honeyPot(){
        var input1 = doc.createElement('input'),
            input2 = doc.createElement('input'),
            median = Math.floor(form.childNodes.length / 2);

        input1.placeholder ="Do Not Fill";
        input2.placeholder="Do Not Fill";

        input1.style.display = "none";
        input2.style.display = "none";

        input1.id = "_honey1";
        input2.id = "_honey2";

        form.appendChild(input2);
        form.insertBefore(input1, form.childNodes[median]);
    }
    /*
    _parsePlaceholder(o)

    o - placeholder Object
        placeholders should be formatted in this way:
        {} - curly braces define characters the are not replaced
        # -  number sign defines a number. It can be replaced by 'numberMask'.
        \" - an escaped double quote represents a string of letters
        \' - an escaped single quote represents a character


        phone number example
            input:
                placeholder : "{(}###{)}{ }###{ }####", numberMask : "5"
            output:
                (555) 555 5555

     */
    function _parsePlaceholder(o){
        var defaults = {
            placeholder: "",
            numberMask: "#"
        };
        //overwrite defaults with user input
        extend(defaults, o);
        var charPositions = [],
            braceCount = 0,
            newString = "",
            s = defaults.placeholder;

        for(var i = 0; i < s.length; i++){
            if(s[i] === '{' && braceCount === 0){
                braceCount++;
                continue;
            }
            if(s[i] === '}' && braceCount === 1){
                braceCount--;
                continue;
            }
            if(braceCount === 1){
                newString += s[i];
                charPositions.push(newString.length-1);
                continue;
            }
            if(braceCount === 0){
                newString += s[i];

            }

        }
        defaults.newString = newString;

        return defaults;


    }
    // http://stackoverflow.com/a/12518737/559997
    function _setCaretPosition(elemId, caretPos) {
        var el = doc.getElementById(elemId);

        el.value = el.value;
        // ^ this is used to not only get "focus", but
        // to make sure we don't have it everything -selected-
        // (it causes an issue in chrome, and having it doesn't hurt any other browser)

        if (el !== null) {

            if (el.createTextRange) {
                var range = el.createTextRange();
                range.move('character', caretPos);
                range.select();
                return true;
            }

            else {
                // (el.selectionStart === 0 added for Firefox bug)
                if (el.selectionStart || el.selectionStart === 0) {
                    console.log("hello");
                    el.focus();
                    setTimeout(function(){
                        el.setSelectionRange(caretPos, caretPos);
                    },0);
                    return true;
                }

                else  { // fail city, fortunately this never happens (as far as I've tested) :)
                    el.focus();
                    return false;
                }
            }
        }
    }

    return {
        /*
        add mask

        add placeholder text to a form that becomes replaced as the user types

        ex:
            |(555) 555 5555  | -- user inputs '503' -->| (503) 555 5555) |
         */
        addMask : function(id, maskObject){
            //first thing, let's decode the placeholder
            var placeholder = maskObject.placeholder || "";
            _parsePlaceHolder(placeholder);

            var el = doc.getElementById(id),
                hasInput = false;
            //when the user clicks the input field, add the mask and move the cursor
            el.onclick = function(e){
                e.preventDefault();
                //set the mask
                this.value = mask;
                //setTimeout for chromium problems
                _setCaretPosition(id, 0);
                this.onkeydown = function(e){
                    e.preventDefault();
                };
            };
            el.onblur = function(){
                if(hasInput){
                    //
                }else{
                    this.value = "";
                }
            };

        }

    };

};

root.goodForm = goodForm;
