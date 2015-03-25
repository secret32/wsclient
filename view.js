window.addEventListener("load", init);
function get(id) { return document.getElementById(id); }

var ws;

window.onbeforeunload = function() {
	if (ws) {
		ws.onclose = function () {};
		ws.close();
	}
};

function init() {
	get("clearBtn").addEventListener("click", function() { get("receive").value = ""; });
	get("openBtn").addEventListener("click", function() {
		var val = get("serverLocation").value;
		if (val != "") connect(val);
	});
	get("closeBtn").addEventListener("click", function() {
		if (ws) ws.close();
	});
	get("sendBtn").addEventListener("click", function() {
		if (ws) {
			var val = get("send").value;
			if (get("sendBase64").checked) 
				val = utf8_to_b64(val);
			ws.send(val);
		}
	});
}

function connect(url) {
	get("status").style.background = "#ffff00";
	ws = new WebSocket(url);
	ws.onopen = function() {
		get("send").disabled = false;
		get("sendBtn").disabled = false;
		get("openBtn").style.display = "none";
		get("closeBtn").style.display = "block";		
		get("status").style.background = "#00ff00";
	};
	ws.onclose = function() {
		get("send").disabled = true;
		get("sendBtn").disabled = true;
		get("openBtn").style.display = "block";
		get("closeBtn").style.display = "none";
		get("status").style.background = "#e3e3e3";
	};
	ws.onmessage = function(evt) {
		var val = get("receive").value;
		if (val != "") val += "\n";
		if (get("receiveBase64").checked)
			val += b64_to_utf8(evt.data);
		else 
			val += evt.data;
		get("receive").value = val;
	};
	ws.onerror = function() {
		get("status").style.background = "#ff0000";
	};
}

function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
 
function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}