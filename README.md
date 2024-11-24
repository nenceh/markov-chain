<mark>Read the complete version (with additional information, pictures, and <code>regex</code> demos) on my website!</mark>

## On this page...
  1. [Introduction](-intro)
  2. [Project Goals](-goals)
  3. [Development](-development)
  4. [Early Ideation](-early-ideation)
  5. [Testing](-testing)
  6. [Final Design](-final-designs)
  7. [What I Learned](-what-i-learned)
  8. [Next Steps](-next-steps)

# 🚀 Intro
I made this because I was bored. Actually, that's not the full truth. I was looking to build something new and fun because I was feeling some burnout.

I was inspired by the YouTube video <a href="https://youtu.be/VzsSLpAgNcQ" target="_blank">These Fake Animated Stories Have Gone Too Far</a> by Jarvis Johnson. In his commentary video, Johnson explored the eye-grabbing and "clickbait" titles of the videos made by certain animated story channels. As well, he made a <a href="https://animatedstorytitles.com/" target="_blank">website</a> where you can generate a random animated story title. He detailed how he utilized a language-learning model called the Markov chain.

# 🏆 Goals
Initially, my goal was to learn about the Markov chain model because it felt like the closest artificial intelligence I can construct by myself without having access to tons of data.

After understanding how the stochastic model worked, I then changed my goal to replicate Johnson's website by making a sentence-generator site of my own.

# ⌛ Development
The Markov chain is a probabilistic model that transitions through a sequence of events based on defined probabilistic rules. The probability of a future event is determined only by the current event, not on past events. Hence, the future is independent of all past events which is why it appears random. For simplicity, I will refer to "Markov chain" as <code>Markov</code>.

First, I used the Java programming language to help my <code>Markov</code> learning. I used a <code>HashMap</code> data structure to build a "dictionary" for the events and for efficient data retrieval. Each valid <code>String</code> event was mapped to a custom <code>Node</code> object, which contained information about its proceeding event(s).

To obtain the YouTube video titles, I built a simple data scrapper using the Python programming language and the <a href="https://developers.google.com/youtube/v3" target="_blank">YouTube Data API</a>. From all the information available per video, I extracted only the video title and then saved the final list in a text file for each YouTube channel.

# 📈 Early Ideation
The natural next step was to start migrating to a web-development-friendly language. After translating to JavaScript and some <code>console.log</code> testing, I achieved a small web demo! <i>Wait, you're telling me I can use anything as training data as long it's stored in a text file?</i>

My current favourite artist is Taylor Swift— someone who needs no further introduction. To add my own twist to this project, I saved all of her lyrics from her albums <i>reputation</i> and onwards. Credits to Reddit user <a href="https://www.reddit.com/r/TaylorSwift/comments/16eo7va/comment/k004j4n/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button" target="_blank">mountaingoatcheese</a> for capturing all the lyrics on publicly accessible Google Docs. After tinkering around with <code>regex</code>, the generater could now handle punctuation marks and brackets.

# 🔬 Testing
Testing primarily involved ensuring good performance (i.e. consistently generating results). Sometimes, results contained an incomplete set of brackets or quotation marks. And so, I added an extra step at the end to close or complete these leftover symbols.

About half the time, the generator produced results that made some sense and followed basic English grammar syntax. It was good enough, but there was massive room for improvement. And besides, I was not achieving consistent results like Johnson's site.

At first, I thought that I needed more data so it could "train" more. However, I realized that it did not matter because each event was only comprised of a valid one-<code>String</code> sequence. This definition of an event was too limited to produce anything with a high likelihood of making sense. I needed to somehow provide as much context as possible into each stored event.

# ⭐ Final Designs
Credits to this <a href="https://dev.to/bespoyasov/text-generation-with-markov-chains-in-javascript-i38" target="_blank">article</a> by Alex Bespoyasov for helping me understand what "tokens" are. Essentially, what I built so far was utilizing one token: an event corresponded to one valid <code>String</code>. By increasing the number of tokens, this would help provide more context for the chain generator.

I added a constant global variable called <code>NUM_TOKENS</code> &isin;&#x2115;. When <code>NUM_TOKENS = <i>n</i></code>, one event corresponds to a valid <i>n</i>-<code>String</code> sequence.

I decided to keep <code>NUM_TOKENS = 2</code>. For any value greater, the results were not random enough (i.e. too much context/not enough data) and we already know why 1 was subpar. Furthermore, I changed the way the program tracked the aforementioned incomplete symbols. Consequently, I was able to <code>regex</code> more paired typographical brackets (i.e. [], {}, <>).

Additionally, I added functionality to track capitalization. The <code>Node</code> object now includes an additional <code>boolean</code> field that acts as a flag for to indicate if the event should have its first letter capitalized. The final result at the end will also always have its first letter capitalized.

Lastly, I finalized the <code>HTML</code> and <code>CSS</code>... and voila, I had my webpage fully designed! Check it out <a href="https://nenceh.github.io/markov-chain/">here</a>!

# ❓ What I learned
I achieved my initial goal of learning about <code>Markov</code>!

Additionally, I learned about <code>regex lookbehind</code> and <code>lookahead</code>, and practiced more with <code>JavaScript</code> and <code>JQuery</code>. These were extremely helpful when extending the functionalities of my generator.

For example, let's examine: <code>var split = line.split(/(?<=["(){}<>[\],.!+=—])[\s]*|[\s]*(?=[ .,:;!?&+="()[\]{}<>—])+[\s]*/)</code>
<ul>
  <li>Look behind positive <code>?<=</code>: find any amount of white space characters <code>[\s]*</code> that is preceded by any of the symbols <code>["(){}<>[\],.!+=—]</code>
    <ul>
      <li>Splits the line after each of the symbols</li>
    </ul>
  </li>
  <li>Look ahead positive <code>?=</code>: find any amount of white space characters <code>[\s]*</code> that is followed by one or more of any of the characters <code>[ .,:;!?&+="()[\]{}<>—]+</code> that has any amount of white space characters <code>[\s]*</code> after them
    <ul>
      <li>Splits the line before each of the symbols</li>
      <li>Removes white space characters that may occur after any of the symbols</li>
    </ul>
  </li>
</ul>

# 💭 Next steps
This version is the base implementation I am satisfied and happy with!

Looking ahead (ha!), I would like to incorporate more English grammar rules and additional text syntax, like retaining full capitalization and managing any dots/periods for acronyms and abbreviations.
