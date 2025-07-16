let xmlhttp = new XMLHttpRequest();
let cardsOnPage = document.querySelectorAll('.card img');
let result = document.getElementById('result');
let allBoxes = document.getElementById('checkboxes');
let amountDisplay = document.getElementById('amount');
let betDisplay = document.getElementById('bet');
let betAmount = document.getElementById('betAmount');
let changeButton = document.getElementById('changeButton');
let play = document.getElementById('play');
let makeBet = document.getElementById('makeBet');
let dd = document.getElementById('dd');
let boxes = allBoxes.getElementsByTagName('input');
let amount = 100;
let bet = 0;
let prize = 0;
let updatedAmount = 0;
let thisUser = 1;
let url = "stack.json";
let informational = document.getElementById('informational');
//Load cards from xmlhttp

xmlhttp.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {

        let array = JSON.parse(xmlhttp.responseText);
        firstSetup(array);
    }
}
xmlhttp.open("GET", "stack.json", true);
xmlhttp.send();

let playingCards = document.querySelector('hand');
let playArray = [];
let restOfDeck = [];
let changedOfDec = [];
let idChanged = [];
let arrayChanged = [];
let values = [];
let marks = [];
let counterChage = 0;
let fp;


// First setup Function accept array from XML.
function firstSetup(array) {

    //show amount from localstorage
    play.disabled = true;
    changeButton.disabled = true;
    informational.textContent = "Please enter amount of bet first.";
    fp = localStorage.getItem(thisUser, amount);
    amountDisplay.textContent = fp;


    for (let i = 0; i < 5; i++) {



        //Choose random elements from array.
        let random = array.cards[Math.floor(Math.random() * array.cards.length)];
        //splice that element from main array  getting index of random
        let index = array.cards.indexOf(random);
        array.cards.splice(index, 1);

        playArray.push(random);

    }

    restOfDeck = array.cards;


    cardDisplay(playArray);

    //Current hand of cards

    function cardDisplay(playArray) {

        j = -1;

        for (let i = 0; i < cardsOnPage.length; i++) {
            j++;

            cardsOnPage[i].src = playArray[j]['src'];

        }

    }


    // Change button
    changeButton.onclick = function () {

        counterChage++;

        //Increase counter change if more than 2 don't allow it
        if (counterChage <= 2) {

            //getting all boxes and collection .checked

            for (let b = 0; b < boxes.length; b++) {

                if (boxes[b].checked) {

                    //Get value of checked box (0 - 4)

                    let changedCard = boxes[b].value;
                    let realData = playArray[changedCard];
                    //get data to array for changed card
                    arrayChanged.push(realData);
                    //get id of data in second array 
                    idChanged.push(changedCard);

                }
            }


            restCards(restOfDeck, arrayChanged);

            cardChange(idChanged, playArray, changedOfDec);


        }
    }

    // Rest of deck after first setup. 
    function restCards(restOfDeck, arrayChanged) {


        for (let ac = 0; ac < arrayChanged.length; ac++) {

            let randomRestOfDeck = restOfDeck[Math.floor(Math.random() * restOfDeck.length)];
            changedOfDec.push(randomRestOfDeck);
            let index = restOfDeck.indexOf(randomRestOfDeck);
            restOfDeck.splice(index, 1);
        }

    }

    function cardChange(idChanged, playArray, changedOfDec) {

        u = -1;
        idChanged.forEach(id => {
            u++;

            playArray.splice(id, 1, changedOfDec[u]);


            cardsOnPage[id].src = changedOfDec[u]['src'];

        });

    }

    // Button for making a bet 

    makeBet.onclick = function () {

        makeBet.disabled = true;
        changeButton.disabled = false;
        informational.textContent = " ";

        let o = betAmount.value;

        if (o > amount) {

            informational.textContent = 'You dont have that much money.';

        } else {

            updatedAmount = fp - o;
            betDisplay.textContent = o;
            bet = o;
            amountDisplay.textContent = updatedAmount;
            play.disabled = false;
        }

    }

    // Trigger function for Play function

    play.onclick = function () {

        makeBet.disabled = true;
        play.disabled = true;
        //Getting data and make sort of function. 
        let values = [];
        let marks = [];
        playArray.forEach(uu => {
            // getting for each mark and value extracted 
            marks.push(uu['mark']);
            values.push(uu['value']);
        });

        let b = [],
            prev;

        values.sort();

        for (var i = 0; i < values.length; i++) {
            if (values[i] !== prev) {

                b.push(1);
            } else {
                b[b.length - 1]++;
            }
            prev = values[i];
        }

        // Count number of pairs in hand - if ct = 1 one pair, ct= 2 two pairs 
        let ct = 0;

        b.forEach(element => {

            if (element == 2) {

                ct++;
            }
            return ct;

        });
        //Check if it is Royal Flush

        if (isStraight(values) == true && issFlush(marks) == true) {


            result.textContent = 'Royal Flush';
            prize = bet * 25;
            calculateFunction(updatedAmount, prize);

        } else if (issFlush(marks) == true) {

            //Check if it is Flush

            result.textContent = 'Flush';
            prize = bet * 20;
            calculateFunction(updatedAmount, prize);


        } else if (isStraight(values) == true) {
            result.textContent = 'Straight ';
            prize = bet * 15;
            calculateFunction(updatedAmount, prize);

        } else {

            if (b.includes(2) && b.includes(3)) {

                result.textContent = 'Full House ';
                prize = bet * 12;
                calculateFunction(updatedAmount, prize);

            } else if (b.includes(4)) {

                result.textContent = 'Four Of Kind ';
                prize = bet * 10;
                calculateFunction(updatedAmount, prize);


            } else if (b.includes(3)) {

                result.textContent = 'Three Of Kind ';
                prize = bet * 5;
                calculateFunction(updatedAmount, prize);

            } else if (ct == 2) {

                result.textContent = 'Two Pairs';
                prize = bet * 4;
                calculateFunction(updatedAmount, prize);


            } else if (ct == 1) {

                result.textContent = 'Pair';
                prize = bet * 2;
                calculateFunction(updatedAmount, prize);

            } else {

                result.textContent = 'High Card';
                updatedAmount = amount - bet;
                highCard(updatedAmount);

            }

        }
    }


    /*Logic for Straight - get lowest sorted item and and add on it 5 numbers, 
    placing in new row  builtArray[]. If both of them match you have Straight. 
    */

    function isStraight(values) {

        let builtArray = [];
        let additionalArray = [2, 3, 4, 5, 11];
        let vr = values.sort(sortNumber);



        let tracker = vr[0] - 1;



        for (let h = 0; h < 5; h++) {

            tracker++;

            builtArray.push(tracker);

        }



        let arr1 = JSON.stringify(builtArray);
        let arr2 = JSON.stringify(vr);
        let arr3 = JSON.stringify(additionalArray);


        if (arr2 == arr3) {

            return true;


        } else if (arr1 == arr2) {

            return true;


        } else {
            return false;
        }

    }

    //Function for Flush

    function issFlush(marks) {


        
        let b = [],
            prev;

        marks.sort();

        for (let i = 0; i < marks.length; i++) {

            if (marks[i] !== prev) {

                b.push(1);
            } else {
                b[b.length - 1]++;
            }
            prev = marks[i];
        
            
        }



        if (b[0] == 5) {

            return true;
        } else {
            return false;
        }


    }
    //Calculate amount won and add on the existing amount. All data saved in localstorage 
    function calculateFunction(fp, prize) {

        updatedAmount = fp + prize;
        amountDisplay.textContent = updatedAmount;
        amount = updatedAmount;
        localStorage.setItem(thisUser, amount);

    }
    //Subst. high card amount on the existing amount. All data saved in localstorage 

    function highCard(updatedAmount) {

        amountDisplay.textContent = updatedAmount;
        amount = updatedAmount;
        localStorage.setItem(thisUser, amount);


    }

    //Sort numbers asc. 

    function sortNumber(a, b) {

        return a - b;
    }

}