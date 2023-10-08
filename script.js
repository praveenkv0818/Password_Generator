const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+-={}[]:"|;?,.</>';

let password = "";
let passwordLength = 10;
let checkcount = 0;
uppercaseCheck.checked = true;
setIndicator("#ccc");
handleSlider();


// set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
        ((passwordLength - min) * 100) / (max - min) + "% 100%";

}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndNumber() {
    return getRndInteger(0, 9);
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const symbolArr = Array.from(symbols);
    const randIndx = getRndInteger(0, symbolArr.length);
    return symbolArr[randIndx];
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"
    }
    catch (e) {
        copyMsg.innerText = "Failed"
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}



inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});



generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected 
    if (checkcount <= 0)
        return;

    if (passwordLength < checkcount) {
        passwordLength = checkcount;
        handleSlider();
    }

    // let's find new password
    if (password.length)
        password = "";

    // let put stuff mention by checkBox

    // if(uppercaseCheck.checked) {
    //     password+= generateUppercase();
    // }

    // if(lowercaseCheckcaseCheck.checked) {
    //     password+= generatelowercase();
    // }

    // if(numberCheckCheck.checked) {
    //     password+= generateRndNumber();
    // }

    // if(uppercaseCheck.checked) {
    //     password+= generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if (numberCheck.checked)
        funcArr.push(generateRndNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulary addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaing addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();

});

function handleCheckboxChange() {
    checkcount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkcount++;
    });

    // special condition
    if (passwordLength < checkcount) {
        passwordLength = checkcount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) 
        copyContent();
});