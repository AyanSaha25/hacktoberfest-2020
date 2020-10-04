window.onload=()=>{
    document.querySelector('.inner').style.backgroundColor="white";
    document.querySelector('textarea').style.color="darkslategray";

    var textArea = document.querySelector('textarea');
    var letterCount = document.querySelector('#letter-count');
    var wordCount = document.querySelector('#word-count');
    var sentenceCount = document.querySelector('#sentence-count');
    var letters=0;var words=0;var sentences=0;var wPs=0;
    var current_size =  17;
    if(textArea.value!=''){
       
        analyseText(textArea.value);
    }
    textArea.onkeyup=()=>{
        //not empty
        if(textArea.value!=''){
            
        analyseText(textArea.value);
           
        }else{
            //setting to initial
            wordCount.innerText=0;
            letterCount.innerText=0;
            sentenceCount.innerText=0;
            document.querySelector('#wpl').innerText = 0;
        }
      
    }

    function analyseText(text){
       if(text==''){
                //setting to initial
                wordCount.innerText=0;
                letterCount.innerText=0;
                sentenceCount.innerText=0;
                document.querySelector('#wpl').innerText = 0;
                return;
        }
        letters=0;words=0;sentences=0;
        var wpl=0;
        var lines = text.split('\n');
        sentences = lines.length;
        sentenceCount.innerText = sentences;
        for(let i=0;i<lines.length;i++){
            var count_words = lines[i].split(' ');
            for(let m=0;m<count_words.length;m++){
                if(count_words[m].length>2){
                    words+=1;
                }
            }
            for(let j=0;j<count_words.length;j++){
                letters+=count_words[j].length;
                
            }
            console.log(count_words);
            
        }
        letterCount.innerText = letters;
        wordCount.innerText = words;
        wpl = Math.round(words/sentences);
        document.querySelector('#wpl').innerText = wpl;
    }

    function clear(){
    textArea.value='';
    analyseText('');
     
    }
    function redo(){
      analyseText(textArea.value);
       
    }
    function copy(){
    

        textArea.select();
        document.execCommand('copy');
       
        document.querySelector('.tooltip-text.copy').innerText = 'Copied';
        setTimeout((e)=>{
            document.querySelector('.tooltip-text.copy').innerText = 'Copy text';

        },2000);
    }

    document.addEventListener('click', (e)=>{
        if(e.target.matches('.copy-btn')){copy();
            
        }
        if(e.target.matches('.redo-btn')){redo();
        
        }
        if(e.target.matches('.clear-btn')){
            clear();
          
        }
        if(e.target.matches('#bold-text')){
            textArea.style.fontWeight=(textArea.style.fontWeight=="bold")?"normal":"bold";
            document.querySelector('#bold-text').style.color=(textArea.style.fontWeight=="bold")?"black":"gray";

        }
        if(e.target.matches('#plus-size')){
            current_size+=2;
            textArea.style.fontSize=current_size+'px';
        }
        if(e.target.matches('#minus-size')){
            current_size-=2;
            textArea.style.fontSize=current_size+'px';
          
        }
        if(e.target.matches('#theme')){
            var inner = document.querySelector('.inner').style.backgroundColor;
            var inner_= document.querySelector('textarea').style.color;
            console.log(inner,inner_);
            document.querySelector('.inner').style.backgroundColor=(inner=='white')?'darkslategray':'white';
            document.querySelector('textarea').style.color=(inner_=="darkslategray")?"white":"darkslategray";
            
        }
    });

}