/**
 * Author: Shaheed Ebrahim
**/
function getStats(txt) {
    // This splits the text into the definition of words provided in the assignment description
    let words = txt.split(/[^A-z0-9]+/)
    for (i = 0; i < words.length; i++){
        words[i] = words[i].toLowerCase();
    }

    // There is an issue where if a non 'word' character is placed at the end
    // of the string then it can cause creation of an index that is empty
    // in this case we just need to remove it
    if (words[words.length-1] === ""){
        words.splice(words.length-1, 1) 
    }
    // The same issue can happen if the non 'word' character is placed
    // at the beginning of the string
    if (words[0] === ""){
        words.splice(0,1)
    }

    let numChars = 0
    for (let val of words){
        numChars += val.length
    }
   
    // We know that every line has to end with a \n character so just split on that
    // and that gives us the number of lines there are 
    let lines = txt.split(/\n/)  
    let nNonEmpty = 0
    for (let val of lines){
        //To find non empty lines we simply need to find one alpha numeric character
        //that is not a tab or new line character
        if (val.search(/[^ \t\n]/) !== -1){
            nNonEmpty+=1;
        }
    }

    // Could have also accomplished this by sorting the array but
    // looping through is O(n) versus sorting which is O(n log n)
    let maxLine = 0
    for (let val of lines){
        if (val.length > maxLine){
            maxLine = val.length
        }
    }

    let palindromes = []
    for (let val of words){
        let isPalin = true 
        if (val.length > 2){
            // Since a palindrome repeats at the half point we only need to loop
            // through the first half of it
            for (let i = 0; i < val.length/2; i++){
                // At any point if the character at the left side of the mid point is not
                // equal to the corresponding character at the right point we know its not a
                // palindrome
                if (val[i] !== val[(val.length-1-i)]){
                    isPalin = false
                    break
                }
            }
            if (isPalin) palindromes.push(val)
        }
    }

    let longestWords = [] 
    // To find the longest words we first need to get rid of duplicates
    // this is an slow O(n^2) search method alternatively could have used
    // a faster hash set method
    for (i = 0; i < words.length; i++){
        let duplicate = false
        for (j = 0; j < longestWords.length; j++){
            if (i != j && words[i] === longestWords[j]){
                duplicate = true
            }
        }
        if (!duplicate) longestWords.push(words[i])
    }
    // The sort function here is based on the two parameter sort
    // First we check if the string lengths are the same and if they are not
    // we return the longest one, if they are the same we compare them lexicographically
    longestWords.sort(function(word1, word2){
        if (word1.length !== word2.length){
            return (word2.length - word1.length)
        }else{
            // Local compare does a check based on the language settings of the browser
            // it was the only compare method I could find found at:
            // https://www.w3schools.com/jsref/jsref_localecompare.asp
            return (word1.localeCompare(word2))
        }
    })

    // To get the frequency we first compute a dictionary where the 
    // key is the word and the value is the number of time it appears
    let frequency = {} 
    for (let val of words){
        if (val in frequency){
            frequency[val] = frequency[val] + 1
        }else{
            frequency[val] = 1
        }
    }

    // We then change the dictionary into an array with the format specified in the assn
    // word(frequency)
    let sortedFrequency = []
    for (let val in frequency){
        sortedFrequency.push(val+"("+frequency[val]+")") 
    }

    // The sort function here is not great, the freqX[freqX.length-2] is convoluted way of finding
    // the frequency number and comparing it to another to see which is greater, if both are the same
    // we do the same lexicographic comparison from earlier. Another way to have done this
    // is to look up the word in the dictionary from before instead of doing the parseInt(...)
    sortedFrequency.sort(function(freq1,freq2){
        if (parseInt(freq1[freq1.length-2]) !== parseInt(freq2[freq2.length-2])){
            return (parseInt(freq2[freq2.length-2]) - parseInt(freq1[freq1.length-2])) 
        }else{
            return (freq1.localeCompare(freq2))
        }
    })

    return {
        nChars: txt.length,
        nWords: words.length,
        nLines: lines.length,
        nNonEmptyLines: nNonEmpty,
        averageWordLength: (numChars / words.length),
        maxLineLength: maxLine,
        palindromes: palindromes,
        longestWords: longestWords.slice(0,10),
        mostFrequentWords: sortedFrequency.slice(0,10) 
    };
}


