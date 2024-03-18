# MultiTouchServer

This simple WebServerSocket implememtation serves Multitouch events emitted by an IR Touch Frame. For this code do run the IR Frame must be connected to a Raspberry Pi or Linux Computer.
The client can be e.g. implemented in a Browser app. 

Im using the implementation with a Greentouch (TF Series) 32 Inch InfraRed Touch Frame: https://www.greentouch.com.cn/?list_22/302.html

When connected to a Raspberry Pi through USB, the Frame emits touch events described in the Linux Kernel Multi Touch (MT) protocol: https://www.kernel.org/doc/html/v5.0/input/multi-touch-protocol.html
which is accessible through 
```
/dev/input/event<x>.
```

You can test the events using the command line tool evtest:

```
mkroll@raspi:~ $ evtest
No device specified, trying to scan all of /dev/input/event*
Not running as root, no devices may be available.
Available devices:
...
/dev/input/event5:	Touch p403 Touch Device,32-40P
/dev/input/event6:	Touch p403 Touch Device,32-40P Mouse
/dev/input/event7:	Touch p403 Touch Device,32-40P Keyboard
...
Select the device event number [0-11]:
```

In my case I connected to /dev/input/event5 and get mt event logged similar to the following snippet:
```
Event: time 1710752263.473052, type 3 (EV_ABS), code 57 (ABS_MT_TRACKING_ID), value 61
Event: time 1710752263.473052, type 3 (EV_ABS), code 53 (ABS_MT_POSITION_X), value 26118
Event: time 1710752263.473052, type 3 (EV_ABS), code 54 (ABS_MT_POSITION_Y), value 25389
Event: time 1710752263.473052, type 3 (EV_ABS), code 52 (ABS_MT_ORIENTATION), value 0
Event: time 1710752263.473052, type 3 (EV_ABS), code 48 (ABS_MT_TOUCH_MAJOR), value 1600
Event: time 1710752263.473052, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1500
Event: time 1710752263.473052, type 1 (EV_KEY), code 330 (BTN_TOUCH), value 1
Event: time 1710752263.473052, type 3 (EV_ABS), code 0 (ABS_X), value 26118
Event: time 1710752263.473052, type 3 (EV_ABS), code 1 (ABS_Y), value 25389
Event: time 1710752263.473052, -------------- SYN_REPORT ------------
Event: time 1710752263.479024, type 3 (EV_ABS), code 48 (ABS_MT_TOUCH_MAJOR), value 1610
Event: time 1710752263.479024, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1560
Event: time 1710752263.479024, -------------- SYN_REPORT ------------
Event: time 1710752263.483017, type 3 (EV_ABS), code 48 (ABS_MT_TOUCH_MAJOR), value 1700
Event: time 1710752263.483017, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1670
Event: time 1710752263.483017, -------------- SYN_REPORT ------------
Event: time 1710752263.488034, type 3 (EV_ABS), code 48 (ABS_MT_TOUCH_MAJOR), value 1780
Event: time 1710752263.488034, -------------- SYN_REPORT ------------
Event: time 1710752263.493036, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1630
Event: time 1710752263.493036, -------------- SYN_REPORT ------------
Event: time 1710752263.504029, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1620
Event: time 1710752263.504029, -------------- SYN_REPORT ------------
Event: time 1710752263.599017, type 3 (EV_ABS), code 48 (ABS_MT_TOUCH_MAJOR), value 1690
Event: time 1710752263.599017, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1640
Event: time 1710752263.599017, -------------- SYN_REPORT ------------
Event: time 1710752263.603020, type 3 (EV_ABS), code 52 (ABS_MT_ORIENTATION), value 1
Event: time 1710752263.603020, type 3 (EV_ABS), code 48 (ABS_MT_TOUCH_MAJOR), value 1660
Event: time 1710752263.603020, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1600
Event: time 1710752263.603020, -------------- SYN_REPORT ------------
Event: time 1710752263.608066, type 3 (EV_ABS), code 52 (ABS_MT_ORIENTATION), value 0
Event: time 1710752263.608066, type 3 (EV_ABS), code 48 (ABS_MT_TOUCH_MAJOR), value 1690
Event: time 1710752263.608066, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1640
Event: time 1710752263.608066, -------------- SYN_REPORT ------------
Event: time 1710752263.618009, type 3 (EV_ABS), code 52 (ABS_MT_ORIENTATION), value 1
Event: time 1710752263.618009, type 3 (EV_ABS), code 48 (ABS_MT_TOUCH_MAJOR), value 1660
Event: time 1710752263.618009, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1600
Event: time 1710752263.618009, -------------- SYN_REPORT ------------
Event: time 1710752263.678016, type 3 (EV_ABS), code 52 (ABS_MT_ORIENTATION), value 0
Event: time 1710752263.678016, type 3 (EV_ABS), code 48 (ABS_MT_TOUCH_MAJOR), value 1670
Event: time 1710752263.678016, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1620
Event: time 1710752263.678016, -------------- SYN_REPORT ------------
Event: time 1710752263.683021, type 3 (EV_ABS), code 48 (ABS_MT_TOUCH_MAJOR), value 1690
Event: time 1710752263.683021, type 3 (EV_ABS), code 49 (ABS_MT_TOUCH_MINOR), value 1580
Event: time 1710752263.683021, -------------- SYN_REPORT ------------
Event: time 1710752263.698021, type 3 (EV_ABS), code 57 (ABS_MT_TRACKING_ID), value -1
Event: time 1710752263.698021, type 1 (EV_KEY), code 330 (BTN_TOUCH), value 0
Event: time 1710752263.698021, -------------- SYN_REPORT ------------
```
The MultiTouchServer implementation reads those events and provides them as JSON object to the connected WebSocket clients:
```
{"sec":1710751527,"usec":916474,"type":3,"value":850,"code":48}
```
