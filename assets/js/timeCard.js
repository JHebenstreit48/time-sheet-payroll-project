//this script is for the time card page
let selectList = document.getElementById('companyList');
const clockButton = document.getElementById('toggle');
const hrCount = document.getElementById('hours');
const minCount = document.getElementById('minutes');
const secCount = document.getElementById('seconds')
let currentCompany;
let hr = 0, min = 0, sec = 0;
let countStart;

//reset the textcontent for the page
const cleanPage = () => {
    hr = 0, min = 0, sec = 0;
    
    hrCount.textContent = `${hr} HR`;
    minCount.textContent =  `${min} Min`;
    secCount.textContent = `${sec} Sec`;
    clockButton.textContent = 'Clock In';
}

//Build the elements and append it to the select list
const createOptionList = (userInfo) => {
    const option = document.createElement('option');
    option.textContent = userInfo.company;
    option.value = userInfo.company;
    selectList.appendChild(option)
}

//Add value to the select list
const selectListValue = () => {
    const userInfo = JSON.parse(localStorage.getItem('payInfo'));

    if (!userInfo) {
        // company.textContent = 'No Company Avaliable';
        const option = document.createElement('option');
        option.textContent = 'No Company Avaliable';
        option.value = 'No Company Avaliable';
        selectList.appendChild(option)
    }else {
        userInfo.forEach(createOptionList);
    }
}

//change event for the option list
selectList.addEventListener('change', function (event) {
    event.preventDefault();
    currentCompany = selectList.value;
});

//display the time and change the value
const timeChange = () => {
    if (sec === 60){
        if (min === 60){
            sec = 0
            min = 0;
            hr ++;
            hrCount.textContent = `${hr} HR`;
            minCount.textContent =  `${min} Min`;
            secCount.textContent = `${sec} Sec`;
        }else{
            sec = 0;
            min ++;
            hrCount.textContent = `${hr} HR`;
            minCount.textContent =  `${min} Min`;
            secCount.textContent = `${sec} Sec`;
        }
    }else{
        sec ++;
        hrCount.textContent = `${hr} HR`;
        minCount.textContent =  `${min} Min`;
        secCount.textContent = `${sec} Sec`;
    }
}

//Convert time into hour
const convertHRS = () => {
    if (min <= 15 && min >= 5){
        hr += 0.25;
    } else if (min <= 30 && min > 15){
        hr += 0.5;
    } else if (min <= 45 && min > 30){
        hr =+ 0.75;
    } else if (min <= 60 && min > 45){
        hr =+ 1;
    }
}

//Update the working hour to specific company
const updateWorkHour = () => {
    convertHRS();
    const existingData = JSON.parse(localStorage.getItem('payInfo'));
    for (let i = 0;  i < existingData.length; i++){
        if(existingData[i].company === currentCompany){
            existingData[i].workhour += hr;
            window.localStorage.setItem('payInfo',JSON.stringify(existingData))
        }
    }
}

//Clock In/Clock Out
clockButton.addEventListener('click', function() {
    if (clockButton.textContent === 'Clock In'){
        if (currentCompany === 'N/A'){
            showAlert('No company selected.\n Please go to input page to enter your company!');
            return;
        }else {
            clockButton.textContent = 'Clock Out'
            countStart = setInterval(() => {
                timeChange();
            }, 1000);
        }
    }else {
        showAlert(`You worked ${hr} HR ${min} Min ${sec} Sec. \n Good Job! Keep it up 💪`);
        clearInterval(countStart);
        updateWorkHour();
        cleanPage();
    }
})

const initial = () => {
    selectListValue();

    cleanPage();
    currentCompany = selectList.value;
}

//Call the function to create the content
initial();
