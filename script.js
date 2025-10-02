document.getElementById("quote-button").addEventListener("click", fetchQuote);
async function fetchQuote() {
    try{
        document.getElementById("quote").textContent="Loading....";
        document.getElementById("author").textContent=""
        const response= await fetch("https://dummyjson.com/quotes/random");
        if(!response.ok)throw new Error(`HTTP error! Status:${response.status}`);
        const data= await response.json();
        if(!data.quote || !data.author){
            throw new Error ("Invalid API response")
        }
        document.getElementById("quote").textContent=`${data.quote}`;
        document.getElementById("author").textContent=`_${data.author}`;
    } catch(error){
        console.error("Error  fetching quote:", error);
        document.getElementById("quote").textContent="Oops, something went wrong!";
        document.getElementById("author").textContent="";
    }   
};

document.getElementById("save-button").addEventListener("click", ()=>{
    const quote=document.getElementById("quote").textContent;
    const author=document.getElementById("author").textContent;
    if(quote==="Loading..."|| quote==="Oops, something went wrong!"|| !author){
        alert("Please fetch a valid quote first!");
        return;
    }
    const savedQuotes=JSON.parse(localStorage.getItem("quotes")||"[]");
    savedQuotes.push({quote,author});
    localStorage.setItem("quotes", JSON.stringify(savedQuotes));
    alert("Quote Saved!");
});

document.getElementById("show-saved-button").addEventListener("click",()=>{
    const savedQuotesDiv=document.getElementById("saved-quotes");
    const savedQuotes=JSON.parse(localStorage.getItem("quotes")||"[]");
    if (savedQuotes.length===0){
        savedQuotesDiv.textContent="No saved quotes yet!";
        savedQuotesDiv.style.display="block";
        return;
    }
    savedQuotesDiv.innerHTML="";
    const ul=document.createElement("ul");
    ul.style.listStyle="none";
    ul.style.padding="0";
    savedQuotes.forEach(item=> {
        const li=document.createElement("li");
        li.innerHTML=`<p>"${item.quote}"</p><p>- ${item.author}</p>`;
        li.style.marginBottom="10px";
        ul.appendChild(li);
    });
    savedQuotesDiv.appendChild(ul);
    savedQuotesDiv.style.display="block"
});

const change=document.getElementById("quote-button");
change.onclick=function(){
    document.body.style.backgroundColor=`#${Math.floor(Math.random()*16777215).toString(16)}`
};