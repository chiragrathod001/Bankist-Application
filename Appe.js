
'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Chirag Rathod',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-12-01T13:15:33.035Z',
    '2021-12-02T09:48:16.867Z',
    '2021-11-25T06:04:23.907Z',
    '2021-11-20T14:18:46.235Z',
    '2021-11-22T16:33:06.386Z',
    '2021-11-10T14:43:26.374Z',
    '2021-12-02T18:49:59.371Z',
    '2021-11-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'hu-HU', // de-DE
};

const account2 = {
  owner: 'Darshak Rathod',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2020-12-01T13:15:33.035Z',
    '2020-12-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2021-11-25T14:18:46.235Z',
    '2021-11-05T16:33:06.386Z',
    '2021-12-10T14:43:26.374Z',
    '2021-11-25T18:49:59.371Z',
    '2021-11-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



///////////////////////////////////////////////////////////////////////////////////////////////
/////// All Functions

const formatcur = function (value, locale, currency) {

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}
const formatingDate = function (date, locale) {

  const calcDatepass = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayspassed = calcDatepass(new Date(), date);

  if (dayspassed === 0) return 'Today';
  if (dayspassed === 1) return 'Yesterday';
  if (dayspassed < 7) return `${dayspassed} Day ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const Year = date.getFullYear();

    // return `${day}/${month}/${Year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }


}
const displaymovements = function (acc, sort = false) {
  const moves = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  containerMovements.innerHTML = '';




  moves.forEach((mov, i) => {
    const nows = new Date(acc.movementsDates[i]);
    const movementsDate = formatingDate(nows, acc.locale)



    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
            <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__date">${movementsDate}</div>
            <div class="movements__value">${formatcur(mov, acc.locale, acc.currency)}</div>
            </div>` ;

    // containerMovements.insertAdjacentHTML('beforeend',html);// asd
    containerMovements.insertAdjacentHTML('afterbegin', html); //desd
  });

}

// Calc and display balance
const calcbalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatcur(acc.balance, acc.locale, acc.currency)}`;
};


// Create For A User id
const createusername = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
}
createusername(accounts);

//create function for income
const displaysummary = (acc) => {
  let income = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)

  labelSumIn.textContent = `${formatcur(income, acc.locale, acc.currency)}`;

  let out = acc.movements.filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)

  labelSumOut.textContent = `${formatcur(Math.abs(out.toFixed(2)), acc.locale, acc.currency)}`


  let interests = acc.movements.filter(mov => mov > 0)
    .map(deposit => deposit * 0.012)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov)

  labelSumInterest.textContent = `${formatcur(Math.trunc(Math.abs(interests.toFixed(2))), acc.locale, acc.currency)}`
};

let currenaccount, timer;

const updateui = function (acc) {
  //dispaly movements
  displaymovements(acc);

  //display balance
  calcbalance(acc);

  //display summary
  displaysummary(acc);
};


////////////////  FAKE LOGGED IN  ////////////////////
//
currenaccount = account1;                           //
updateui(currenaccount)                             //
containerApp.style.opacity = 100;                  //
//
//
/////////////////////////////////////////////////////

const settimeoutlogout = function () {
  const tick = function () {
    const mini = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${mini}:${sec}`;

    //display new page
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get Strated';
      containerApp.style.opacity = 0;
    }

    //decrise by 1
    time = time - 1;
  };
  //set time 5 minute
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

btnLogin.addEventListener('click', function (e) {

  //stop fore submiting
  e.preventDefault()
  currenaccount = accounts.find(acc => acc.username === inputLoginUsername.value);


  if (currenaccount?.pin === Number(inputLoginPin.value)) {

    //dispaly wwelcome and UI
    labelWelcome.textContent = `Welcome Back,${currenaccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;


    // const now = new Date();
    // const day = `${now.getDay()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const Year = now.getFullYear();
    // const Hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${Year}, ${Hour}:${min}`;


    //craete current Date
    const now = new Date();
    const Opration = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekend: 'long',
    }
    // const locate = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(currenaccount.locale, Opration).format(now);


    //clear inputfiled
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    //set Logout Time
    if (timer) {
      clearInterval(timer);
    }
    timer = settimeoutlogout();
    //update UI
    updateui(currenaccount)
  };
});

//transfer event
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciveracc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (amount > 0 &&
    currenaccount.balance >= amount &&
    reciveracc.username !== currenaccount.username) {

    currenaccount.movements.push(-amount);
    reciveracc.movements.push(amount);


    //Display Curent Date
    currenaccount.movementsDates.push(new Date().toISOString());
    reciveracc.movementsDates.push(new Date().toISOString());


    updateui(currenaccount)
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();


    //reset timer
    clearInterval(timer);
    timer = settimeoutlogout();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (currenaccount.username === inputCloseUsername.value && currenaccount.pin === Number(inputClosePin.value)) {

    //clear value in inpute
    inputClosePin.value = inputCloseUsername.value = '';
    inputClosePin.blur();

    //create index
    const index = accounts.findIndex(acc => acc.username == currenaccount.username)

    //delete account
    accounts.splice(index, 1)

    //diseble ui
    containerApp.style.opacity = 0;



  }
});


//BTN LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();


  const amount = Math.floor(inputLoanAmount.value);


  if (amount > 0 && currenaccount.movements.some(mov => mov >= amount * 0.1)) {

    setTimeout(function () {   //add movement
      currenaccount.movements.push(amount);

      //Display current Date 
      currenaccount.movementsDates.push(new Date().toISOString());

      //Update ui
      updateui(currenaccount);

      //reset timer
      clearInterval(timer);
      timer = settimeoutlogout();

    }, 2500);

    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

//sort method
var shorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displaymovements(currenaccount.movements, !shorted);
  shorted = !shorted;
});












//***********//Prectice//***********//

labelBalance.addEventListener('click', () => {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, index) {
    if (index % 2 === 0) row.style.color = 'pink';
    if (index % 3 === 0) row.style.color = 'red';
  });
});

//BigInt
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 - 0);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(1231444535325678768747745745n);
console.log(BigInt(1231444535325678768747745745));

//Oprations
const huge = 1231444535325678768747745745n
const num = 44;
console.log(huge);


//Exceptions
console.log(22n < 21);
console.log(22n === 22);
console.log(typeof 22n);
console.log(22n == 22);

//DATES
const DATES = new Date()
console.log(DATES);
console.log(new Date('Thu Dec 02 2021'));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2044, 10, 19, 15, 33, 60));


const futer = new Date(2044, 10, 19, 15, 33, 60);
console.log(futer);
console.log(futer.getFullYear());  //return Year
console.log(futer.getMonth());    //return Month
console.log(futer.getDate());   //return Date
console.log(futer.getDay());    //return day
console.log(futer.getHours());  //return Hour
console.log(futer.getMinutes());    //return minites
console.log(futer.getSeconds());    //return Seconds
console.log(futer.toISOString());  //return national standed string
console.log(futer.toISOString());  //return time 
console.log(futer.getTime());
console.log(new Date(2363162640000));


const futers = new Date(2001, 1, 23, 12, 40);
console.log(+futers);

const nums = 23424532.56
const Opration = {
  style: 'currency',
  unit: 'celsius',
  currency: 'INR',
}
console.log('UK:  ', new Intl.NumberFormat('en-UK').format(nums));
console.log('US:  ', new Intl.NumberFormat('en-GB').format(nums));
console.log('GERMANE:  ', new Intl.NumberFormat('de-DE').format(nums));
console.log('Siriya:', new Intl.NumberFormat('ar-SY').format(nums));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, Opration).format(nums)
);

const ingredients = ['Tometo sous', 'Chees'];
const Pizzatimer = setTimeout((ing1, ing2) => console.log(`Hear is Your pizza with ${ing1} and ${ing2}`), 3000, ...ingredients);
if (ingredients.includes('chees'))
  clearTimeout(Pizzatimer);

// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 3000);