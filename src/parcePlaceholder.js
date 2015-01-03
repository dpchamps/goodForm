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