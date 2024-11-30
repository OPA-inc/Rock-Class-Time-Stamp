
// --- doc set up ---

// AUTHORIZE with Spotify (if needed)
// *************** REPLACE THESE VALUES! *************************
let client_id = 'a04eb273d28d4d9195294f6236545012';
// Use the following site to convert your regular url to the encoded version:
// https://www.url-encode-decode.com/
let redirect_uri = 'http://localhost:5500/callback'; // GitHub Pages URL or whatever your public url to this app is
// *************** END *************************


window.onload = function () {

	console.log("Hello World! - Setting up");

	addSongTable(null, true)


	document.querySelectorAll('.userInput').forEach((item) => { addAttributes(item) });

	new DataTable('table.display', {
		searching: false,
		paging: false,
		ordering: false,
		bInfo: false,
		order: [[1, 'asc']]
	})

	/*
	// Helper Function to Extract Access Token for URL
	const getUrlParameter = (sParam) => {
		let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
			sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
			sParameterName,
			i;
		let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
		sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
		}
	};

	// Get Access Token
	const accessToken = getUrlParameter('access_token');
	const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
	// Don't authorize if we have an access token already
	if (accessToken == null || accessToken == "" || accessToken == undefined) {
		window.location.replace(redirect);
	}



	$.ajax({
		url: `https://api.spotify.com/v1/me/player/currently-playing`,
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + accessToken
		},
		success: function (data) {
			console.log(data)
		}
	});
*/

	console.log("Hello World! - Set up is done");

}

function addAttributes(item) {

	item.required = true;
	item.setAttribute("onblur", `iiClassCheck(this)`);

	if (item.tagName == 'TEXTAREA') {
		item.addEventListener("input", countWord)
	}

	if (item.dataset.focusKey) {
		item.setAttribute("onfocus", `keyFocus(${item.dataset.focusKey})`);
		item.setAttribute("onblur", `keyUnfocus(${item.dataset.focusKey}) ; iiClassCheck(this);`);
		item.setAttribute("oninput", `this.style.height = ''; this.style.height = this.scrollHeight +'px'`);

	}

}

// --- Saving ---

function saveAll(inputs) {
	all_Inputs = $(inputs);

	//document.querySelectorAll('.userInput').forEach((item) => { addAttributes(item) });


	//all_Inputs.

	document.querySelectorAll('.userInput').forEach((item) => {

		if ($(item)[0].tagName == 'INPUT') {
			userInput = $(item)[0].value;

		} else if ($(item)[0].tagName == 'SELECT') {
			userInput = $(item)[0].options[$(item)[0].selectedIndex].text;

		} else {
			//add to input if?
			userInput = $(item)[0].value;

		}
		console.log(userInput);

		item_key = "list_" + $(item).parent().index();

		data = {
			title: item.dataset.name,
			content: userInput,
		};

		window.localStorage.setItem(item_key, JSON.stringify(data));
	});

	console.log("Saving done");
}


//not working 
/* try to work with this?

document.querySelectorAll('textarea').forEach((item) => {item.innerText = 'Foo'}) */
function loadAll(inputs) {
	all_Inputs = $(inputs);

	all_Inputs.each(function (index) {
		data = JSON.parse(window.localStorage.getItem("list_" + index));

		if (data !== null) {
			note_title = data.title;
			note_content = data.content;
			select_content = data.select;

			$(this).find("input").text(note_title);
			$(this).find("textarea").text(note_content);
			$(this).find("select").text(select_content);
		}
	})
	console.log("Loading done");
}

// --- Focus ---

function keyFocus(id) {
	id.style.fontSize = '1.5rem';
	id.style.width = '17rem';
	id.style.background = 'lightgrey';

	/* Top Bottom Right Left */
	id.style.padding = ' 0.55rem 2.25rem';
}

function keyUnfocus(id) {
	id.style.fontSize = '1rem';
	id.style.width = '15rem';
	id.style.background = 'grey';

	/* Top Bottom Right Left */
	id.style.padding = '0.3rem 2rem';
}

/* blur event for input fields */
function iiClassCheck(item) {
	if (item.checkValidity())
		item.classList.remove('invalidInput');
	else
		item.classList.add('invalidInput');
}


// --- Add Row ---

//find parent till table
// if you put in an id of a table it will be a table
function findTableParent(childOfTagID, targetTagName) {
	if (childOfTagID.id == null) {
		childOfTagID = $("#" + childOfTagID)
	}

	targetTagName = targetTagName.toUpperCase();
	while (childOfTagID.tagName != null && childOfTagID.tagName != targetTagName) {
		childOfTagID = childOfTagID.parentNode;
		console.log(childOfTagID);
	}
	parentOfTagID = childOfTagID;
	return parentOfTagID;
}



function addRow(tableID, firstTable = false) {

	tableID = findTableParent(tableID, 'TABLE');

	isFirst = ''
	if (firstTable) {
		isFirst = 'disabled'
	}

	//yeah working my way up the table only to work my way down if probly not good but at this point i just need it to work, YAY Tech Debt!
	$(tableID).find('tbody').append(`
	<tr>
	<td>
		<select name="userInputType" class="userInput" data-name="Type:">
			<option value="SigMo">Significant Moment</option>
			<option value="Change">Change</option>
			<option value="IntElk">Interesting Element</option>
		</select>
	</td>
	<td>
		<input type="text" class="userInput" placeholder="00:00" pattern="(\\d{1,2}[\\:\\.]){1,2}\\d{1,2}" data-focus-key="timeKey" style="width: 4rem;" data-name="Time Stamp:">
	</td>
	<td>
		<textarea class="userInput" data-focus-key="describeKey" data-name="Describe:"></textarea>
	</td>
	<td>
		<textarea class="userInput" data-focus-key="analyzeKey" data-name="Analyze:"></textarea>
	</td>
	<td>
		<textarea class="userInput" data-focus-key="explainKey" data-name="Explain:"></textarea>
	</td>
	<td>
		<textarea class="userInput" data-focus-key="discussKey" data-name="Discuss:"></textarea>
	</td>
	<td>
		<input type="button" class="button-add" onclick="addRow(this)" value="+">
		</td><td>
		<input type="button" class="button-add" onclick="deleteMyRow(this)" value="-" ${isFirst}>
	</td>
	</tr>
	`);



	document.querySelectorAll('.userInput').forEach((item) => { addAttributes(item) });



}

function deleteMyRow(r) {
	var i = findTableParent(r, 'TR').rowIndex;

	//if last one deleteTable
	if (i == 1) {
		deleteMyTable(r)
	} else {
		findTableParent(r, 'table').deleteRow(i);
	}


}

function deleteMyTable(r) {
	// see if it can be removed
	//findTableParent(r,'DIV').dataset.removable
	findTableParent(r, 'DIV').remove();
}



// Add table
tableIDIndex = 1;

function addSongTable(tableID, firstTable = false) {

	if (tableID == null) {
		tableID = "tableID" + tableIDIndex
		tableIDIndex++
	}

	removeable = true
	isFirst = ''

	if (firstTable) {
		isFirst = 'disabled'
		isRemoveable = false
	}

	$('#songStuff').append(`

	

	<div data-removable="${isRemoveable}" style="padding: 25px 0px">
	
	<!-- Song Name -->

	<label for="userInputSong">Song:</label>
	<input type="text" name="userInputSong" class="userInput">
	<label for="userInputArtist">Artist:</label>
	<input type="text"name="userInputArtist" class="userInput">
	<input type="button" class="button-add" onClick="addSongTable()" value="Add Song">
	<input type="button" class="button-add" onClick="setSongSpotify(this)"
		value="Set Song & timestamp from Spotify">

	<!-- Song info -->
	<table id="${tableID}" class="dataTable display" style="width:100%">
		<thead>
			<tr>
				<th></th>
				<th>Time</th>
				<th>Describe</th>
				<th>Analyze</th>
				<th>Explain</th>
				<th>Discuss</th>
				<th></th>
				<th><input type="button" class="button-add" onclick="deleteMyTable(this)" value="-" ${isFirst}></th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
	`);
	addRow(tableID, firstTable);
	document.querySelectorAll('.userInput').forEach((item) => { addAttributes(item) });

}


// word count (some got moved to onload)
function changeVis() {
	if ($('#userWC')[0].checked === true) {
		$('#wordCount').show()
	}
	else {
		$('#wordCount').hide()
	}
}





function countWords(target) {

	let res = [];
	let str = target.value
		.replace(/[\t\n\r\.\?\!]/gm, " ").split(" ");
	str.map((s) => {
		let trimStr = s.trim();
		if (trimStr.length > 0) {
			res.push(trimStr);
		}
	});

	return res.length;
}




function countWord() {
	var arrCount = $('TEXTAREA')
		.map((i, val) => countWords(val))
		.toArray()
		.reduce((total, element) => total + element,0)

	$("#wordCountNum")[0]
		.innerText = arrCount;
}








// spotify



function setSongSpotify(item) {




	item = findTableParent(item, 'div');


	$.post({
		url: 'https://api.spotify.com/v1/me/player/currently-playing',
		contentType: `Authorization: ${localStorage.token_type} ${localStorage.access_token}`
	})
		.done(function (response) {
			console.log(response)
			//item.getElementsByName("userInputSong").value = response;
			//item.getElementsByName("userInputArtist").value = '';
		});


}












/*

const getRefreshToken = async () => {

	// refresh token that has been previously stored
	const refreshToken = localStorage.getItem('refresh_token');
	const url = "https://accounts.spotify.com/api/token";

	const payload = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			//client_id: client_id
		}),
	}
	const body = await fetch(url, payload);
	const response = await body.json();

	localStorage.setItem('access_token', response.accessToken);
	if (response.refreshToken) {
		localStorage.setItem('refresh_token', response.refreshToken);
	}
}














//let client_id = 'a04eb273d28d4d9195294f6236545012';






const clientId = client_id; // Replace with your client ID
const code = params.get("code");

if (!code) {
	redirectToAuthCodeFlow(clientId);
} else {
	const accessToken = await getAccessToken(clientId, code);
	const profile = await fetchProfile(accessToken);
	console.log(profile);
	populateUI(profile);
}

async function redirectToAuthCodeFlow(clientId) {
	const verifier = generateCodeVerifier(128);
	const challenge = await generateCodeChallenge(verifier);

	localStorage.setItem("verifier", verifier);

	const params = new URLSearchParams();
	params.append("client_id", clientId);
	params.append("response_type", "code");
	params.append("redirect_uri", "http://localhost:5500/callback");
	params.append("scope", "user-read-private user-read-email");
	params.append("code_challenge_method", "S256");
	params.append("code_challenge", challenge);

	document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
	let text = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

async function generateCodeChallenge(codeVerifier) {
	const data = new TextEncoder().encode(codeVerifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);
	return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

async function getAccessToken(clientId, code) {
	const verifier = localStorage.getItem("verifier");

	const params = new URLSearchParams();
	params.append("client_id", clientId);
	params.append("grant_type", "authorization_code");
	params.append("code", code);
	params.append("redirect_uri", "http://localhost:5500/callback");
	params.append("code_verifier", verifier);

	const result = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params
	});

	const { access_token } = await result.json();
	return access_token;
}

async function fetchProfile(token) {
	const result = await fetch("https://api.spotify.com/v1/me", {
		method: "GET", headers: { Authorization: `Bearer ${token}` }
	});

	return await result.json();
}

async function fetchPlayData(token) {
	const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
		method: "GET", headers: { Authorization: `Bearer ${token}` }
	});

	return await result.json();
}

function populateUI(profile) {
	document.getElementById("displayName").innerText = profile.display_name;
	if (profile.images[0]) {
		const profileImage = new Image(200, 200);
		profileImage.src = profile.images[0].url;
		document.getElementById("avatar").appendChild(profileImage);
		document.getElementById("imgUrl").innerText = profile.images[0].url;
	}
	document.getElementById("id").innerText = profile.id;
	document.getElementById("email").innerText = profile.email;
	document.getElementById("uri").innerText = profile.uri;
	document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
	document.getElementById("url").innerText = profile.href;
	document.getElementById("url").setAttribute("href", profile.href);
}


*/