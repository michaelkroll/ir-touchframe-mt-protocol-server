const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

wss.on('connection', (ws) => {
    console.log("connection:", ws);
    ws.on('message', (messageAsString) => {
	console.log(messageAsString);
    });
});

wss.on("close", () => {
  clients.delete(ws);
    console.log("Close.", ws);
});

// Broadcast to all connections.
wss.broadcast = data => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const InputEvent = require('input-event');
const touchFrameInput = new InputEvent('/dev/input/event5');

const touchFrame = new InputEvent(touchFrameInput);
touchFrame.on('data', ev => handleMTEvent(ev));

const EV_TYPES = {
    EV_SYN: 0x00,
    EV_KEY: 0x01,    
    EV_ABS: 0x03
};

const MT_EVENTS = {
   ABS_MT_SLOT:        0x2F, // 47
   ABS_MT_TOUCH_MAJOR: 0x30, // 48
   ABS_MT_TOUCH_MINOR: 0x31, // 49
   ABS_MT_ORIENTATION: 0x34, // 52
   ABS_MT_POSITION_X:  0x35, // 53
   ABS_MT_POSITION_Y:  0x36, // 54
   ABS_MT_TRACKING_ID: 0x39  // 57
};

class MTEventDataObject {
    sec;
    usec;
    type;
    value;
}

function getEventNameByCode(eventCode) {
    switch (eventCode) {
	case 0: return "ABS_X";
	case 1: return "ABS_Y";
	case 47: return "ABS_MT_SLOT";
	case 48: return "ABS_MT_TOUCH_MAJOR";
	case 49: return "ABS_MT_TOUCH_MINOR";
	case 52: return "ABS_MT_ORIENTATION";
	case 53: return "ABS_MT_POSITION_X";
	case 54: return "ABS_MT_POSITION_Y";
	case 57: return "ABS_MT_TRACKING_ID";
	case 330: return "BTN_TOUCH"
	default: return "UNKNOWN CODE";
    }
}

let mtEventDataObject = new MTEventDataObject();

function handleMTEvent(event) {
    if (EV_TYPES.EV_ABS == event.type) {
	mtEventDataObject.sec = event.tssec;
        mtEventDataObject.usec = event.tsusec;
        mtEventDataObject.type = event.type;
        mtEventDataObject.code = event.code;
        mtEventDataObject.value = event.value;
	sendMTEventDataObject(mtEventDataObject);
	console.log("Event: time %d.%s, type 3 (EV_ABS), code %d (%s), value %d" , event.tssec, String(event.tsusec).padStart(6, '0'), event.code, getEventNameByCode(event.code), event.value);
	mtEventDataObject = new MTEventDataObject();
    }
    else if (EV_TYPES.EV_KEY == event.type) {
    	mtEventDataObject.sec = event.tssec;
        mtEventDataObject.usec = event.tsusec;
        mtEventDataObject.type = event.type;
        mtEventDataObject.code = event.code;
        mtEventDataObject.value = event.value;
	sendMTEventDataObject(mtEventDataObject);
	console.log("Event: time %d.%s, type 3 (EV_KEY), code %d (%s), value %d" , event.tssec, String(event.tsusec).padStart(6, '0'), event.code, getEventNameByCode(event.code), event.value);
	mtEventDataObject = new MTEventDataObject();
    }
    else if (EV_TYPES.EV_SYN == event.type) {
	mtEventDataObject = new MTEventDataObject();
	mtEventDataObject.sec = event.tssec;
        mtEventDataObject.usec = event.tsusec;
        mtEventDataObject.type = event.type;
	sendMTEventDataObject(mtEventDataObject);
	console.log("Event: time %d.%s, type 0 (EV_SYN) -----------------------------------------" , event.tssec, String(event.tsusec).padStart(6, '0'));
	mtEventDataObject = new MTEventDataObject();
    }
}

function sendMTEventDataObject(data) {
    const stringData = JSON.stringify(data);
    wss.broadcast(stringData);
}