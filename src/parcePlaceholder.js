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
                rangeMap[rangeMap.length-1].end = realString.length;
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