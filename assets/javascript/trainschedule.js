var database = null;
var trainScheduleArray = [];
var trainValue = 0;
var trainFrequency = 0;
var trainNextArrival = "";
var trainMinutesAway = 0;
var trainIntervalId = "";

$(document).ready(function () {
    database = initializeDataBase();
    getTrainInfoFromDatabase();
    addTrainInfoEventListner();
    updateTrainInfoEventListner();
    getTrainToUpdateListner();
    getTrainToDeleteListner();
    deleteTrainInfoEventListner()
});

function initializeDataBase() {
    var config = {
        apiKey: "AIzaSyC-nwEFCBq5VDl7VPIPrBjGHP_qBIWAB2g",
        authDomain: "trainschedule-smj.firebaseapp.com",
        databaseURL: "https://trainschedule-smj.firebaseio.com",
        projectId: "trainschedule-smj",
        storageBucket: "trainschedule-smj.appspot.com",
        messagingSenderId: "210491863088"
    };
    firebase.initializeApp(config);
    return firebase.database();
}


function addTrainInfoEventListner() {
    $("#add-train").on("click", function (event) {
        event.preventDefault();
        stopTrainTimer();

        trainFrequency = $("#frequency-input").val();
        calculateMinutesAway_NextTime();

        var train = {};
        train.trainName = $("#train-name-input").val().trim();
        train.destination = $("#destination-input").val().trim();
        train.firstTrainTime = $("#first-train-time-input").val().trim();
        train.frequency = $("#frequency-input").val().trim();
        train.nextArrival = trainNextArrival;
        train.minutesAway = trainMinutesAway;
        train.dateAdded = firebase.database.ServerValue.TIMESTAMP;

        var validateTrain = validateData(train);
        if (validateTrain) {
            addTrainIntoDatabase(train);
        }
    });
}

function updateTrainInfoEventListner() {
    $("#update-train").on("click", function (event) {
        event.preventDefault();
        stopTrainTimer();

        var train = {};
        train.trainName = trainScheduleArray[trainValue - 1].trainName;
        train.destination = $("#destination-update").val();
        train.firstTrainTime = $("#first-train-time-update").val();
        train.frequency = $("#frequency-update").val()

        calculateMinutesAway_NextTime();
        train.nextArrival = trainNextArrival;
        train.minutesAway = trainMinutesAway;
        train.dateAdded = firebase.database.ServerValue.TIMESTAMP;

        var validateTrain = validateUpdateData(train);
        if (validateTrain) {
            updateTrainIntoDatabase(train);
        }
    });
}

function deleteTrainInfoEventListner() {
    $("#delete-train").on("click", function (event) {
        event.preventDefault();
        stopTrainTimer();
        var key = trainScheduleArray[trainValue - 1].databaseKey;
        database.ref().child(key).remove();
    });
    clearDeleteForm();
}

function getTrainToUpdateListner() {
    $("body").on("change", "#trainSelect", function () {
        trainValue = document.getElementById("trainSelect").value;
        var train = trainScheduleArray[trainValue - 1];
        $("#destination-update").val(trainScheduleArray[trainValue - 1].destination);
        $("#first-train-time-update").val(trainScheduleArray[trainValue - 1].firstTrainTime);
        $("#frequency-update").val(trainScheduleArray[trainValue - 1].frequency);
    });
}

function getTrainToDeleteListner() {
    $("body").on("change", "#trainDelete", function () {
        trainValue = document.getElementById("trainDelete").value;
        var train = trainScheduleArray[trainValue - 1];
        $("#destination").val(trainScheduleArray[trainValue - 1].destination);
        $("#first-train-time").val(trainScheduleArray[trainValue - 1].firstTrainTime);
        $("#frequency").val(trainScheduleArray[trainValue - 1].frequency);
    });
}

function addTrainIntoDatabase(train) {
    database.ref().push({
        train: train
    });
    clearAddForm();
}

function updateTrainIntoDatabase(train) {
    var key = trainScheduleArray[trainValue - 1].databaseKey;
    database.ref().child(key).update({
        train: train
    });
    clearUpdteForm();
}

function addTrainRows(train) {
    var trTrain = $("<tr>")
    var newtd = [];

    var tdTrainName = $("<td>");
    tdTrainName.text(train.trainName);
    trTrain.append(tdTrainName);

    var tdDestination = $("<td>");
    tdDestination.text(train.destination);
    trTrain.append(tdDestination);

    var tdFrequency = $("<td>");
    tdFrequency.text(train.frequency);
    trTrain.append(tdFrequency);

    trainFrequency = train.frequency;
    calculateMinutesAway_NextTime();

    var tdNextArrival = $("<td>");
    tdNextArrival.text(trainNextArrival);
    trTrain.append(tdNextArrival);

    var tdMinutesAway = $("<td>");
    tdMinutesAway.text(trainMinutesAway);
    trTrain.append(tdMinutesAway);

    $("tbody").append(trTrain);
}

function clearAddForm() {
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
    showError(true, true, true, true, true);
}

function clearUpdteForm() {
    $("#destination-update").val("");
    $("#first-train-time-update").val("");
    $("#frequency-update").val("");
    showUpdateError(true, true, true, true);
}

function clearDeleteForm() {
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
}

function validateData(itrain) {
    var trainNameValid = true;
    var destinationValid = true;
    var firstTrainTimeValid = true;
    var frequencyValid = true;
    if (!validateTrainName(itrain.trainName) || !validateDestination(itrain.destination) || !validateTrainFirstTime(itrain.firstTrainTime) || !validateFrenquency(itrain.frequency)) {
        if (!validateTrainName(itrain.trainName)) {
           trainNameValid = false;
        }
        if (!validateDestination(itrain.destination)) {
            destinationValid = false;
        }
        if (!validateTrainFirstTime(itrain.firstTrainTime)) {
            firstTrainTimeValid = false;
        }
        if (!validateFrenquency(itrain.frequency)) {
            frequencyValid = false;
        }
        showError(false, trainNameValid, destinationValid, firstTrainTimeValid, frequencyValid);
        return false;
    }
    return true;
}

function validateUpdateData(itrain) {
    var destinationValid = true;
    var firstTrainTimeValid = true;
    var frequencyValid = true;
    if (!validateDestination(itrain.destination) || !validateTrainFirstTime(itrain.firstTrainTime) || !validateFrenquency(itrain.frequency)) {
       if (!validateDestination(itrain.destination)) {
            destinationValid = false;
        }
        if (!validateTrainFirstTime(itrain.firstTrainTime)) {
            firstTrainTimeValid = false;
        }
        if (!validateFrenquency(itrain.frequency)) {
            frequencyValid = false;
        }
        showUpdateError(false, destinationValid, firstTrainTimeValid, frequencyValid);
        return false;
    }
    return true;
}

function showError(clearErrorInput, validateTrainNm, validateDest, validateFirstTm, validateFreq) {
    var trainNameError = $("#train-name-error");
    var trainDestError = $("#destination-error");
    var trainFirstTmError = $("#first-train-time-error");
    var trainFreqError = $("#frequency-error");

    if (clearErrorInput) {
        trainNameError.text("");
        trainDestError.text("");
        trainFirstTmError.text("");
        trainFreqError.text("");
    }
    if (!validateTrainNm) {
        trainNameError.text("Blank Train Name not allowed and name should be unique, i.e. Not displayed in table")
    }
    if (!validateDest) {
        trainDestError.text("Destination canot be blank, Please enter Destination")
    }
    if (!validateFirstTm) {
        trainFirstTmError.text("Plesae enter military time")
    }
    if (!validateFreq) {
        trainFreqError.text("Please enter number only")
    }
}

function showUpdateError(clearErrorInput, validateDest, validateFirstTm, validateFreq) {
    var trainDestError = $("#destination-update-error");
    var trainFirstTmError = $("#first-train-time-update-error");
    var trainFreqError = $("#frequency_update-error");

    if (clearErrorInput) {
        trainDestError.text("");
        trainFirstTmError.text("");
        trainFreqError.text("");
    }

    if (!validateDest) {
        trainDestError.text("Destination canot be blank, Please enter Destination")
    }
    if (!validateFirstTm) {
        trainFirstTmError.text("Plesae enter military time")
    }
    if (!validateFreq) {
        trainFreqError.text("Please enter number only")
    }
}

function validateTrainName(trainName) {
    if (trainName.trim() === "") {
        return false;
    }
    for (var i = 0; i < trainScheduleArray.length; i++) {
        if (trainName === trainScheduleArray[i].trainName) {
            return false;
        }
    }
    return true;
}

function validateDestination(destination) {
    if (destination.trim() === "") {
        return false;
    }
    return true;
}

function validateTrainFirstTime(firstTrainTime) {
    return moment(firstTrainTime, 'HH:mm', true).isValid();

}

function validateFrenquency(frequency) {
    return (Number.isInteger(parseInt(frequency)));
}

function getTrainInfoFromDatabase() {
    database.ref().on("value", function (snapshot) {
        trainScheduleArray = [];
        if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
                var train = snapshot.val()[key].train;
                train.databaseKey = key;
                trainScheduleArray.push(train);
            });
        }
        displayTrainScheduleTable();
      
    }, function (errorObject) {
        console.log("The read failed: " + errorObject);
    });
}

function createTrainSelect() {
    trainOptions = [];
    trainOptions[0] = $("<option>");
    trainOptions[0].attr("value", 0);
    trainOptions[0].text("Select Train");
    var trainSelect = $("<select>");
    trainSelect.attr("id", "trainSelect");
    trainSelect.append(trainOptions[0]);
    for (var i = 1; i <= trainScheduleArray.length; i++) {
        var trainName = trainScheduleArray[i - 1].trainName;
        trainOptions[i] = $("<option>");
        trainOptions[i].attr("value", i);
        trainOptions[i].text(trainName);
        trainSelect.append(trainOptions[i]);
    }
    return trainSelect;
}

function createTrainDelete() {
    trainOptions = [];
    trainOptions[0] = $("<option>");
    trainOptions[0].attr("value", 0);
    trainOptions[0].text("Select Train");
    var trainSelect = $("<select>");
    trainSelect.attr("id", "trainDelete");
    trainSelect.append(trainOptions[0]);
    for (var i = 1; i <= trainScheduleArray.length; i++) {
        var trainName = trainScheduleArray[i - 1].trainName;

        trainOptions[i] = $("<option>");
        trainOptions[i].attr("value", i);
        trainOptions[i].text(trainName);
        trainSelect.append(trainOptions[i]);

    }
    return trainSelect;
}

function displayTrainScheduleTable() {
    var tableBody = $("#trainTbody");
    tableBody.empty();
    $("#train-select").empty();
    $("#train-delete").empty();
    $("#train-select").append(createTrainSelect());
    $("#train-delete").append(createTrainDelete());

    trainScheduleArray.forEach(function (train) {
        tableBody.append(addTrainRows(train));

    });
    setTrainTimer();
}

function resetTrainScheduleTable() {
    var tableBody = $("#trainTbody");
    tableBody.empty();
    trainScheduleArray.forEach(function (train) {
        tableBody.append(addTrainRows(train));
    });
}

function calculateMinutesAway_NextTime() {
    var currentDate = new Date();
    var currrentMin = currentDate.getMinutes();
    var diff = currrentMin % trainFrequency;
    trainMinutesAway = trainFrequency - diff;
    trainNextArrival = moment().add(trainMinutesAway, 'minutes').format('hh:mm A');
    //console.log("currrentMin :" + currrentMin +
    //    " diff :" + diff + " trainMinutesAway :" + trainMinutesAway + " trainNextArrival :" + trainNextArrival);
}

function setTrainTimer() {
    trainIntervalId = setInterval(decrementTrainTimer, 60000);
    function decrementTrainTimer() {
        resetTrainScheduleTable();
    }
};

function stopTrainTimer() {
    clearInterval(trainIntervalId);
};



