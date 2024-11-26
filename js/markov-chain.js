// Node object to store data associated with each valid event
function Node(capital) {
    this.count = 1          // event frequency
    this.next = new Map()   // map of future events
    this.capital = capital  // capitalization

    this.getCapital = function(){return this.capital}

    this.addCount = function(){ this.count++ }

    this.getCount = function(){ return this.count; }

    this.getNext = function(){ return this.next }
}

// Taylor Swift albums (+ identification data)
const tsAlbums = [
    {
        name: "Fearless (Taylor's Version)",
        release_year: 2021,
        album_no: 10,
        txt_filename: "fearless-tv.txt",
    },
    {
        name: "Speak Now (Taylor's Version)",
        release_year: 2023,
        album_no: 13,
        txt_filename: "speaknow-tv.txt",
    },
    {
        name: "Red (Taylor's Version)",
        release_year: 2021,
        album_no: 11,
        txt_filename: "red-tv.txt",
    },
    {
        name: "1989 (Taylor's Version)",
        release_year: 2023,
        album_no: 14,
        txt_filename: "1989-tv.txt",
    },
    {
        name: "reputation",
        release_year: 2017,
        album_no: 6,
        txt_filename: "reputation.txt",
    },
    {
        name: "Lover",
        release_year: 2019,
        album_no: 7,
        txt_filename: "lover.txt",
    },
    {
        name: "folklore (deluxe version)",
        release_year: 2020,
        album_no: 8,
        txt_filename: "folklore.txt",
    },
    {
        name: "evermore (deluxe version)",
        release_year: 2020,
        album_no: 9,
        txt_filename: "evermore.txt",
    },
    {
        name: "Midnights (The Til Dawn Edition) + You're Losing Me",
        release_year: 2023,
        album_no: 12,
        txt_filename: "midnights.txt",
    },
    {
        name: "The Tortured Poets Department: The Anthology",
        release_year: 2024,
        album_no: 15,
        txt_filename: "ttpd.txt",
    },
]

// map of the toggles/checkboxes for the Taylor Swift albums
const tsMap = new Map([
    ["ts-album6", false],
    ["ts-album7", false],
    ["ts-album8", false],
    ["ts-album9", false],
    ["ts-album10", false],
    ["ts-album11", false],
    ["ts-album12", false],
    ["ts-album13", false],
    ["ts-album14", false],
    ["ts-album15", false],
    // ["t", true],
])

// YouTube channels (+ identification data)
const ytChannels = [
    {
        name: "My Stories Animated",
        id: "msa",
        txt_filename: "mystoriesanimated.txt",
    },
    {
        name: "True Tales Animated",
        id: "tta",
        txt_filename: "truetalesanimated.txt",
    },
]

// map of the toggles/checkboxes for the YouTube channels
const ytMap = new Map([
    ["msa", false],
    ["tta", false]
])

// map of text files
const filenames = new Map([
    ["ts-album6", "reputation.txt"],
    ["ts-album7", "lover.txt"],
    ["ts-album8", "folklore.txt"],
    ["ts-album9", "evermore.txt"],
    ["ts-album10", "fearless-tv.txt"],
    ["ts-album11", "red-tv.txt"],
    ["ts-album12", "midnights.txt"],
    ["ts-album13", "speaknow-tv.txt"],
    ["ts-album14", "1989-tv.txt"],
    ["ts-album15", "ttpd.txt"],
    // ["t", "text.txt"],
    ["msa", "mystoriesanimated.txt"],
    ["tta", "truetalesanimated.txt"],
])

var NUM_TOKENS = 2, // number of tokens
    start,          // dictionary of starters
    chain,          // global dictionary
    stack           // Stack data structure; to track paired typographical symbols used in the English language (e.g. quotation marks, brackets)

// set up
const init_filters = () => {
    for (let i = 0; i < tsAlbums.length; i++){
        $('<li>',{
            'html' : $('<input>',{
                'type' : 'checkbox',
                'class' : 'filter-cb',
                'id' : 'ts-album'+tsAlbums[i].album_no,
                'name' : 'ts-album',
            }).add($('<label>',{
                'for' : 'ts-album'+tsAlbums[i].album_no,
            }).text(tsAlbums[i].name+" ("+tsAlbums[i].release_year+")"))
        }).appendTo('section#ts-albums ul.toggle-filters')
    }

    for (let i = 0; i < ytChannels.length; i++){
        $('<li>',{
            'html' : $('<input>',{
                'type' : 'checkbox',
                'class' : 'filter-cb',
                'id' : ytChannels[i].id,
                'name' : 'yt-channel',
            }).add($('<label>',{
                'for' : ytChannels[i].id,
            }).text(ytChannels[i].name))
        }).appendTo('section#yt-titles ul.toggle-filters')
    }
}

// get a random [global] starter
function getStart(total){
    var random = parseInt(1 + Math.random() * total), count = 0
    for (const s of start.entries()){
        count += start.get(s[0]).getCount()
        if (random <= count) return s[0]
    }
    return null
}

// get a random [local] proceeding event following the current event
function getFromNext(next, total){
    var random = parseInt(1 + Math.random() * total), count = 0
    for (const s of next){
        count += s[1]
        if (random <= count) return s[0]
    }
    return null
}

function pushStack(c){
    /* keep track of the following paired typographical symbols:
        - quotation marks (double)  ->      " "
        - parentheses               ->      ( )
        - brackets                  ->      [ ]
        - braces                    ->      { }
        - angle brackets            ->      < > */
    
    /* successful stack push conditions:
        - stack is empty,
        - or if the character is an opening bracket,
        - or if it's a quotation mark and the previous stack was not a quotation mark,
        - or if it's a closing bracket and the previous symbol was not the corresponding open bracket */
    if(stack.length == 0 || c.match(/[([{<]/) || (c == "\"" && stack[stack.length-1] != "\"") || (!!c.match(/[\]}>]/) && stack[stack.length-1].charCodeAt(0) != c.charCodeAt(0) - 2) || c == ")" && stack[stack.length-1] != "("){
        stack.push(c)
        return true
    }
    stack.pop()
    return false
}

// main function -> generate line of text
function generate (){
    // console.log("Chain length: " + chain.size + " | Total starts: " + numStarts + " | Tokens: " + NUM_TOKENS) // testing and visualization purposes

    /*for (const s of chain.entries()){ // testing and visualization purposes
        console.log("\t"+ s[0] + ": " + chain.get(s[0]).getCount() + " | " + chain.get(s[0]).getCapital())

        if (chain.get(s[0]).getNext() != null){
            for (const ss of chain.get(s[0]).getNext().entries())
            console.log("\t\t(" + ss[0] + ", " + ss[1] + ")")
        }
    }*/
    
    // initialize stack
    stack = []

    var generate = "",  // line of text to build
        pushed = false, // truth value of whether the stack push was successful
        tokens          // string array acting as a queue

    // start building the line here!
    // to get started, let the queue be a line starter
    tokens = getStart(numStarts).split(" ")
    
    // append to 'generate' while considering a few formatting rules
    for (var str of tokens){
        // if the previous append was a punctuation mark, or the current token string 'str' should be capitalized, then capitalize the first letter
        if (!!generate.slice(-1).match(/[.!?]/) || start.get(tokens.join(' ')).getCapital()) // "I" pronoun = match(/^i(['][a-z]*)*$/)
            str = str.substring(0,1).toUpperCase() + str.substring(1)

        // if generate is empty, or str matches the regex, then append without a space character
        if (!generate || !!str.match(/[.,:;!?)\]}>—]/) || generate.slice(-1).match(/[([{<]/) || (generate.slice(-1) == "\"" || str == "\"") && stack[stack.length-1] == "\"") generate += str

        // otherwise, append with a space character
        else generate += (" " + str)

        // if str matches the regex, try the stack
        if(!!str.match(/[()[\]{}<>"]/)) pushed = pushStack(str)
    }

    // add a random proceeding event
    tokens.push(getFromNext(start.get(tokens.join(' ')).getNext(), start.get(tokens.join(' ')).getCount()))
    
    // building while not at the end of the line
    while (tokens.every(str=>str != null)){        
        var str = tokens.at(-1)

        // if str should be capitalized, or generate ended with a punctuation mark, then capitalize the first letter
        if (chain.get(tokens.toString()).getCapital() || !!generate.slice(-1).match(/[.!?]/)) // "I" pronoun: !!str.match(/^i(['][a-z]*)*$/)
            str = str.substring(0,1).toUpperCase() + str.substring(1)

        // if the latest string matches the regex, or the previous append was an open bracket, or the latest stack item is a quotation mark and either the previous append was a quotation mark or str is a quotation mark, then append without a space character
        if(!!str.match(/[.,:;!?—)\]}>]/) || generate.slice(-1).match(/[([{<]/) || (generate.slice(-1) == "\"" || str == "\"") && stack[stack.length-1] == "\"")
            generate += str
    
        // otherwise, append with a space character
        else generate += (" " + str)

        // if str matches the regex, try the stack
        if(!!str.match(/[()[\]{}<>"]/)) pushed = pushStack(str)
        
        // queue in random next event
        tokens.push(getFromNext(chain.get(tokens.toString()).getNext(),chain.get(tokens.toString()).getCount()))
        
        // dequeue out first event
        tokens.shift()
    }

    // final format cleaning - while there are incomplete brackets or quotation marks
    while(stack.length > 0){
        let c = stack.pop(), random = Math.random(), c2

        /* important ASCII values:
            "       ->      34
            (       ->      40      )       ->      41
            <       ->      60      >       ->      62
            [       ->      91      ]       ->      93
            {       ->      123     }       ->      125 */

        // 50% chance to remove it
        if(random < 0.5)
            generate = (generate.substring(0, generate.lastIndexOf(c)) + generate.substring(generate.lastIndexOf(c) + 1, generate.length)).trim()
        // 50% chance to complete it
        else{
            // if it's an open bracket, or it's a quotation mark and it's not at the end, then append the corresponding symbol at the end
            if(!!c.match(/[([{<]/) || c == "\"" && generate.slice(-1) != "\""){
                switch(c){
                    case "(":
                        c2 = ")"
                        break;
                    case "\"":
                        c2 = "\""
                        break;
                    default:
                        c2 = String.fromCharCode(c.charCodeAt(0)+2)
                }
                generate += c2
            }
            // otherwise, append the corresponding symbol at the beginning
            else{
                switch(c){
                    case ")":
                        c2 = "("
                        break;
                    case "\"":
                        c2 = "\""
                        break;
                    default:
                        c2 = String.fromCharCode(c.charCodeAt(0)-2)
                }

                generate = c2 + generate.substring(0,generate.lastIndexOf(c)).trim() + c + generate.substring(generate.lastIndexOf(c) + 1, generate.length)
            }
        }
    }
    
    // finally, try capitalizing first letter...
    try{
        let firstAlphabetChar = (/[a-z]/i.exec(generate)).index
        // if no error, then at least one letter exists
        return generate.substring(0,firstAlphabetChar + 1).toUpperCase() + generate.substring(firstAlphabetChar + 1)
    } catch(e){return generate}
}

function addToDictionary(text){
    // var lines = text.toLowerCase().split(/[\n\r]+/)
    var lines = text.split(/[\n\r]+/)
    
    for (var line of lines){
        if (line.trim()){
            /*  using regex, the line will split at:
                    - every blank space character
                    - before and after each punctuation mark and typographical symbol
                retains every:
                    - valid combo of letters
                    - punctuation mark
                    - typographical symbol
                    - hyphenated words
                    - words with apostrophe(s) or single quotation mark(s)
                    - first letter capitalization */
            var split = line.split(/(?<=["(){}<>[\],.!+=—])[\s]*|[\s]*(?=[ .,:;!?&+="()[\]{}<>—])+[\s]*/)
            
            // get the first <max(NUM_TOKENS - 1, 1)> string item(s)
            // since this is the beginning of the current line, count this as a possible line of text starter
            var first = split.slice(0, Math.max(NUM_TOKENS - 1, 1))

            // a key will be the strings joined together with a space character
            /* e.g. the line: "Hi, I'm here now!"
                produces the array  [0]: "Hi"
                                    [1]: ","
                                    [2]: "I'm"
                                    [3]: "here"
                                    [4]: "now"
                                    [5]: "!"
                and with NUM_TOKENS = 3, the keys (using .join(' ')) will be
                    - "Hi , I'm"
                    - ", I'm here"
                    - "I'm here now"
                    - "here now !"
                and the starter will be "Hi ," */

            // check if the first character is a capital letter
            let capital = !!first.slice(1).toString().substring(0,1).match(/[A-Z]/)

            // add as a possible starter
            if (start.has(first.join(' ').toLowerCase())) start.get(first.join(' ').toLowerCase()).addCount()
            else start.set(first.join(' ').toLowerCase(), new Node(capital))

            numStarts++

            // get this starter's list of next possible events (AKA the local dictionary)
            var next = start.get(first.join(' ').toLowerCase()).getNext()

            // now, we can read the rest of the line...
            for (let i = Math.max(NUM_TOKENS - 1,1); i < split.length; i++){
                // +1 frequency of current event in the local dictionary
                if (next.has(split[i].toLowerCase())) next.set(split[i].toLowerCase(), next.get(split[i].toLowerCase()) + 1)
                else next.set(split[i].toLowerCase(), 1)

                // get the rest of the string array
                var sequence = [split.slice(Math.min(i-1, i - NUM_TOKENS + 1), i+1)]
                
                // check if the first character is a capital letter
                let capital = !!sequence[0].slice(-1).toString().substring(0,1).match(/[A-Z]/)
                
                // +1 frequency of current event in the global dictionary (AKA the variable named 'chain')
                if (chain.has(sequence.join(' ').toLowerCase())) chain.get(sequence.join(' ').toLowerCase()).addCount()
                else chain.set(sequence.join(' ').toLowerCase(), new Node(capital))

                // update the local dictionary
                next = chain.get(sequence.join(' ').toLowerCase()).getNext()
            }
        }
    }
}

// build possible starts and global dictionary
function load(map){
    start = new Map()   // initialize the dictionary for possible starters
    chain = new Map()   // initialize the global dictionary
    numStarts = 0

    // var combo = Array.from($.merge(Array.from(tsMap.values()),Array.from(ytMap.values())), toggle => toggle ? 1 : 0).join('')
    // var binary = parseInt(combo,2)
    // var bin2dec = binary.toString(2).padStart(combo.length,'0')

    // get every toggled/checked toggle/checkbox
    for (const [filter, toggle] of map){
        if (toggle){
            // store text file data into sessionStorage
            if (!sessionStorage.getItem(filenames.get(filter))){
                $.ajax({
                    async: false,
                    type: 'GET',
                    url: "data/"+filenames.get(filter),
                    success: function(data) {
                        // console.log("fetch file: " + filenames.get(filter))
                        sessionStorage.setItem(filenames.get(filter), data)
                    }
                })
            }

            if (sessionStorage.getItem(filenames.get(filter)))
                addToDictionary(sessionStorage.getItem(filenames.get(filter)))
            else return "[Error: retrieving files...]"
        }
    }

    // generate line of text
    if (numStarts > 0) return generate()
    return null
}

$(document).ready(function(){
    sessionStorage.clear()

    init_filters()

    $(document).on('change', 'input[type=checkbox][class=filter-cb]',function(){
        switch(this.name){
            case "ts-album":
                tsMap.set(this.id, this.checked)
                break;
            default:
                ytMap.set(this.id, this.checked)
        }
    })

    $("#lyric").click(function(){
        var lyric = load(tsMap)
        if(lyric) $("#generate-lyric").text(lyric)
        else $("#generate-lyric").text("[No filters!]")
    })

    $("#title").click(function(){
        var lyric = load(ytMap)
        if(lyric){
            $("#generate-title").text(lyric)
            if(Math.random() < 0.5){
                $("#generate-views").text((Math.random() * 5 + 1).toFixed(1) + "M views")
            } else $("#generate-views").text((Math.floor(Math.random() * 998) + 1) + "K views")
        }else{
            $("#generate-title").text("[No filters!]")
            $("#generate-views").text("0 views")
        }
    })
})