var currentDate = new Date();
console.log("current Date time :"+currentDate);
var timemin = currentDate.getMinutes();
var timeHR = currentDate.getHours();
var cTime = currentDate.getTime();
console.log("timemin :"+timemin +"timeHR :"+timeHR+" cTime: "+cTime);
var randomFormat = "HH:mm:ss";

var travelTime = moment().add(11, 'minutes').format('hh:mm A');

var convertedTime = moment(cTime).format(randomFormat);
console.log("convertedTime :"+convertedTime);
console.log("travelTime :"+travelTime);
var diff = timemin % 7;
var diff = timemin % 7;
var minutaway = 7-diff;
var newseconds = timemin+minutaway;
var nexttime =  moment().add(minutaway, 'minutes').format('hh:mm A');
console.log("diff :"+diff);
console.log("minutaway :"+minutaway);
console.log("newseconds :"+newseconds);
console.log("nexttime :"+nexttime);
//var militarytcurdatetime = moment(currentDate.getTime(), "HHmm").format("X");
     //var militarystrdatetime = moment("07:00 AM", "HH:mm:ss").format("X");
     //var diff = militarytcurdatetime - militarystrdatetime;
 
     //var totmin = 7*60;
 
 
     //console.log("militarytcurdatetime Date time :"+militarytcurdatetime);
     //console.log("militarystrdatetime Date time :"+militarystrdatetime);
     //console.log("diff:"+diff);
     //console.log("totmin:"+totmin);
     //var unixtdatetime = moment
     //var unixtdatetime = moment(currentDate.getTime(), "X");
     //console.log("unixtdatetime Date time :"+unixtdatetime);
 
     //var newtime = moment("07:15:00 AM", "h:mm:ss A").format("HH:mm:ss")
    // var newtimenix = moment("newtime","HH:mm:ss").format("x");
    // console.log("newtime :"+newtime);
    // console.log("newtime :"+newtimenix);

    var query = database.ref().orderByChild("train_name").equalTo("Trenton Express");
    console.log("query :"+query);
    query.on('value', function(snap) {
        var obj = snap.val();
        console.log("obj :"+obj);
        var snapRef = snap.ref();
        console.log("snapRef :"+snapRef);
        //snapRef.update({
        //  lat: 32.332325,
        //  long: 124.2352352
       // });
      });
      //  database.ref().orderByChild("train_name").equalTo("Teenton").on("child_added", function (snapshot) {
 
    // Firebase watcher + initial loader + order/limit HINT: .on("child_added"