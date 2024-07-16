const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolcheck=document.querySelector("#symbol");
const indicator=document.querySelector("[data-indicator]");

const generation=document.querySelector(".generate-buttton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set strength circle colo to grey
setIndicator("#ccc");

// set password leneth 
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min =inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=( (passwordLength - min)*100/(max - min)) + "% 100%"

}


function setIndicator(color){
    indicator.style.backgroundColor=color;
    // shadow
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
     return Math.floor(Math.random()*(max-min))+min;
}


function generateRandomNUmber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const ranNum=getRndInteger(0, symbols.length);
    return symbols.charAt(ranNum);
}

function calcStrength() {
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolcheck.checked) hasSym=true;

    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength>=8)
    {
        setIndicator("#0f0");
    }else if((hasLower||hasUpper) && (hasNum|| hasSym) && passwordLength>=6)
    {
        setIndicator("#ff0");
    }else
    {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    } catch(e){
        copyMsg.innerText="failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() =>{
        copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array){
    // Fisher-Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
        
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input' ,(e) => {
    passwordLength = e.target.value;
    handleSlider(); 
});

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

generation.addEventListener('click',()=>{
    //NONE of the checkbox is selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //creating new password from the scratch 

    //remove old password 
    password="";

    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(numberCheck.checked){
        funcArr.push(generateRandomNUmber);
    }

    if(symbolcheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    funcArr.forEach(func => {
        password += func();
    });

    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password+=funcArr[randIndex]();
    }

    // console.log("remaining addition done");
    //shuffle the password 
    password=shufflePassword(Array.from(password));

    // console.log("shuffling done addition done");

    // show in UI
    passwordDisplay.value=password;

    // calcStrength
    calcStrength();
});