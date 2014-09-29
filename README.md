widgets-html5
=============

NETLab Toolkit JavaScript version

DISCLAIMER: This is an active development branch and is quite far from being "ready for primetime"

You must first install node and npm if you have not done so.

http://www.joyent.com/blog/installing-node-and-npm 

https://gist.github.com/isaacs/579814

If you are on Raspberry Pi, then you probably have an outdated version of Node. Here's a nice & easy upgrade method: https://github.com/DonaldDerek/rPi-cheat-sheet

You will also need to install command-line tools, bower, and grunt if you do not have them already as well as Compass in the current version:
```
npm install -g grunt-cli
npm install -g bower
npm install -g grunt

sudo gem update —system
sudo gem install compass
```

To install this version of NETLab Toolkit:
```
git clone https://github.com/netlabtoolkit/widgets-html5.git
cd widgets-html5
bower install
npm install
```
To run a live-reload development server after installation run grunt in that directory:
```
grunt
```
or to run it as a standard application, run:
```
node server/app.js
```

Creating a New Widget
---------------------
Copy the Blank Widget folder located in the /app/scripts/views directory and name this new folder with the name of your widget.

This folder contains two files. A view file and a template file. Open the view file to see comments on building out a custom view.

Adding Your Custom Widget
------------------------
When you are ready to run your widget you will need to add it into the system by opening the WidgetMap.js file located in the same directory (/app/scripts/views).

Look at the top of the file in the define section:
```
define([
	'views/Blank/Blank',
	'views/AnalogIn',
	'views/AnalogOut',
	'views/Code',
	'views/ElementControl',
],
```
and add your widget like so:
```
define([
	'views/Blank/Blank',
	'views/AnalogIn',
	'views/AnalogOut',
	'views/Code',
	'views/ElementControl',
	'views/MyCustomWidget/MyCustomWidget',
],
```
Note that the ".js" at the end of the file is unnecessary.

Then pass the widget into the function call as a parameter (order is very important. Always add to the end):
```
function(Blank, AnalogIn, AnalogOut, Code, ElementControl){

...

function(Blank, AnalogIn, AnalogOut, Code, ElementControl, MyCustomWidget){
```

And finally, add your widget to the map like so:
```
	return {
		'Blank': Blank,
		'Analog In': AnalogIn,
		'Analog Out': AnalogOut,
		'Code': Code,
		'Element Control': ElementControl,
	};

...

	return {
		'Blank': Blank,
		'Analog In': AnalogIn,
		'Analog Out': AnalogOut,
		'Code': Code,
		'Element Control': ElementControl,
		'The typeID of My Custom Widget View': MyCustomWidget,
	};
```


This will both add the widget to the lefthand toolbar and allow your widget to be loaded from the GUI.
That's it!
