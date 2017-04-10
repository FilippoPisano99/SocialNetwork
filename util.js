var UserUid;
var UserEmail;
var UserNickname;
var UserAvatar;

var userRegisted=false;
var logged = false;

var SignIn;


function bootstrap() {
	var config = {
		apiKey: "AIzaSyCsmSUrEqdDCbOLdsqcD_nk2pwj-F5TYWI",
		authDomain: "js-fire3.firebaseapp.com",
		databaseURL: "https://js-fire3.firebaseio.com",
		projectId: "js-fire3",
		storageBucket: "js-fire3.appspot.com",
		messagingSenderId: "719144854851"
	};
	firebase.initializeApp(config);
}

function logIn(em,pwd) {
	UserEmail = em;
	firebase.auth().signInWithEmailAndPassword(em,pwd).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorCode +"\n\t" + errorMessage);
		alert(errorCode +"\n\t" + errorMessage);
	});
}

function signIn(name,avatar,em,pwd) {
	
	var err = false;
	firebase.auth().createUserWithEmailAndPassword(em, pwd).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorCode +"\n\t" + errorMessage);
		err = true;
	});

	if(!err)
	{
		userRegisted = true;

		SignIn = new SignObj(name,avatar,em);
	}
}

function ListenPublicUpdates() {
	
	firebase.database().ref("public").on("value",function(snapshot) {
		console.log("snapshot:");
		console.log(snapshot.val());
		var publicWall = snapshot.val();
			$("#PostWall").empty();
			//console.log(publicWall);

		for(element in publicWall)
		{
			firebase.database().ref('public/' + element).once('value').then(function(s) {
		
				time = s.val().time;
				date = new Date(parseInt(time));
				//console.dir(date);

				addPostToWall(s.val().email , s.val().textPost,date,s.val().avatar,s.val().Nickname);

			});
		}

	});
	
}

function addPostToWall(em,text,postDate,avatar,nome) 
{
	var timeHourMinSec = postDate.toTimeString().substr(0,postDate.toTimeString().indexOf(" "));
	$("#PostWall").prepend("<div class='post'> "+
		"<div class='PostUserInfo'>"+
			"<img src='"+avatar+"'>"+
			"<h3>"+nome +"</h3> "+
			//"<p>"+em + "</p> "+
		"</div>"+
		//"<br>"+
		"<p class='TextPost'>" + text + "</p>"+
		"<p class='TimePost'>"+ postDate.toLocaleDateString()+ " " + timeHourMinSec + "</p>"+
		" </div>");
}

function initInfoUser(uid)
{
	firebase.database().ref("users/"+uid).on("value",function(snapshot) {
		
		var CurrUser = snapshot.val();
		UserUid = uid;
		UserEmail = CurrUser.Email;
		UserAvatar = CurrUser.Avatar;
		UserNickname = CurrUser.Nickname;
		console.log("#"+UserAvatar+"#");
		$("#Avatar").attr("src",UserAvatar);
		$("#UserDivName").text(UserNickname);

	});
}